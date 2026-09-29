export const INITIAL_AGENTS = [
  {
    id: "customer-support",
    name: "Customer Support Agent",
    iconName: "MessageSquare",
    status: "Ready for Testing font-medium bg-emerald-950 text-emerald-300 border-emerald-800/60",
    statusCode: "ready",
    description: "Remembers a customer's history so support teams don't have to ask for the same information again.",
    
    // Setup Progress Tracking
    setupProgress: 100, // % completed
    setupSteps: {
      memory: true,
      knowledge: true,
      rules: true,
      reviewed: true,
      tested: true
    },

    // What the agent remembers (Memory categories)
    memoryAreas: [
      { id: "past-tickets", label: "Past tickets", description: "Previous support tickets and conversation logs", checked: true },
      { id: "known-issues", label: "Known issues", description: "Known bugs, outages, and platform workarounds", checked: true },
      { id: "customer-environment", label: "Customer environment", description: "Browser, OS, SDK versions, and tech stack setup", checked: true },
      { id: "customer-context", label: "Customer context", description: "Account tier, company plan, and key contacts", checked: true },
      { id: "successful-solutions", label: "Successful solutions", description: "Troubleshooting steps that resolved issues before", checked: true }
    ],

    // Useful sources
    knowledgeSources: [
      { 
        id: "cs-src-1", 
        name: "Support Tickets System", 
        system: "Zendesk / Support DB", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Support tickets", 
        lastSynced: "10 mins ago",
        details: "Synced 4,820 historical ticket threads and resolution notes."
      },
      { 
        id: "cs-src-2", 
        name: "Customer Records (CRM)", 
        system: "HubSpot CRM", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Customer records", 
        lastSynced: "1 hour ago",
        details: "Customer profiles, environment specs, and subscription tiers."
      },
      { 
        id: "cs-src-3", 
        name: "Product Documentation", 
        system: "Confluence RAG", 
        status: "Needs attention", 
        statusColor: "text-amber-400 bg-amber-950/60 border-amber-800/50",
        category: "Product documentation", 
        lastSynced: "3 days ago",
        details: "Stale index detected for v2.4 API release notes."
      }
    ],

    // Memory Rules
    memoryRules: {
      retentionPeriod: "90 days",
      confidenceThreshold: 0.85,
      customerScoping: true,
      autoRetainOutcomes: true
    },

    // Sample Test Conversations & Memories Used
    testPrompts: [
      "What happened with this customer's previous login issue?",
      "Has Alice Smith reported any payment failures before?",
      "What solution worked for the Stripe webhook timeout?"
    ],

    conversations: [
      {
        id: "cs-conv-1",
        query: "What happened with this customer's previous login issue?",
        response: "On Ticket #4821, customer Alice Smith reported an SSO SAML assertion failure during login. The support team identified server clock skew between Okta and the auth host, regenerated the SAML metadata, and resynced NTP server time, which fully resolved the issue.",
        memoryUsed: [
          {
            id: "mem-cs-1",
            category: "Past ticket",
            title: "Past ticket #4821",
            detail: "Customer reported SSO SAML login assertion error on 2026-09-18.",
            confidence: "0.96"
          },
          {
            id: "mem-cs-2",
            category: "Known issue",
            title: "Known issue: SSO authentication clock skew",
            detail: "Okta SAML assertion validation fails when NTP drift exceeds 30 seconds.",
            confidence: "0.92"
          },
          {
            id: "mem-cs-3",
            category: "Successful solution",
            title: "Previous solution: regenerated SSO metadata & NTP sync",
            detail: "Resynced host clocks via NTP and uploaded renewed x509 cert to Okta portal.",
            confidence: "0.98"
          }
        ]
      }
    ]
  },
  {
    id: "accounts-payable",
    name: "Accounts Payable Agent",
    iconName: "Receipt",
    status: "In Setup bg-indigo-950 text-indigo-300 border-indigo-800/60",
    statusCode: "setup",
    description: "Remembers vendor patterns and previous invoice exceptions to help AP teams handle recurring cases.",
    
    setupProgress: 60,
    setupSteps: {
      memory: true,
      knowledge: true,
      rules: true,
      reviewed: false,
      tested: false
    },

    memoryAreas: [
      { id: "vendor-patterns", label: "Vendor patterns", description: "Recurring billing structures, invoice layouts, and contacts", checked: true },
      { id: "payment-terms", label: "Payment terms", description: "Net-30/60/90 terms, early payment discount rules", checked: true },
      { id: "discrepancies", label: "Common discrepancies", description: "Historical line-item and tax rate mismatches", checked: true },
      { id: "approval-workflows", label: "Approval workflows", description: "Departmental spending thresholds and sign-off chains", checked: true },
      { id: "previous-exceptions", label: "Previous exceptions", description: "Flagged invoices and manual overrides", checked: true },
      { id: "resolutions", label: "Resolutions", description: "Past clearance codes and dispute resolution outcomes", checked: true }
    ],

    knowledgeSources: [
      { 
        id: "ap-src-1", 
        name: "Vendor Master Records", 
        system: "SAP / ERP Vendor Master", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Vendor records", 
        lastSynced: "25 mins ago",
        details: "Vendor profiles, tax IDs, and default payment terms."
      },
      { 
        id: "ap-src-2", 
        name: "Invoice Processing Archive", 
        system: "Invoice OCR Archive", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Invoices", 
        lastSynced: "2 hours ago",
        details: "12,400 ingested PDF invoices and line-item extractions."
      },
      { 
        id: "ap-src-3", 
        name: "AP Approval Audit Trail", 
        system: "Approval Audit History", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Approval history", 
        lastSynced: "Yesterday",
        details: "Manager approval logs for exception overrides."
      },
      { 
        id: "ap-src-4", 
        name: "Bank Payment Records", 
        system: "Banking API Gateway", 
        status: "Not connected", 
        statusColor: "text-slate-400 bg-slate-800 border-slate-700",
        category: "Payment records", 
        lastSynced: "Never",
        details: "Requires OAuth authentication with banking gateway."
      }
    ],

    memoryRules: {
      retentionPeriod: "180 days",
      confidenceThreshold: 0.90,
      customerScoping: false,
      autoRetainOutcomes: true
    },

    testPrompts: [
      "How did we handle the shipping overage on Acme Corp invoice #INV-9920?",
      "What are the standard payment terms for vendor TechSupplies Ltd?",
      "Who needs to approve invoice exceptions exceeding $10,000?"
    ],

    conversations: [
      {
        id: "ap-conv-1",
        query: "How did we handle the shipping overage on Acme Corp invoice #INV-9920?",
        response: "Invoice #INV-9920 had a $1,200 shipping fee discrepancy against PO-4481. Based on recorded Acme Corp vendor patterns, shipping overages under $1,500 are pre-authorized per Master Agreement clause 4.2. The exception was cleared under clearance code V-ACME-01 without escalating to procurement.",
        memoryUsed: [
          {
            id: "mem-ap-1",
            category: "Vendor pattern",
            title: "Acme Corp Master Agreement clause 4.2",
            detail: "Pre-authorizes shipping overages up to $1,500 without manual PO revision.",
            confidence: "0.97"
          },
          {
            id: "mem-ap-2",
            category: "Previous exception",
            title: "Invoice Exception #EX-304",
            detail: "Cleared $1,200 shipping variance on PO-4481 for Acme Corp.",
            confidence: "0.94"
          },
          {
            id: "mem-ap-3",
            category: "Resolution",
            title: "Clearance Code V-ACME-01",
            detail: "Standard auto-approval clearance rule for pre-authorized freight.",
            confidence: "0.99"
          }
        ]
      }
    ]
  },
  {
    id: "compliance-audit",
    name: "Compliance & Audit Agent",
    iconName: "ShieldCheck",
    status: "Draft bg-slate-800 text-slate-300 border-slate-700",
    statusCode: "draft",
    description: "Remembers regulatory requirements, audit history, remediation work, and control testing.",
    
    setupProgress: 35,
    setupSteps: {
      memory: true,
      knowledge: true,
      rules: false,
      reviewed: false,
      tested: false
    },

    memoryAreas: [
      { id: "regulatory-req", label: "Regulatory requirements", description: "SOC2, ISO 27001, GDPR, and PCI-DSS requirements", checked: true },
      { id: "audit-findings", label: "Audit findings", description: "Internal and external auditor observations and gap reports", checked: true },
      { id: "remediation-status", label: "Remediation status", description: "Corrective action plans, assigned owners, and deadlines", checked: true },
      { id: "policy-changes", label: "Policy changes", description: "Version history of corporate security policies", checked: true },
      { id: "tested-controls", label: "Tested controls", description: "Control IDs (e.g. CC6.1, CC7.2) and testing evidence", checked: true },
      { id: "testing-history", label: "Testing history", description: "Historical pass/fail results from quarterly control tests", checked: true }
    ],

    knowledgeSources: [
      { 
        id: "cm-src-1", 
        name: "Corporate Policy Portal", 
        system: "Policy Portal RAG", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Policies", 
        lastSynced: "3 hours ago",
        details: "Indexed 42 active security and compliance policy documents."
      },
      { 
        id: "cm-src-2", 
        name: "Internal Audit Vault", 
        system: "Audit Reports Repository", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Audit reports", 
        lastSynced: "3 days ago",
        details: "Annual SOC2 Type II and ISO 27001 audit findings."
      },
      { 
        id: "cm-src-3", 
        name: "Regulatory Framework Specifications", 
        system: "Regulatory Specs DB", 
        status: "Needs attention", 
        statusColor: "text-amber-400 bg-amber-950/60 border-amber-800/50",
        category: "Regulatory documents", 
        lastSynced: "1 week ago",
        details: "PCI-DSS 4.0 update specification requires re-indexing."
      },
      { 
        id: "cm-src-4", 
        name: "GRC Control Matrix", 
        system: "Control Records DB", 
        status: "Not connected", 
        statusColor: "text-slate-400 bg-slate-800 border-slate-700",
        category: "Control records", 
        lastSynced: "Never",
        details: "Pending integration with GRC software API."
      },
      { 
        id: "cm-src-5", 
        name: "Jira Compliance Remediation", 
        system: "Remediation Records", 
        status: "Connected", 
        statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
        category: "Remediation records", 
        lastSynced: "Yesterday",
        details: "Remediation ticket statuses and verification proof."
      }
    ],

    memoryRules: {
      retentionPeriod: "365 days",
      confidenceThreshold: 0.95,
      customerScoping: false,
      autoRetainOutcomes: true
    },

    testPrompts: [
      "What was the remediation plan for the Q2 SOC2 access review finding?",
      "Which controls were tested during the last PCI-DSS audit?",
      "What policy changes were made regarding data retention?"
    ],

    conversations: [
      {
        id: "cm-conv-1",
        query: "What was the remediation plan for the Q2 SOC2 access review finding?",
        response: "In the Q2 SOC2 Audit, Finding #AUD-882 identified a 12-hour latency in deprovisioning terminated employee IAM accounts. Remediation Item #REM-104 was implemented: automated Okta deprovisioning triggered directly via HRIS status change. Subsequent testing for Control CC6.1 in August verified 100% compliance with zero exceptions.",
        memoryUsed: [
          {
            id: "mem-cm-1",
            category: "Audit finding",
            title: "Audit Finding #AUD-882 (Q2 SOC2)",
            detail: "Identified delayed IAM offboarding for terminated employees.",
            confidence: "0.98"
          },
          {
            id: "mem-cm-2",
            category: "Remediation status",
            title: "Remediation Ticket #REM-104",
            detail: "Implemented automated HRIS -> Okta offboarding webhook.",
            confidence: "0.95"
          },
          {
            id: "mem-cm-3",
            category: "Tested control",
            title: "Control CC6.1 (User Access Offboarding)",
            detail: "Tested in August 2026: 25 samples verified with 0 exceptions.",
            confidence: "0.99"
          }
        ]
      }
    ]
  }
];
