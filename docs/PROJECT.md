# PROJECT.md

## Purpose

This repository is Jihad Chaalan's personal portfolio website. It exists to serve two audiences:

1. **Recruiters / hiring managers** — evaluating Jihad as a candidate for Full-Stack AI Engineer roles.
2. **Freelance / contract clients** — evaluating whether Jihad can build AI-powered products for them (websites, RAG systems, agents, automation) end-to-end.

The site is a **professional engineering/product portfolio**, not an online CV. It deliberately does **not** contain traditional resume sections (Education, Work Experience, a CV timeline). That information lives in Jihad's actual CV, shared separately. The portfolio's job is to demonstrate technical ability through skills and real project work, and to make it easy to get in touch.

## Target audience takeaways

A visitor should understand, within a few seconds of landing on the page:

> Jihad Chaalan is a Full-Stack AI Engineer who designs and builds real AI-powered products — RAG systems, AI agents, APIs, and the frontend/backend around them — and can take them to deployment.

Recruiters should walk away understanding Jihad can build production-oriented AI systems and understands both frontend and backend engineering. Freelance clients should walk away understanding Jihad can be hired to build an AI-powered website/application for them, and should have an obvious path to book a call or reach out.

## Main sections (homepage)

The homepage is a single scrolling page, in this exact order, using semantic section IDs:

| Section    | ID          | Purpose                                                                 |
| ---------- | ----------- | ------------------------------------------------------------------------ |
| Hero       | `#home`     | Immediate identity: "Full-Stack AI Engineer", supporting message, CTAs   |
| Skills     | `#skills`   | Three scannable categories: AI Engineering, Full-Stack, DevOps & Deployment |
| Projects   | `#projects` | The centerpiece — real, product-like project cards                      |
| Contact    | `#contact`  | Strong final CTA: Book a Call, email, LinkedIn, GitHub                  |

Navigation (`Home / Skills / Projects / Contact`) smooth-scrolls to these sections. "Book a Call" links to an external booking service — there is intentionally no custom scheduling system.

## Projects

Three real projects are documented (see `data/projects.ts` for the full normalized content), each with its own detail page at `/projects/[slug]`:

1. **Secure Multi-Tenant RAG** (`secure-multi-tenant-rag`) — a production-oriented, multi-tenant RAG platform: FastAPI backend, hybrid search (BM25 + vector) with reranking, RBAC, Google Drive ingestion, and an AI firewall layer.
2. **AI Daily News** (`ai-daily-news`) — an automated AI agent system (not a news website) that researches, summarizes, evaluates, and publishes news daily, using LangGraph for multi-step orchestration, with a web interface and daily notifications.
3. **Resume ATS Predictor** (`resume-ats-predictor`) — an XGBoost machine learning model trained on approximately 6,000 resumes to predict ATS-style resume outcomes, deployed behind a simple interface.

No statistics, clients, users, or outcomes are invented beyond what is stated above and in the project data.

## General goals

- Communicate technical seniority through design restraint, not decoration.
- Make projects look like real, deployable products — architecture, decisions, and trade-offs are shown, not just a feature list.
- Keep the codebase simple, typed, and easy for a future Cline session (or another engineer) to extend — especially around swapping in Contentful later (see `ARCHITECTURE.md`).
- Meet production-quality bars for accessibility, SEO, responsiveness, and performance without over-engineering.

## Non-goals (explicitly out of scope for Phase 1)

- Contentful or any other CMS integration (planned, not built — see `ARCHITECTURE.md`).
- A custom booking/scheduling system (uses an external booking link).
- Traditional CV content (education, employment history, timeline).
- Blog, dashboard, or any additional unrelated pages beyond the homepage and `/projects/[slug]`.
