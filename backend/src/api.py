from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .rag_query import resolve_query

app = FastAPI(title="Support Q&A API")

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class MatchItem(BaseModel):
    ticket_id: str 
    subject: str
    snippet: str
    resolution: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    matches: List[MatchItem]

@app.post("/answer", response_model=QueryResponse)
async def get_answer(req: QueryRequest):
    q = req.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question must not be empty.")
    
    from .rag_query import query_top_k_tickets
    
    answer = resolve_query(q, k=req.top_k)
    
    top_k_tickets = query_top_k_tickets(q, req.top_k)
    matches = [
        MatchItem(
            ticket_id=ticket_id,
            subject=ticket_subject,
            snippet=snippet,
            resolution=ticket_resolution,
            score=score
        ) for ticket_id, ticket_subject, snippet, ticket_resolution, score in top_k_tickets
    ]
    
    return QueryResponse(answer=answer, matches=matches)
