"""
ChromaDB Index Management Module

This module handles the creation, initialization, and management of the ChromaDB
vector database used for semantic search over support tickets. It provides
functions to create collections, index tickets, and manage embeddings.

The system uses ChromaDB for efficient similarity search and retrieval of
relevant support tickets based on semantic similarity rather than keyword matching.
"""

import chromadb
import logging
from typing import Tuple, Optional
from pathlib import Path
from .config import CHROMA_DB_DIR, COLLECTION_NAME
from .data_loader import load_all_tickets
from .embeddings import get_embeddings

# Configure logging
logger = logging.getLogger(__name__)

def create_or_get_chroma_collection() -> Tuple[chromadb.Collection, chromadb.Client]:
    """
    Create or get the ChromaDB collection for support tickets.
    
    This function initializes the ChromaDB client and collection, automatically
    loading support ticket data if the collection is empty. It handles both
    first-time setup and subsequent application starts.
    
    Returns:
        Tuple of (collection, client) for use in query operations
        
    Raises:
        ValueError: If there's an error initializing ChromaDB
    """
    try:
        # Ensure the database directory exists
        db_path = Path(CHROMA_DB_DIR)
        db_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize ChromaDB client with persistent storage
        chroma_client = chromadb.PersistentClient(
            path=str(db_path),
            settings=chromadb.Settings(
                anonymized_telemetry=False,  # Disable telemetry for privacy
                allow_reset=True
            )
        )
        
        logger.info(f"Initialized ChromaDB client at {db_path}")
        
        # Get or create the collection
        try:
            collection = chroma_client.get_collection(name=COLLECTION_NAME)
            logger.info(f"Retrieved existing collection: {COLLECTION_NAME}")
        except ValueError:
            # Collection doesn't exist, create it
            collection = chroma_client.create_collection(
                name=COLLECTION_NAME,
                metadata={"description": "Support tickets knowledge base"}
            )
            logger.info(f"Created new collection: {COLLECTION_NAME}")
        
        # Check if collection is empty and load data if needed
        ticket_count = collection.count()
        if ticket_count == 0:
            logger.info("Collection is empty. Loading support tickets...")
            index_all_tickets(collection)
            final_count = collection.count()
            logger.info(f"Successfully loaded {final_count} tickets into ChromaDB")
        else:
            logger.info(f"Collection already contains {ticket_count} tickets")
            
        return collection, chroma_client
        
    except Exception as e:
        logger.error(f"Error initializing ChromaDB: {e}")
        raise ValueError(f"Failed to initialize ChromaDB collection: {e}")

def index_all_tickets(collection: chromadb.Collection) -> None:
    """
    Index all support tickets into the ChromaDB collection.
    
    This function loads all support tickets from the data source, generates
    embeddings for semantic search, and stores them in the ChromaDB collection
    with appropriate metadata for retrieval and filtering.
    
    Args:
        collection: The ChromaDB collection to index tickets into
    """
    try:
        # Load all tickets from the data source
        tickets = load_all_tickets()
        if not tickets:
            logger.warning("No tickets found to index")
            return
        
        logger.info(f"Loading {len(tickets)} support tickets for indexing...")
        
        # Generate embeddings for all tickets
        logger.info("Generating embeddings for support tickets...")
        embeddings = get_embeddings(tickets)
        
        # Prepare data for ChromaDB insertion
        ids, metadatas, documents = [], [], []
        
        for ticket in tickets:
            try:
                # Create unique ID for the ticket
                ticket_id = str(ticket.get("id", f"ticket_{len(ids)}"))
                
                # Combine subject and body for comprehensive text representation
                subject = ticket.get("subject", "No subject")
                body = ticket.get("body", "No description")
                doc_text = f"{subject}\n\n{body}"
                
                # Prepare metadata for filtering and display
                metadata = {
                    "ticketId": ticket_id,
                    "ticketSubject": subject,
                    "ticketResolution": ticket.get("resolution", "No resolution provided"),
                    "ticketStatus": ticket.get("status", "unknown"),
                    "ticketPriority": ticket.get("priority", "normal"),
                    "created_at": ticket.get("created_at", ""),
                }
                
                ids.append(ticket_id)
                documents.append(doc_text)
                metadatas.append(metadata)
                
            except Exception as e:
                logger.error(f"Error processing ticket {ticket.get('id', 'unknown')}: {e}")
                continue
        
        if not ids:
            logger.error("No valid tickets to index")
            return
        
        logger.info(f"Indexing {len(ids)} tickets into ChromaDB collection...")
        
        # Insert tickets into ChromaDB with embeddings
        collection.upsert(
            embeddings=embeddings,
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )
        
        logger.info(f"Successfully indexed {len(ids)} tickets into ChromaDB")
        
    except Exception as e:
        logger.error(f"Error during ticket indexing: {e}")
        raise ValueError(f"Failed to index tickets: {e}")


def get_collection_stats(collection: chromadb.Collection) -> dict:
    """
    Get statistics about the ChromaDB collection.
    
    Args:
        collection: The ChromaDB collection to analyze
        
    Returns:
        Dictionary containing collection statistics
    """
    try:
        count = collection.count()
        return {
            "total_tickets": count,
            "collection_name": collection.name,
            "status": "healthy" if count > 0 else "empty"
        }
    except Exception as e:
        logger.error(f"Error getting collection stats: {e}")
        return {"status": "error", "message": str(e)}
        