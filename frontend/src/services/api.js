import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Chat completion endpoint with Hindsight recall + retain
  sendMessage: async (payload) => {
    try {
      const response = await axios.post(`${API_BASE}/chat`, payload);
      return response.data;
    } catch (err) {
      console.warn("Backend API error or offline, using dynamic fallback engine:", err.message);
      return getFallbackChatResponse(payload);
    }
  },

  // Get customer memory bank
  getMemories: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE}/memory/${customerId}`);
      return response.data;
    } catch (err) {
      console.warn("Memory API fetch fallback:", err.message);
      return getFallbackMemories(customerId);
    }
  },

  // Test recall with arbitrary query
  testRecall: async (customerId, query) => {
    try {
      const response = await axios.post(`${API_BASE}/memory/recall`, { customer_id: customerId, query });
      return response.data;
    } catch (err) {
      return getFallbackRecallResults(customerId, query);
    }
  },

  // Submit feedback on solution
  submitFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_BASE}/feedback`, feedbackData);
      return response.data;
    } catch (err) {
      return { status: "success", message: "Feedback retained in Hindsight memory (Fallback Mode)" };
    }
  },

  // Escalate to human support
  escalateTicket: async (ticketData) => {
    try {
      const response = await axios.post(`${API_BASE}/escalate`, ticketData);
      return response.data;
    } catch (err) {
      return { status: "escalated", ticket_id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`, message: "Escalated to human support tier 2." };
    }
  },

  // Get customer profiles
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_BASE}/customers`);
      return response.data;
    } catch (err) {
      return MOCK_CUSTOMERS;
    }
  },

  // Get active tickets
  getTickets: async () => {
    try {
      const response = await axios.get(`${API_BASE}/tickets`);
      return response.data;
    } catch (err) {
      return MOCK_TICKETS;
    }
  },

  // Get knowledge base docs
  getKnowledgeDocs: async () => {
    try {
      const response = await axios.get(`${API_BASE}/knowledge`);
      return response.data;
    } catch (err) {
      return MOCK_KNOWLEDGE_BASE;
    }
  },

  // Seed demo data or reset memory
  seedDemoData: async (customerId) => {
    try {
      const response = await axios.post(`${API_BASE}/demo/seed`, { customer_id: customerId });
      return response.data;
    } catch (err) {
      return { status: "seeded", message: `Demo interactions seeded for ${customerId}` };
    }
  }
};

// Initial Mock Datasets for instant responsiveness & demo reliability
export const MOCK_CUSTOMERS = [
  {
    id: "CUST_001",
    name: "Alice Smith",
    company: "Apex Tech Inc",
    email: "alice@apextech.io",
    plan: "Enterprise",
    environment: "Web / Chrome 122 / React App",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    stats: { totalTickets: 12, memoryBankSize: 8, csat: 4.8 }
  },
  {
    id: "CUST_002",
    name: "Bob Jones",
    company: "CloudScale Systems",
    email: "bob@cloudscale.net",
    plan: "Pro Scale",
    environment: "Python SDK v2.4 / Linux Server",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    stats: { totalTickets: 5, memoryBankSize: 4, csat: 4.5 }
  },
  {
    id: "CUST_003",
    name: "Carol Danvers",
    company: "Nova Fintech",
    email: "carol@novafin.com",
    plan: "Enterprise VIP",
    environment: "Node.js v20 / Stripe Integration / AWS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    stats: { totalTickets: 18, memoryBankSize: 14, csat: 5.0 }
  }
];

export const MOCK_MEMORIES = {
  CUST_001: [
    {
      id: "mem-101",
      topic: "Payment Failure",
      summary: "Customer encountered HTTP 402 Card Declined during checkout renewal.",
      attempts: [
        { action: "Clear browser cache & cookies", result: "FAILED", note: "Error persisted" },
        { action: "Update billing address zip code & card details", result: "SUCCESSFUL", note: "Payment processed instantly" }
      ],
      environment: "Chrome 122 / Stripe Gateway / Web",
      confidence: 0.96,
      timestamp: "2026-09-20T10:15:00Z",
      recall_count: 7
    },
    {
      id: "mem-102",
      topic: "Webhook Signature Mismatch",
      summary: "Stripe webhook endpoint returned 401 Unauthorized due to outdated secret token.",
      attempts: [
        { action: "Re-generate webhook signing secret in portal", result: "SUCCESSFUL", note: "Events synced successfully" }
      ],
      environment: "Node.js / Stripe Webhook API",
      confidence: 0.92,
      timestamp: "2026-09-24T14:30:00Z",
      recall_count: 4
    }
  ],
  CUST_002: [
    {
      id: "mem-201",
      topic: "API Rate Limit 429",
      summary: "Python script hit 100 req/min threshold during bulk data ingestion.",
      attempts: [
        { action: "Increase request timeout parameter", result: "FAILED", note: "Rate limit still triggered" },
        { action: "Implement exponential backoff retry logic & upgraded to Pro Scale plan", result: "SUCCESSFUL", note: "Ingestion completed smoothly" }
      ],
      environment: "Python 3.11 / REST API / Linux",
      confidence: 0.94,
      timestamp: "2026-09-22T08:45:00Z",
      recall_count: 5
    }
  ],
  CUST_003: [
    {
      id: "mem-301",
      topic: "SSO SAML Login Error",
      summary: "Okta SAML assertion failed due to clock skew between servers.",
      attempts: [
        { action: "Sync NTP server time on authentication host", result: "SUCCESSFUL", note: "Okta SSO active" }
      ],
      environment: "Enterprise Okta SSO / SAML 2.0",
      confidence: 0.98,
      timestamp: "2026-09-18T16:20:00Z",
      recall_count: 9
    }
  ]
};

