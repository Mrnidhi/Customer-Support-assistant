"""
RAG Query Processing Module

This module handles the core RAG (Retrieval-Augmented Generation) pipeline:
1. Semantic search over the knowledge base
2. Context assembly for the LLM
3. Response generation using Google Gemini

The system is designed to provide accurate, contextual answers based on
historical support ticket data while maintaining transparency about sources.
"""

import google.generativeai as genai
import logging
from typing import List, Tuple, Optional
from .config import CHAT_MODEL, GOOGLE_API_KEY, DEFAULT_TOP_K, MAX_TOP_K
from .chroma_index import create_or_get_chroma_collection

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Google Generative AI
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    logger.error("Google API key not found. Please set GOOGLE_API_KEY in your environment.")

def query_top_k_tickets(query: str, k: int = DEFAULT_TOP_K) -> List[Tuple]:
    """
    Retrieve the top-k most relevant support tickets for a given query.
    
    Uses semantic similarity search over the vectorized knowledge base to find
    the most relevant historical support tickets that can help answer the user's question.
    
    Args:
        query: The user's natural language question
        k: Number of top results to retrieve (default: 5, max: 10)
        
    Returns:
        List of tuples containing (ticket_id, subject, snippet, resolution, score)
    """
    # Validate input parameters
    if k > MAX_TOP_K:
        k = MAX_TOP_K
        logger.warning(f"Top-k value capped at {MAX_TOP_K}")
    
    if not query or not query.strip():
        logger.warning("Empty query provided")
        return []
    
    try:
        # Get the ChromaDB collection
        collection, chroma_client = create_or_get_chroma_collection()
        
        # Perform semantic search
        results = collection.query(
            query_texts=[query.strip()],
            n_results=k,
            include=["documents", "metadatas", "distances"],
        )
        
        formatted_results = []
        
        # Handle empty results
        if not results or not results.get("ids") or not results["ids"][0]:
            logger.info(f"No results found for query: '{query[:50]}...'")
            return []
        
        # Process and format results
        for idx in range(len(results["ids"][0])):
            try:
                metadata = results["metadatas"][0][idx]
                ticket_id = metadata.get("ticketId", "unknown")
                ticket_subject = metadata.get("ticketSubject", "No subject")
                ticket_resolution = metadata.get("ticketResolution", "No resolution available")
                snippet = results["documents"][0][idx]
                distance = results["distances"][0][idx]
                
                # Convert distance to similarity score (lower distance = higher similarity)
                score = max(0.0, 1.0 - distance)
                
                formatted_results.append((
                    ticket_id,
                    ticket_subject,
                    snippet,
                    ticket_resolution,
                    score
                ))
                
            except Exception as e:
                logger.error(f"Error processing result at index {idx}: {e}")
                continue
        
        logger.info(f"Retrieved {len(formatted_results)} relevant tickets for query")
        return formatted_results
        
    except Exception as e:
        logger.error(f"Error during semantic search: {e}")
        return []

def build_rag_prompt(query: str, relevant_tickets: List[Tuple]) -> str:
    """
    Build a comprehensive prompt for the LLM using retrieved context.
    
    This function creates a structured prompt that includes:
    - Clear instructions for the AI assistant
    - The user's original question
    - Relevant support ticket context with metadata
    - Guidelines for response generation
    
    Args:
        query: The user's original question
        relevant_tickets: List of relevant tickets with metadata and scores
        
    Returns:
        Formatted prompt string for the LLM
    """
    if not relevant_tickets:
        return f"""You are a helpful customer support assistant. The user has asked: "{query}"

Unfortunately, I couldn't find any relevant historical support tickets to answer this question. Please provide a helpful response based on general support knowledge, and suggest that the user contact support directly for more specific assistance.

Answer:"""

    prompt = """You are an expert customer support assistant with access to a comprehensive knowledge base of historical support tickets. Your role is to provide accurate, helpful, and actionable answers based on how similar issues have been resolved in the past.

IMPORTANT GUIDELINES:
- Provide a direct, helpful answer to the user's question
- Base your response primarily on the ticket resolutions provided below
- If the context doesn't contain enough information, supplement with general support knowledge
- Be concise but thorough in your explanations
- Include actionable steps when applicable
- Do NOT mention ticket IDs, scores, or refer to "the context below"
- Write as if you're directly answering the customer

"""
    
    prompt += f"## User Question:\n{query}\n\n"
    prompt += "## Relevant Support Cases:\n"
    prompt += "=" * 50 + "\n"

    for ticket_id, ticket_subject, snippet, ticket_resolution, score in relevant_tickets:
        prompt += f"Case: {ticket_subject}\n"
        prompt += f"Description: {snippet[:200]}{'...' if len(snippet) > 200 else ''}\n"
        prompt += f"Resolution: {ticket_resolution}\n"
        prompt += f"Relevance: {score:.1%}\n"
        prompt += "-" * 30 + "\n"
    
    prompt += "\n## Your Response:\n"
    return prompt

def resolve_query(query: str, k: int = DEFAULT_TOP_K) -> str:
    """
    Main RAG pipeline function that processes a user query and returns an AI-generated answer.
    
    This function orchestrates the complete RAG process:
    1. Retrieves relevant tickets using semantic search
    2. Builds a contextual prompt for the LLM
    3. Generates a natural language response using Google Gemini
    
    Args:
        query: The user's natural language question
        k: Number of relevant tickets to retrieve for context
        
    Returns:
        AI-generated answer based on relevant support ticket data
    """
    try:
        # Step 1: Retrieve relevant tickets
        top_k_tickets = query_top_k_tickets(query, k)
        
        if not top_k_tickets:
            logger.warning(f"No relevant tickets found for query: '{query[:50]}...'")
            return ("I couldn't find any relevant support tickets to answer your question. "
                   "This might be a new type of issue. Please contact our support team directly "
                   "for personalized assistance.")
        
        # Step 2: Build the RAG prompt
        rag_prompt = build_rag_prompt(query, top_k_tickets)
        
        # Step 3: Generate response using Google Gemini
        if not GOOGLE_API_KEY:
            logger.error("Google API key not configured")
            return "Error: AI service is not properly configured. Please contact support."
        
        model = genai.GenerativeModel(CHAT_MODEL)
        
        # Configure generation parameters for consistent, helpful responses
        generation_config = genai.GenerationConfig(
            temperature=0.3,  # Lower temperature for more focused responses
            max_output_tokens=800,  # Reasonable limit for support responses
            top_p=0.8,  # Nucleus sampling for better quality
            top_k=40,  # Limit vocabulary for more relevant responses
        )
        
        response = model.generate_content(
            rag_prompt,
            generation_config=generation_config,
        )
        
        if not response or not response.text:
            logger.error("Empty response from Gemini model")
            return ("I apologize, but I'm having trouble generating a response right now. "
                   "Please try rephrasing your question or contact support directly.")
        
        logger.info(f"Successfully generated response for query: '{query[:50]}...'")
        return response.text.strip()
        
    except Exception as e:
        logger.error(f"Error in RAG pipeline: {e}")
        return (f"I encountered an error while processing your question. "
               f"Please try again or contact our support team for assistance. "
               f"Error: {str(e)}")