from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.agent.hindsight_client import hindsight

router = APIRouter()

class RecallQueryRequest(BaseModel):
    customer_id: str
    query: str

@router.get("/memory/{customer_id}")
async def get_customer_memories(customer_id: str):
    return hindsight.get_memories(customer_id)

@router.post("/memory/recall")
async def test_memory_recall(req: RecallQueryRequest):
    recalled = hindsight.recall(req.customer_id, req.query)
    matches = [recalled] if recalled else []
    return {
        "query": req.query,
        "matches": [
            {
                **m,
                "score": 0.94
            } for m in matches if m
        ]
    }
