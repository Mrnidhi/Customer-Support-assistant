# load API keys, constants
import os
from dotenv import load_dotenv

load_dotenv()

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
CHAT_MODEL = os.getenv("CHAT_MODEL", "gemini-1.5-flash-latest")
CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "chroma_data")
TICKETS_JSON = os.getenv("TICKETS_JSON", "data/support_tickets.json")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
