# functions to initialize/load ChromaDB and insert/query embeddings
from .config import CHROMA_DB_DIR
import chromadb
from typing import Tuple
from .data_loader import load_all_tickets
from .embeddings import get_embeddings

COLLECTION_NAME = "support_tickets"

def create_or_get_chroma_collection() -> Tuple[chromadb.Collection, chromadb.Client]:
    """
    Create or get the ChromaDB database
    """
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    try:
        collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)
        
        # Check if collection is empty and load data if needed
        if collection.count() == 0:
            print("ChromaDB collection is empty. Loading support tickets...")
            index_all_tickets(collection)
            print(f"Loaded {collection.count()} tickets into ChromaDB.")
        else:
            print(f"ChromaDB collection already contains {collection.count()} tickets.")
            
    except Exception as e:
        raise ValueError(f"Error creating or getting ChromaDB collection: {e}")
    return collection, chroma_client

def index_all_tickets(collection: chromadb.Collection) -> None:
    """
    Index all tickets into the ChromaDB collection
    """
    tickets = load_all_tickets()
    embeddings = get_embeddings(tickets)
    ids, metadatas, documents = [], [], []
    for ticket in tickets:
        tid = str(ticket["id"])
        doc_text = f"{ticket['subject']}\n{ticket['body']}"
        ids.append(tid)
        documents.append(doc_text)
        metadatas.append({ "ticketId": tid, "ticketSubject": ticket["subject"], "ticketResolution": ticket["resolution"] })
        
    print(f"Indexing {len(ids)} tickets into ChromaDB collection...")

    collection.upsert(
        embeddings=embeddings,
        ids=ids,
        documents=documents,
        metadatas=metadatas,
    )
        