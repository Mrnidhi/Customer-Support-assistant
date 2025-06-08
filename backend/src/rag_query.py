# given a user query: retrieve top-K, build prompt, call geminiAI, return answer
import google.generativeai as genai
from .config import CHAT_MODEL, GOOGLE_API_KEY
from .chroma_index import create_or_get_chroma_collection
from typing import List, Tuple

genai.configure(api_key=GOOGLE_API_KEY)

def query_top_k_tickets(query: str, k: int)->List[Tuple]:
    collection, chroma_client = create_or_get_chroma_collection()
    results = collection.query(
        query_texts=[query],
        n_results=k,
        include=["documents", "metadatas", "distances"],
    )
    formatted_results = []

    if not results or not results.get("ids") or not results["ids"][0]:
        return []
        
    for idx in range(len(results["ids"][0])):
        metadata = results["metadatas"][0][idx]
        ticket_id = metadata["ticketId"]
        ticket_subject = metadata["ticketSubject"]
        ticket_resolution = metadata["ticketResolution"]
        snippet = results["documents"][0][idx]
        distance = results["distances"][0][idx]
        score = 1.0 - distance
        formatted_results.append((ticket_id, ticket_subject, snippet, ticket_resolution, score))
    return formatted_results

def build_rag_prompt(query: str, relevant_tickets: List[Tuple])->str:
    prompt = f"You are a helpful support assistant. Use only the context below to answer the user query.\n"
    prompt += f"If the answer is not in the context, say \"I do not have enough information to answer.\"\n\n"
    prompt += "**Do not mention the ticket IDs or refer to the context directly.** Your response should be a direct answer to the user's question.\n\n"
    prompt += "You should use the ticket resolution to answer the user query.\n\n"
    prompt += f"## User query:\n{query}\n\n"
    prompt += "## Relevant tickets for context:\n"
    prompt += "--------------------------------\n"

    for ticket_id, ticket_subject, snippet, ticket_resolution, score in relevant_tickets:
        prompt += f"Ticket ID: {ticket_id}\n"
        prompt += f"Ticket Subject: {ticket_subject}\n"
        prompt += f"Ticket Resolution: {ticket_resolution}\n"
        prompt += f"Snippet: {snippet}\n"
        prompt += f"Similarity Score: {score:.3f}\n"
        prompt += "--------------------------------\n"
    prompt += "\n## Answer:\n"
    return prompt

def resolve_query(query: str, k: int = 5)->str:
    top_k_tickets = query_top_k_tickets(query, k)
    if not top_k_tickets:
        return "I could not find any relevant tickets to answer your question."
        
    rag_prompt = build_rag_prompt(query, top_k_tickets)
    
    model = genai.GenerativeModel(CHAT_MODEL)
    response = model.generate_content(
        rag_prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.6,
            max_output_tokens=1000,
        ),
    )
    print(response)
    return response.text