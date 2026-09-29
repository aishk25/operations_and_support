from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class Ticket(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    subject: str
    status: str
    priority: str
    category: str
    memory_recalled: str
    created_at: str

MOCK_TICKETS = [
    {
        "id": "TKT-1042",
        "customer_id": "CUST_001",
        "customer_name": "Alice Smith",
        "subject": "Payment failing again during monthly invoice renewal",
        "status": "Open",
        "priority": "High",
        "category": "Payments & Billing",
        "memory_recalled": "Recalled previous resolution: Zip Code update worked in Mem #101",
        "created_at": "10 mins ago"
    },
    {
        "id": "TKT-1039",
        "customer_id": "CUST_002",
        "customer_name": "Bob Jones",
        "subject": "Bulk batch API returning HTTP 429 error",
        "status": "Resolved",
        "priority": "Medium",
        "category": "API & SDK",
        "memory_recalled": "Recalled backoff strategy from Mem #201",
        "created_at": "2 hours ago"
    },
    {
        "id": "TKT-1038",
        "customer_id": "CUST_003",
        "customer_name": "Carol Danvers",
        "subject": "SAML Assertion cert renewal guidance",
        "status": "Escalated",
        "priority": "Urgent",
        "category": "Security & SSO",
        "memory_recalled": "Recalled Okta setup from Mem #301",
        "created_at": "1 day ago"
    }
]

@router.get("/tickets")
async def list_tickets():
    return MOCK_TICKETS

class EscalateRequest(BaseModel):
    customer_id: str
    subject: str
    category: str
    priority: str

@router.post("/escalate")
async def escalate_ticket(req: EscalateRequest):
    new_tkt = {
        "id": f"TKT-{len(MOCK_TICKETS) + 1040}",
        "customer_id": req.customer_id,
        "customer_name": "Customer",
        "subject": req.subject,
        "status": "Escalated",
        "priority": req.priority,
        "category": req.category,
        "memory_recalled": f"Recalled memory history attached for {req.customer_id}",
        "created_at": "Just now"
    }
    MOCK_TICKETS.insert(0, new_tkt)
    return {"status": "escalated", "ticket": new_tkt}
