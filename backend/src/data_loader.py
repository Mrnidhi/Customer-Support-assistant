from typing import List, Dict
from .config import TICKETS_JSON
import json
from pathlib import Path

def load_all_tickets() -> List[Dict]:
    """
    Load all tickets from the JSON file
    """
    json_path = Path(TICKETS_JSON)
    if json_path.exists() and json_path.stat().st_size > 0:
        with open(json_path, "r") as f:
            return json.load(f)
    else:
        raise FileNotFoundError(f"File {json_path} not found or empty")
