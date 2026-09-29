import os
import time
import requests
from typing import List, Dict, Any, Optional
from app.config import settings

class HindsightClient:
    def __init__(self):
        self.api_key = settings.HINDSIGHT_API_KEY
        self.base_url = settings.HINDSIGHT_BASE_URL.rstrip('/')
        self.bank_id = settings.HINDSIGHT_BANK_ID
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Local embedded Memory Bank storage for seamless offline demo
        self.local_memory_bank: Dict[str, List[Dict[str, Any]]] = {
            "CUST_001": [
                {
                    "id": "mem-101",
                    "topic": "Payment Failure",
                    "summary": "Customer encountered HTTP 402 Card Declined during checkout renewal.",
                    "attempts": [
                        {"action": "Clear browser cache & cookies", "result": "FAILED", "note": "Error persisted"},
                        {"action": "Update billing address zip code & card details", "result": "SUCCESSFUL", "note": "Payment processed instantly"}
                    ],
                    "environment": "Chrome 122 / Stripe Gateway / Web",
                    "confidence": 0.96,
                    "timestamp": "2026-09-20T10:15:00Z",
                    "recall_count": 7
                },
                {
                    "id": "mem-102",
                    "topic": "Webhook Signature Mismatch",
                    "summary": "Stripe webhook endpoint returned 401 Unauthorized due to outdated secret token.",
                    "attempts": [
                        {"action": "Re-generate webhook signing secret in portal", "result": "SUCCESSFUL", "note": "Events synced successfully"}
                    ],
                    "environment": "Node.js / Stripe Webhook API",
                    "confidence": 0.92,
                    "timestamp": "2026-09-24T14:30:00Z",
                    "recall_count": 4
                }
            ],
            "CUST_002": [
                {
                    "id": "mem-201",
                    "topic": "API Rate Limit 429",
                    "summary": "Python script hit 100 req/min threshold during bulk data ingestion.",
                    "attempts": [
                        {"action": "Increase request timeout parameter", "result": "FAILED", "note": "Rate limit still triggered"},
                        {"action": "Implement exponential backoff retry logic & upgraded to Pro Scale plan", "result": "SUCCESSFUL", "note": "Ingestion completed smoothly"}
                    ],
                    "environment": "Python 3.11 / REST API / Linux",
                    "confidence": 0.94,
                    "timestamp": "2026-09-22T08:45:00Z",
                    "recall_count": 5
                }
            ],
            "CUST_003": [
                {
                    "id": "mem-301",
                    "topic": "SSO SAML Login Error",
                    "summary": "Okta SAML assertion failed due to clock skew between servers.",
                    "attempts": [
                        {"action": "Sync NTP server time on authentication host", "result": "SUCCESSFUL", "note": "Okta SSO active"}
                    ],
                    "environment": "Enterprise Okta SSO / SAML 2.0",
                    "confidence": 0.98,
                    "timestamp": "2026-09-18T16:20:00Z",
                    "recall_count": 9
                }
            ]
        }

    def recall(self, customer_id: str, query: str) -> Optional[Dict[str, Any]]:
        """Recalls relevant memories for customer from Hindsight API or local bank."""
        if self.api_key:
            try:
                url = f"{self.base_url}/banks/{self.bank_id}/recall"
                payload = {"query": query, "filter": {"customer_id": customer_id}}
                res = requests.post(url, json=payload, headers=self.headers, timeout=5)
                if res.status_code == 200:
                    return res.json()
            except Exception as e:
                print(f"Hindsight Cloud API error: {e}, falling back to embedded memory bank")

        # Fallback local memory recall
        memories = self.local_memory_bank.get(customer_id, [])
        query_lower = query.lower()

        for mem in memories:
            if any(term in query_lower for term in ["payment", "card", "billing", "checkout"]) and "Payment" in mem["topic"]:
                return mem
            if any(term in query_lower for term in ["rate", "limit", "429", "timeout"]) and "Rate" in mem["topic"]:
                return mem
            if any(term in query_lower for term in ["sso", "saml", "okta", "login"]) and "SSO" in mem["topic"]:
                return mem

        return memories[0] if memories else None

    def retain(self, customer_id: str, experience: Dict[str, Any]) -> bool:
        """Stores a new support experience into Hindsight."""
        if self.api_key:
            try:
                url = f"{self.base_url}/banks/{self.bank_id}/retain"
                payload = {"customer_id": customer_id, "memory": experience}
                res = requests.post(url, json=payload, headers=self.headers, timeout=5)
                if res.status_code in [200, 201]:
                    return True
            except Exception as e:
                print(f"Hindsight Retain API error: {e}")

        # Local storage update
        if customer_id not in self.local_memory_bank:
            self.local_memory_bank[customer_id] = []
        
        new_mem = {
            "id": f"mem-{int(time.time())}",
            "topic": experience.get("topic", "Support Interaction"),
            "summary": experience.get("summary", "Customer issue resolution retained."),
            "attempts": experience.get("attempts", []),
            "environment": experience.get("environment", "Web Application"),
            "confidence": 0.95,
            "timestamp": time.strftime("%Y-%m-%d%H:%M:%SZ"),
            "recall_count": 1
        }
        self.local_memory_bank[customer_id].append(new_mem)
        return True

    def get_memories(self, customer_id: str) -> List[Dict[str, Any]]:
        return self.local_memory_bank.get(customer_id, [])

hindsight = HindsightClient()