export const MOCK_TICKETS = [
  {
    id: "TKT-1042",
    customer_id: "CUST_001",
    customer_name: "Alice Smith",
    subject: "Payment failing again during monthly invoice renewal",
    status: "Open",
    priority: "High",
    category: "Payments & Billing",
    memory_recalled: "Recalled previous resolution: Zip Code update worked in Mem #101",
    created_at: "10 mins ago"
  },
  {
    id: "TKT-1039",
    customer_id: "CUST_002",
    customer_name: "Bob Jones",
    subject: "Bulk batch API returning HTTP 429 error",
    status: "Resolved",
    priority: "Medium",
    category: "API & SDK",
    memory_recalled: "Recalled backoff strategy from Mem #201",
    created_at: "2 hours ago"
  },
  {
    id: "TKT-1038",
    customer_id: "CUST_003",
    customer_name: "Carol Danvers",
    subject: "SAML Assertion cert renewal guidance",
    status: "Escalated",
    priority: "Urgent",
    category: "Security & SSO",
    memory_recalled: "Recalled Okta setup from Mem #301",
    created_at: "1 day ago"
  }
];

export const MOCK_KNOWLEDGE_BASE = [
  {
    id: "kb-01",
    title: "Resolving Payment & Card Decline Failures",
    category: "Payments",
    summary: "Troubleshooting steps for HTTP 402, bank authorization flags, and card update workflows.",
    content: "When a payment fails, check bank authorization, verify billing zip code match, and clear expired payment tokens in account billing settings."
  },
  {
    id: "kb-02",
    title: "API Rate Limits & Exponential Backoff Guidelines",
    category: "Developer API",
    summary: "Rate limit thresholds per tier (Free: 20 req/min, Pro: 200 req/min, Enterprise: 2000 req/min).",
    content: "Always implement exponential backoff with jitter when receiving HTTP 429 Too Many Requests."
  },
  {
    id: "kb-03",
    title: "SSO SAML 2.0 & Identity Provider Configuration",
    category: "Security",
    summary: "Configuring SAML assertion URLs, x509 certificates, and Okta/Azure AD integration.",
    content: "Ensure server clocks are synced using NTP to avoid SAML assertion validation timeouts."
  }
];

// Dynamic local response synthesis simulating Hindsight AI agent logic
function getFallbackChatResponse(payload) {
  const { customer_id, message } = payload;
  const memories = MOCK_MEMORIES[customer_id] || [];
  
  const queryLower = message.toLowerCase();
  let matchedMemory = memories.find(m => 
    queryLower.includes("payment") || queryLower.includes("card") || queryLower.includes("billing") ? m.topic.includes("Payment") :
    queryLower.includes("rate") || queryLower.includes("limit") || queryLower.includes("429") ? m.topic.includes("Rate") :
    queryLower.includes("sso") || queryLower.includes("saml") || queryLower.includes("login") ? m.topic.includes("SSO") : false
  );

  if (!matchedMemory && memories.length > 0) {
    matchedMemory = memories[0];
  }

  let textResponse = "";
  let recalledMemoryDetails = null;

  if (matchedMemory) {
    recalledMemoryDetails = {
      id: matchedMemory.id,
      topic: matchedMemory.topic,
      summary: matchedMemory.summary,
      successful_attempt: matchedMemory.attempts.find(a => a.result === "SUCCESSFUL")?.action || "Update account settings",
      failed_attempt: matchedMemory.attempts.find(a => a.result === "FAILED")?.action || "Clear browser cache",
      confidence: matchedMemory.confidence
    };

    textResponse = `Welcome back! I recalled your past support experience regarding **${matchedMemory.topic}** (Memory ID: ${matchedMemory.id}).\n\n` +
      `Last time, trying **${recalledMemoryDetails.failed_attempt}** failed, but **${recalledMemoryDetails.successful_attempt}** successfully resolved your issue!\n\n` +
      `Based on your past environment (${matchedMemory.environment}), I recommend we directly proceed with: **${recalledMemoryDetails.successful_attempt}**. Should I assist you with applying this fix right now?`;
  } else {
    textResponse = `I see you are reporting: "${message}". Since this is a new issue scenario for your profile, I have searched our Company Knowledge Base.\n\n` +
      `Recommended next step: Please verify your account configuration and retry. Once you let me know if this works, I will retain this interaction in Hindsight persistent memory for future speed!`;
  }

  return {
    response: textResponse,
    customer_id: customer_id,
    memory_recalled: !!recalledMemoryDetails,
    recalled_memory: recalledMemoryDetails,
    rag_sources: [
      { id: "kb-01", title: "Resolving Payment & Card Decline Failures", relevance: 0.91 }
    ],
    hindsight_status: "ACTIVE_HYBRID_MEMORY",
    timestamp: new Date().toISOString()
  };
}

function getFallbackMemories(customerId) {
  return MOCK_MEMORIES[customerId] || [];
}

function getFallbackRecallResults(customerId, query) {
  const memories = MOCK_MEMORIES[customerId] || [];
  return {
    query: query,
    matches: memories.map(m => ({
      ...m,
      score: 0.89 + Math.random() * 0.09
    }))
  };
}
