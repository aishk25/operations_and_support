from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, memory, tickets, feedback
from app.agent.hindsight_client import hindsight

app = FastAPI(
    title="Hindsight Customer Support Agent API",
    description="Backend API for AI Customer Support Agent with Hindsight Persistent Memory",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(memory.router, prefix="/api", tags=["Hindsight Memory"])
app.include_router(tickets.router, prefix="/api", tags=["Support Tickets"])
app.include_router(feedback.router, prefix="/api", tags=["Feedback"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Hindsight Support Agent API",
        "hindsight_bank": hindsight.bank_id,
        "docs_url": "/docs"
    }

@app.get("/api/customers")
async def get_customers():
    return [
        {
            "id": "CUST_001",
            "name": "Alice Smith",
            "company": "Apex Tech Inc",
            "email": "alice@apextech.io",
            "plan": "Enterprise",
            "environment": "Web / Chrome 122 / React App",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "stats": {"totalTickets": 12, "memoryBankSize": 8, "csat": 4.8}
        },
        {
            "id": "CUST_002",
            "name": "Bob Jones",
            "company": "CloudScale Systems",
            "email": "bob@cloudscale.net",
            "plan": "Pro Scale",
            "environment": "Python SDK v2.4 / Linux Server",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "stats": {"totalTickets": 5, "memoryBankSize": 4, "csat": 4.5}
        },
        {
            "id": "CUST_003",
            "name": "Carol Danvers",
            "company": "Nova Fintech",
            "email": "carol@novafin.com",
            "plan": "Enterprise VIP",
            "environment": "Node.js v20 / Stripe Integration / AWS",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "stats": {"totalTickets": 18, "memoryBankSize": 14, "csat": 5.0}
        }
    ]

@app.get("/api/knowledge")
async def get_knowledge():
    return [
        {
            "id": "kb-01",
            "title": "Resolving Payment & Card Decline Failures",
            "category": "Payments",
            "summary": "Troubleshooting steps for HTTP 402, bank authorization flags, and card update workflows.",
            "content": "When a payment fails, check bank authorization, verify billing zip code match, and clear expired payment tokens in account billing settings."
        },
        {
            "id": "kb-02",
            "title": "API Rate Limits & Exponential Backoff Guidelines",
            "category": "Developer API",
            "summary": "Rate limit thresholds per tier (Free: 20 req/min, Pro: 200 req/min, Enterprise: 2000 req/min).",
            "content": "Always implement exponential backoff with jitter when receiving HTTP 429 Too Many Requests."
        },
        {
            "id": "kb-03",
            "title": "SSO SAML 2.0 & Identity Provider Configuration",
            "category": "Security",
            "summary": "Configuring SAML assertion URLs, x509 certificates, and Okta/Azure AD integration.",
            "content": "Ensure server clocks are synced using NTP to avoid SAML assertion validation timeouts."
        }
    ]

@app.post("/api/demo/seed")
async def seed_demo(req: dict):
    cust_id = req.get("customer_id", "CUST_001")
    experience = {
        "topic": "Payment Authorization Token Refresh",
        "summary": "Customer renewed 3D-Secure bank token.",
        "attempts": [
            {"action": "Re-authorize 3D-Secure in Bank App", "result": "SUCCESSFUL", "note": "Token active"}
        ]
    }
    hindsight.retain(cust_id, experience)
    return {"status": "seeded", "message": f"Demo data seeded for {cust_id}"}
