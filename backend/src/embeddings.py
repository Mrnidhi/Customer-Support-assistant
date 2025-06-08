from sentence_transformers import SentenceTransformer
from typing import List, Dict
from .config import EMBEDDING_MODEL

def get_embeddings(support_tickets: List[Dict]) -> List[List[float]]:
    """
    Get the embeddings for a given list of texts
    """
    texts = [f"{ticket['subject']}\n{ticket['body']}" for ticket in support_tickets]
    model = SentenceTransformer(EMBEDDING_MODEL)
    return model.encode(texts)