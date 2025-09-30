"""
Embedding Generation Module

This module handles the generation of vector embeddings for support tickets
using the SentenceTransformers library. It provides functions to convert
textual ticket data into high-dimensional vectors suitable for semantic search.

The embeddings capture semantic meaning rather than just keywords, enabling
the system to find relevant tickets even when users phrase questions differently
than the original ticket text.
"""

from sentence_transformers import SentenceTransformer
import logging
from typing import List, Dict, Optional
import numpy as np
from .config import EMBEDDING_MODEL

# Configure logging
logger = logging.getLogger(__name__)

# Global model cache to avoid reloading the model
_model_cache: Optional[SentenceTransformer] = None

def _get_embedding_model() -> SentenceTransformer:
    """
    Get the embedding model, using cached instance if available.
    
    Returns:
        SentenceTransformer model instance
    """
    global _model_cache
    
    if _model_cache is None:
        try:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
            _model_cache = SentenceTransformer(EMBEDDING_MODEL)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading embedding model: {e}")
            raise ValueError(f"Failed to load embedding model {EMBEDDING_MODEL}: {e}")
    
    return _model_cache

def get_embeddings(support_tickets: List[Dict]) -> List[List[float]]:
    """
    Generate embeddings for a list of support tickets.
    
    This function takes a list of support tickets and converts them into
    high-dimensional vector embeddings suitable for semantic similarity search.
    The embeddings capture the semantic meaning of both the ticket subject
    and body content.
    
    Args:
        support_tickets: List of dictionaries containing ticket data with
                        'subject' and 'body' fields
        
    Returns:
        List of embedding vectors (each vector is a list of floats)
        
    Raises:
        ValueError: If input data is invalid or model fails to process
    """
    if not support_tickets:
        logger.warning("Empty ticket list provided for embedding generation")
        return []
    
    try:
        # Prepare text data for embedding
        texts = []
        for ticket in support_tickets:
            subject = ticket.get("subject", "")
            body = ticket.get("body", "")
            
            # Combine subject and body with clear separation
            combined_text = f"{subject}\n\n{body}".strip()
            
            # Skip empty tickets
            if not combined_text:
                logger.warning(f"Skipping empty ticket: {ticket.get('id', 'unknown')}")
                continue
                
            texts.append(combined_text)
        
        if not texts:
            logger.error("No valid text content found in tickets")
            return []
        
        logger.info(f"Generating embeddings for {len(texts)} ticket texts")
        
        # Get the embedding model and generate embeddings
        model = _get_embedding_model()
        
        # Generate embeddings with batching for efficiency
        embeddings = model.encode(
            texts,
            batch_size=32,  # Process in batches for better performance
            show_progress_bar=True,
            convert_to_numpy=True
        )
        
        # Convert numpy arrays to lists for JSON serialization
        embedding_list = [embedding.tolist() for embedding in embeddings]
        
        logger.info(f"Successfully generated {len(embedding_list)} embeddings")
        return embedding_list
        
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        raise ValueError(f"Failed to generate embeddings: {e}")

def get_query_embedding(query: str) -> List[float]:
    """
    Generate embedding for a single query string.
    
    This function is useful for generating embeddings for user queries
    to perform similarity search against the indexed ticket embeddings.
    
    Args:
        query: The user's question/query string
        
    Returns:
        Embedding vector as a list of floats
    """
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    
    try:
        model = _get_embedding_model()
        embedding = model.encode([query.strip()], convert_to_numpy=True)
        return embedding[0].tolist()
    except Exception as e:
        logger.error(f"Error generating query embedding: {e}")
        raise ValueError(f"Failed to generate query embedding: {e}")