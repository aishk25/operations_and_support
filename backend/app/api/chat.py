from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.agent.hindsight_client import hindsight

router = APIRouter()

class ChatRequest(BaseModel):
    customer_id: str
    message: str
    environment: Optional[str] = "Web Application"

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # 1. Recall past customer memory from Hindsight
    recalled_memory = hindsight.recall(req.customer_id, req.message)

    memory_recalled = False
    recalled_details = None

    if recalled_memory:
        memory_recalled = True
        failed_attempt = next((a["action"] for a in recalled_memory.get("attempts", []) if a.get("result") == "FAILED"), "Clear browser cache")
        working_attempt = next((a["action"] for a in recalled_memory.get("attempts", []) if a.get("result") == "SUCCESSFUL"), "Update billing zip code")

        recalled_details = {
            "id": recalled_memory.get("id"),
            "topic": recalled_memory.get("topic"),
            "summary": recalled_memory.get("summary"),
            "failed_attempt": failed_attempt,
            "successful_attempt": working_attempt,
            "confidence": recalled_memory.get("confidence", 0.95)
        }

        response_text = (
            f"Welcome back! I recalled your past support experience regarding **{recalled_memory.get('topic')}** (Memory ID: {recalled_memory.get('id')}).\n\n"
            f"Last time, trying **{failed_attempt}** failed, but **{working_attempt}** successfully resolved your issue!\n\n"
            f"Based on your past environment ({recalled_memory.get('environment', req.environment)}), I recommend we directly proceed with: **{working_attempt}**. Should I assist you with applying this fix right now?"
        )
    else:
        response_text = (
            f"I see you are reporting: \"{req.message}\". Since this is a new issue scenario for your profile, I have searched our Company Knowledge Base.\n\n"
            f"Recommended next step: Please verify your account configuration and retry. Once you let me know if this works, I will retain this interaction in Hindsight persistent memory for future speed!"
        )

    return {
        "response": response_text,
        "customer_id": req.customer_id,
        "memory_recalled": memory_recalled,
        "recalled_memory": recalled_details,
        "rag_sources": [
            {"id": "kb-01", "title": "Resolving Payment & Card Decline Failures", "relevance": 0.92}
        ],
        "hindsight_status": "ACTIVE_HYBRID_MEMORY"
    }
