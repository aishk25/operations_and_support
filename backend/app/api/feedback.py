from fastapi import APIRouter
from pydantic import BaseModel
from app.agent.hindsight_client import hindsight

router = APIRouter()

class FeedbackRequest(BaseModel):
    customer_id: str
    resolved: bool
    message_id: str

@router.post("/feedback")
async def submit_feedback(req: FeedbackRequest):
    # Retain outcome into Hindsight memory
    experience = {
        "topic": "Customer Resolution Feedback",
        "summary": f"Interaction marked as {'SUCCESSFUL' if req.resolved else 'FAILED'}.",
        "attempts": [
            {
                "action": "Recommended Fix",
                "result": "SUCCESSFUL" if req.resolved else "FAILED",
                "note": "Feedback submitted by customer"
            }
        ]
    }
    hindsight.retain(req.customer_id, experience)
    return {"status": "success", "message": "Feedback retained in Hindsight persistent memory bank."}
