Hindsight Support Agent

AI Customer Support Agent that remembers, learns, and improves from every customer interaction.







A memory-powered customer support agent built for HackwithHyderabad 3.0 — AI Agents That Learn Using Hindsight.

Unlike a traditional stateless chatbot, this agent uses Hindsight as its long-term memory layer to recall customer history, previous troubleshooting attempts, successful and failed solutions, and relevant support experiences. It combines that memory with company knowledge and an LLM to produce more contextual support responses.

Table of Contents

Problem

Solution

Why Hindsight

Key Features

Architecture

Tech Stack

Memory Design

Hindsight vs RAG vs Database

Project Structure

Getting Started

Environment Variables

Development Workflow

Demo Scenario

API Overview

Security and Data Isolation

Roadmap

Hackathon Alignment

Contributing

License

Problem

Traditional customer-support chatbots are often good at answering the current question but weak at remembering what happened previously.

A customer may have to repeatedly explain:

What problem they encountered

Which troubleshooting steps they already tried

Which solutions failed

Which solution eventually worked

Their product or environment configuration

Previous support-ticket context

For example:

Customer:
"My payment is failing again."

Stateless chatbot:
"Please check your payment method."

Customer:
"I already tried that yesterday."

Stateless chatbot:
"Please try updating your card."

Customer:
"I already did that too."

The missing capability is long-term experience.

Solution

Hindsight Support Agent adds persistent memory to the support workflow.

The agent can:

Receive the customer's current issue.

Identify the customer.

Recall relevant previous experiences from Hindsight.

Retrieve relevant company documentation through RAG.

Combine current context, customer memory, and company knowledge.

Generate a personalized response using an LLM.

Collect customer feedback.

Store the new support experience back into Hindsight.

Use the accumulated experience in future conversations.

Core learning loop

Customer Query
      │
      ▼
Recall Customer History
      │
      ├──────────────► Hindsight
      │
      ▼
Retrieve Company Knowledge
      │
      ├──────────────► RAG / Knowledge Base
      │
      ▼
Context + Memory + Knowledge
      │
      ▼
      LLM
      │
      ▼
Personalized Support Response
      │
      ▼
Customer Feedback
      │
      ▼
Retain New Experience
      │
      ▼
Hindsight Memory

Why Hindsight?

Hindsight is the core memory layer of this project.

The important distinction is:

RAG tells the agent what the company knows. Hindsight tells the agent what happened before.

For example:

Company knowledge

Payment policy:

If a payment fails, verify the payment method,
billing address, and account status.

Customer memory

Customer: CUST_001

Previous issue:
Payment failure

Attempt:
Update payment method

Result:
Successful

The agent can combine both sources:

Current Issue
     +
Customer Experience
     +
Company Knowledge
     ↓
Personalized Support Response

Key Features

1. Persistent Customer Memory

Stores relevant long-term customer experiences such as:

Previous support interactions

Known issues

Troubleshooting attempts

Successful solutions

Failed solutions

Relevant environment information

Resolution history

2. Context-Aware Responses

The agent uses relevant customer history instead of treating every conversation as completely new.

3. Successful / Failed Solution Tracking

The system records whether a troubleshooting step worked.

Problem: Payment failure

Attempt 1 → Clear browser cache → Failed
Attempt 2 → Update payment method → Successful

Future responses can take that history into account.

4. Feedback Loop

After a response, the customer can indicate whether the issue was resolved.

Was this helpful?

[ Yes, solved ]    [ No, still having the issue ]

The outcome becomes part of the agent's future memory.

5. Company Knowledge with RAG

The agent can retrieve information from company documentation such as:

Product documentation

FAQs

Payment policies

Refund policies

Shipping policies

Troubleshooting guides

6. Human Escalation

Issues that cannot be confidently resolved can be escalated to a human support representative.

The eventual resolution can be retained as a future support experience.

7. Support Dashboard

The planned interface provides:

Customer conversation

Ticket information

Relevant memories

Retrieved knowledge

Suggested resolution

Feedback and resolution status

Architecture

┌─────────────────────────────────────────────────────────┐
│                     Customer UI                         │
│              Next.js + React + TypeScript              │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │ HTTP / REST
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Backend                      │
│                                                         │
│              Customer Support Agent                    │
└───────────────┬─────────────────┬───────────────────────┘
                │                 │
                │                 │
                ▼                 ▼
      ┌──────────────────┐  ┌──────────────────┐
      │    Hindsight     │  │   Knowledge Base │
      │  Persistent      │  │       / RAG      │
      │     Memory       │  │                  │
      └────────┬─────────┘  └────────┬─────────┘
               │                     │
               │                     │
               └──────────┬──────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │      LLM      │
                  │               │
                  │ Groq / Gemini │
                  │ OpenAI / etc. │
                  └───────┬───────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Support Answer  │
                 └────────┬────────┘
                          │
                          ▼
                     Customer
                          │
                          ▼
                      Feedback
                          │
                          ▼
                   Hindsight Retain

