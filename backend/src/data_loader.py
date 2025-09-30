"""
Data Loading Module

This module handles loading and preprocessing of support ticket data from various
sources. It provides functions to load tickets from JSON files and can be extended
to support other data sources like databases, APIs, or CSV files.

The module ensures data quality and provides proper error handling for missing
or malformed data files.
"""

from typing import List, Dict, Optional
import json
import logging
from pathlib import Path
from .config import TICKETS_JSON

# Configure logging
logger = logging.getLogger(__name__)

def load_all_tickets() -> List[Dict]:
    """
    Load all support tickets from the configured JSON file.
    
    This function reads the support tickets from the JSON file specified in
    the configuration and performs basic validation to ensure data quality.
    
    Returns:
        List of dictionaries containing ticket data
        
    Raises:
        FileNotFoundError: If the tickets file doesn't exist
        ValueError: If the file is empty or contains invalid JSON
    """
    json_path = Path(TICKETS_JSON)
    
    try:
        # Check if file exists
        if not json_path.exists():
            logger.error(f"Tickets file not found: {json_path}")
            raise FileNotFoundError(f"Tickets file not found: {json_path}")
        
        # Check if file has content
        if json_path.stat().st_size == 0:
            logger.error(f"Tickets file is empty: {json_path}")
            raise ValueError(f"Tickets file is empty: {json_path}")
        
        logger.info(f"Loading tickets from: {json_path}")
        
        # Load and parse JSON data
        with open(json_path, "r", encoding="utf-8") as f:
            tickets = json.load(f)
        
        # Validate data structure
        if not isinstance(tickets, list):
            logger.error("Tickets data is not a list")
            raise ValueError("Tickets data must be a list of ticket objects")
        
        if not tickets:
            logger.warning("No tickets found in the data file")
            return []
        
        # Validate individual tickets and filter out invalid ones
        valid_tickets = []
        for i, ticket in enumerate(tickets):
            if _validate_ticket(ticket, i):
                valid_tickets.append(ticket)
        
        logger.info(f"Loaded {len(valid_tickets)} valid tickets out of {len(tickets)} total")
        
        if not valid_tickets:
            raise ValueError("No valid tickets found in the data file")
        
        return valid_tickets
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in tickets file: {e}")
        raise ValueError(f"Invalid JSON in tickets file: {e}")
    except Exception as e:
        logger.error(f"Error loading tickets: {e}")
        raise

def _validate_ticket(ticket: Dict, index: int) -> bool:
    """
    Validate a single ticket object.
    
    Args:
        ticket: The ticket dictionary to validate
        index: The index of the ticket in the list (for error reporting)
        
    Returns:
        True if the ticket is valid, False otherwise
    """
    if not isinstance(ticket, dict):
        logger.warning(f"Ticket at index {index} is not a dictionary, skipping")
        return False
    
    # Check for required fields
    required_fields = ["id", "subject", "body"]
    for field in required_fields:
        if field not in ticket:
            logger.warning(f"Ticket at index {index} missing required field '{field}', skipping")
            return False
        
        if not ticket[field] or not str(ticket[field]).strip():
            logger.warning(f"Ticket at index {index} has empty '{field}', skipping")
            return False
    
    # Ensure ID is a valid identifier
    try:
        ticket_id = str(ticket["id"]).strip()
        if not ticket_id:
            logger.warning(f"Ticket at index {index} has invalid ID, skipping")
            return False
    except:
        logger.warning(f"Ticket at index {index} has non-string ID, skipping")
        return False
    
    return True

def get_ticket_sample(n: int = 5) -> List[Dict]:
    """
    Get a sample of tickets for testing or preview purposes.
    
    Args:
        n: Number of tickets to return (default: 5)
        
    Returns:
        List of sample ticket dictionaries
    """
    try:
        all_tickets = load_all_tickets()
        return all_tickets[:min(n, len(all_tickets))]
    except Exception as e:
        logger.error(f"Error getting ticket sample: {e}")
        return []

def get_ticket_stats() -> Dict[str, int]:
    """
    Get basic statistics about the loaded tickets.
    
    Returns:
        Dictionary containing ticket statistics
    """
    try:
        tickets = load_all_tickets()
        
        # Count tickets by status if available
        status_counts = {}
        priority_counts = {}
        
        for ticket in tickets:
            status = ticket.get("status", "unknown")
            priority = ticket.get("priority", "unknown")
            
            status_counts[status] = status_counts.get(status, 0) + 1
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
        
        return {
            "total_tickets": len(tickets),
            "status_breakdown": status_counts,
            "priority_breakdown": priority_counts
        }
        
    except Exception as e:
        logger.error(f"Error getting ticket stats: {e}")
        return {"error": str(e)}