Tech Stack

Frontend

Technology

Purpose

Next.js

Frontend application

React

Interactive UI

TypeScript

Type-safe development

Tailwind CSS

Responsive styling

Axios / Fetch

API communication

Backend

Technology

Purpose

Python 3.11+

Agent and backend logic

FastAPI

REST API

Uvicorn

ASGI development server

AI & Memory

Technology

Purpose

Hindsight

Persistent agent memory

LLM

Reasoning and response generation

RAG

Company knowledge retrieval

Embeddings

Semantic document retrieval

Data

Technology

Purpose

PostgreSQL / MongoDB

Application and transactional data

Vector Database

Knowledge-base retrieval

The final database/vector-store choice will be kept consistent with the implemented version of the project.

Development

Git

GitHub

VS Code

Postman

Python virtual environment

npm

Memory Design

The project treats Hindsight as an agent-memory system, not as the application's general-purpose database.

Memory examples

Customer:
CUST_001

Issue:
Payment failure

Previous attempts:
1. Clear browser cache → Failed
2. Change payment method → Successful

Environment:
Web application

Resolution:
Payment method was updated

Outcome:
Resolved

When the same customer reports a similar problem later, the agent can recall relevant experience.

Memory lifecycle

             ┌───────────────┐
             │ Current Issue │
             └───────┬───────┘
                     │
                     ▼
              ┌─────────────┐
              │    Recall   │
              └──────┬──────┘
                     │
                     ▼
              Relevant Memory
                     │
                     ▼
                  LLM
                     │
                     ▼
                 Response
                     │
                     ▼
                Feedback
                     │
                     ▼
              ┌─────────────┐
              │    Retain   │
              └──────┬──────┘
                     │
                     ▼
              New Experience

Hindsight vs RAG vs Database

These components have different responsibilities.

Component

Main Question

Example

Hindsight

What happened before?

"What solved this customer's payment issue last time?"

RAG

What does the company documentation say?

"What is our refund policy?"

Database

What is the current application state?

"Is ticket TKT-1024 open?"

Combined workflow

                 Current Query
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Hindsight         RAG        Database
   Past memory    Company docs   Current state
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                     LLM
                      │
                      ▼
             Support Response

Project Structure

hindsight-support-agent/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   ├── tickets.py
│   │   │   └── feedback.py
│   │   │
│   │   ├── agent/
│   │   │   ├── support_agent.py
│   │   │   ├── prompts.py
│   │   │   └── memory.py
│   │   │
│   │   ├── rag/
│   │   │   ├── ingest.py
│   │   │   └── retriever.py
│   │   │
│   │   └── database/
│   │       ├── models.py
│   │       └── db.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── knowledge_base/
│   ├── payments/
│   ├── refunds/
│   ├── shipping/
│   └── account/
│
├── demo/
│   └── demo-scenario.md
│
├── README.md
├── .gitignore
└── LICENSE

Getting Started

Prerequisites

Install:

Python 3.11+

Node.js 20+

npm

Git

A Hindsight Cloud account/API key or a self-hosted Hindsight instance

An LLM API key if required by the selected model/provider

The official Hindsight repository supports hosted and self-hosted deployment options and provides Python, TypeScript, Go, CLI, and REST clients. See the official repository for the current setup options.

1. Clone the repository

git clone <YOUR_REPOSITORY_URL>
cd hindsight-support-agent

2. Backend setup

cd backend

python -m venv venv

Windows

venv\Scripts\activate

macOS / Linux

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

3. Configure environment variables

Create:

backend/.env

Example:

HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io

LLM_API_KEY=your_llm_api_key

DATABASE_URL=your_database_url

Never commit .env to GitHub.

4. Start the backend

uvicorn app.main:app --reload

5. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

Development Workflow

The project is developed in the following stages:

Phase 1 — Hindsight Connection

Configure Hindsight

Create a memory bank

Test retain

Test recall

Verify customer-specific memory

Phase 2 — Support Agent

Create support prompt

Connect LLM

Combine current query with recalled memory

Generate support responses

Phase 3 — Knowledge Base

Add company documents

Generate embeddings

Implement retrieval

Combine RAG results with Hindsight memory

Phase 4 — Feedback & Learning

Add resolution feedback

Store successful solutions

Store failed attempts

Add human escalation

Phase 5 — Product UI

Customer chat

Ticket history

Memory panel

Support-agent dashboard

Resolution tracking

Phase 6 — Demo

Prepare realistic customer history

Demonstrate first interaction

Demonstrate repeated issue

Demonstrate improved response

Show retrieved memory

Demo Scenario

The demo is designed to make the memory improvement visible.

Interaction 1 — New Customer

Customer:
"My payment is failing."

The agent has no previous experience with this customer.

Response:

"Please verify your payment method and billing information."

The interaction is then retained.

Interaction 5 — Returning Customer

Customer:
"My payment is failing again."

The agent recalls the previous experience:

Previous attempt:
Update payment method

Result:
Successful

The response becomes more targeted.

Interaction 20 — Experienced Customer Context

Customer:
"The payment issue happened again."

The agent can use accumulated history:

Previous attempts:
- Clear browser cache → Failed
- Change payment method → Failed
- Update billing information → Successful

Current approach:
Check billing information first.

This demonstrates the central value of persistent memory:

Interaction 1
     ↓
Generic support

Interaction 5
     ↓
Personalized support

Interaction 20
     ↓
Experience-driven support

API Overview

Planned backend endpoints:

Method

Endpoint

Purpose

POST

/api/chat

Send a customer message

GET

/api/customers/{id}

Retrieve customer profile

GET

/api/customers/{id}/tickets

Retrieve ticket history

POST

/api/tickets

Create support ticket

POST

/api/feedback

Submit resolution feedback

POST

/api/escalate

Escalate issue to human support

GET

/api/memory/{customer_id}

Inspect relevant customer memory

Endpoint names may change as implementation evolves. The README should be updated to match the final API.

Security and Data Isolation

Customer memory must not leak between customers.

Every memory operation should be associated with the appropriate customer identity.

Conceptually:

Customer A
    │
    ├── Customer A memories
    └── Customer A tickets

Customer B
    │
    ├── Customer B memories
    └── Customer B tickets

The application should:

Scope memory retrieval to the correct customer.

Validate customer identity before retrieving private context.

Avoid placing secrets in prompts.

Keep API keys in environment variables.

Never commit .env files.

Sanitize user-provided content where appropriate.

Restrict administrative memory inspection to authorized users.

Hackathon Alignment

This project is designed around the hackathon's central requirement:

Build an AI agent that uses Hindsight to remember, recall, and improve over time.

The project focuses on a real customer-support workflow where persistent memory has direct value.

Memory is the core capability

The agent demonstrates:

Persistent customer context

Previous ticket history

Successful solutions

Failed troubleshooting attempts

Feedback-driven learning

Recall of older interactions

Increasingly personalized responses

Real-world workflow

Customer Issue
      ↓
Support Agent
      ↓
Previous Experience
      ↓
Company Knowledge
      ↓
Resolution
      ↓
Feedback
      ↓
New Experience

Official Resources

Hindsight GitHub: https://github.com/vectorize-io/hindsight

Hindsight Documentation: https://hindsight.vectorize.io/

Hindsight Cloud: https://ui.hindsight.vectorize.io/

Hindsight Cookbook: https://github.com/vectorize-io/hindsight-cookbook

Self-Driving Agents: https://github.com/vectorize-io/self-driving-agents

The Hindsight repository includes official clients, integrations, deployment options, and examples for adding persistent memory to agents. The official repository currently documents Python, TypeScript, Go, CLI, REST API, and hosted/self-hosted approaches.

Roadmap

Project concept

Customer support use case

Hindsight Cloud integration

Memory retain flow

Memory recall flow

LLM integration

Customer-specific memory isolation

Company knowledge base

RAG retrieval

Feedback loop

Human escalation

Customer chat UI

Support dashboard

Demo dataset

Production deployment

Contributing

Contributions are welcome.

Fork the repository.

Create a feature branch.

git checkout -b feature/your-feature

Commit your changes.

git commit -m "feat: add customer memory retrieval"

Push the branch.

git push origin feature/your-feature

Open a Pull Request.

License

This project is intended for hackathon and educational use.

Add the final project license here once the team decides on the repository license.

Built With

Hindsight · Python · FastAPI · Next.js · React · TypeScript · RAG · LLMs

Built for HackwithHyderabad 3.0 — AI Agents That Learn Using Hindsight.
