import type { Project } from "@/types";

/**
 * Local static project data for Phase 1.
 *
 * Do not import this file directly from UI components — go through
 * `lib/project-repository.ts` instead, so the data source can be swapped
 * for Contentful later without touching the UI.
 */
export const projects: Project[] = [
  {
    slug: "secure-multi-tenant-rag",
    name: "Secure Multi-Tenant RAG",
    category: "AI Systems / RAG",
    tagline:
      "A production-oriented retrieval-augmented generation platform with per-tenant isolation and access control.",
    summary:
      "A secure, multi-tenant RAG system that combines hybrid search and reranking with strict role-based access control, built to answer questions grounded in each tenant's own documents without leaking data across tenants.",
    overview:
      "Secure Multi-Tenant RAG is a backend-first AI system designed to let multiple organizations query their own knowledge bases through a single deployment, without ever mixing data between tenants. It focuses on the parts of RAG that most demos skip: tenant isolation, access control, retrieval quality, and guarding the system against malicious or unsafe inputs.",
    problem:
      "Most RAG tutorials assume a single user and a single document set. Real organizations need multiple tenants and users, each with different documents and permissions, and they need confidence that one tenant's data can never leak into another tenant's answers — while retrieval quality still has to hold up against messy, real-world documents.",
    solution:
      "The system ingests documents per tenant (including direct Google Drive ingestion), indexes them for both keyword and semantic search, and enforces tenant and role boundaries at the data-access layer rather than only in the prompt. Retrieval combines BM25 keyword search with vector search, merges the results, and reranks them before they ever reach the language model, so answers are grounded in the right, permitted documents.",
    architecture:
      "A FastAPI backend exposes ingestion and query APIs behind role-based access control (RBAC), with every request scoped to a tenant and a user role. Documents are ingested from sources like Google Drive, chunked, embedded, and written to a vector store alongside a BM25 index for hybrid search. At query time, candidates from both retrieval paths are merged and passed through a reranking step before being sent to the LLM for a grounded answer. An AI firewall layer sits in front of the model calls to screen for prompt injection and unsafe or out-of-scope requests. A frontend client provides a chat-style interface on top of the API, and the whole stack is containerized for deployment.",
    keyFeatures: [
      "Hybrid retrieval combining BM25 keyword search with vector similarity search",
      "Reranking step to improve the relevance of retrieved context before generation",
      "Multi-tenant data isolation enforced at the access layer",
      "Role-based access control (RBAC) for users within each tenant",
      "Google Drive ingestion pipeline for real-world document sources",
      "AI firewall to screen for prompt injection and unsafe queries",
      "Web frontend for querying and reviewing grounded answers",
      "Containerized for deployment",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "RAG",
      "Hybrid Search",
      "BM25",
      "Vector Search",
      "Reranking",
      "Multi-tenancy",
      "RBAC",
      "Google Drive API",
      "AI Security",
      "Docker",
    ],
    challenges: [
      {
        title: "Isolating tenants without duplicating infrastructure",
        body:
          "Rather than standing up separate infrastructure per tenant, tenant and role scoping is enforced at the data-access layer so a single deployment can safely serve multiple organizations.",
      },
      {
        title: "Balancing keyword and semantic retrieval",
        body:
          "Pure vector search misses exact terms and identifiers; pure keyword search misses paraphrased questions. Combining BM25 and vector search, then reranking the merged results, gave more reliable grounding than either approach alone.",
      },
      {
        title: "Treating the LLM as an untrusted boundary",
        body:
          "User input and retrieved content are both treated as potentially adversarial. An AI firewall layer screens for prompt injection and out-of-scope requests before they reach the model.",
      },
    ],
    outcomes: [
      "A working end-to-end RAG pipeline: ingestion, hybrid retrieval, reranking, and grounded generation",
      "Tenant and role isolation enforced consistently across the API",
      "A deployable, containerized system with a functioning frontend client",
    ],
    image: {
      src: "/images/projects/rag-card.svg",
      alt: "Abstract diagram representing a secure multi-tenant retrieval-augmented generation system",
    },
    heroImage: {
      src: "/images/projects/rag-hero.svg",
      alt: "Abstract diagram representing a secure multi-tenant retrieval-augmented generation system",
    },
    screenshots: [],
    links: {},
    featured: true,
  },
  {
    slug: "ai-daily-news",
    name: "AI Daily News",
    category: "AI Agents / Automation",
    tagline:
      "An autonomous AI agent workflow that researches, summarizes, evaluates, and publishes daily news — not just a news website.",
    summary:
      "AI Daily News is an automated system where AI agents research current events, summarize and evaluate what they find, and publish the results to a web interface with daily notifications — with the automation itself as the product.",
    overview:
      "AI Daily News automates the daily news cycle end-to-end using AI agents and workflows rather than manual curation. The interesting part of this project isn't the articles themselves — it's the pipeline that researches, filters, summarizes, evaluates, and publishes them on a schedule, with a web interface for reading and daily notifications for staying up to date.",
    problem:
      "Keeping up with relevant news takes time, and most 'AI news' tools just wrap a single summarization call around raw articles with no quality control. That produces shallow or unreliable summaries and no repeatable, automated pipeline for research, evaluation, and publishing on a schedule.",
    solution:
      "The system uses agent-based workflows to research topics, gather source material, and produce summaries, with an evaluation step to check output quality before anything is published. LangGraph is used where multi-step, stateful agent orchestration is needed — for example, coordinating research, summarization, and evaluation as distinct steps rather than a single opaque prompt. Once content passes evaluation, it's published automatically to a web interface, and daily notifications let users know new content is available without having to check manually.",
    architecture:
      "A scheduled automation layer triggers the pipeline daily. Research agents gather source material on selected topics, summarization agents condense it, and an evaluation step checks the output before publishing — with LangGraph coordinating the multi-step agent workflow where stateful orchestration is required. Published content is served through a web interface, and a notification component alerts users when new daily content is available.",
    keyFeatures: [
      "Agent-driven research workflow for gathering source material",
      "Automated summarization of researched content",
      "Evaluation step to check output quality before publishing",
      "LangGraph-based orchestration for multi-step agent workflows",
      "Scheduled, automated publishing pipeline",
      "Web interface for reading published content",
      "Daily notifications when new content is published",
    ],
    technologies: [
      "AI Agents",
      "LangGraph",
      "Automation",
      "Summarization",
      "Evaluation",
      "Python",
      "Web Interface",
      "Scheduled Jobs",
    ],
    challenges: [
      {
        title: "Keeping the pipeline automated end-to-end",
        body:
          "The goal was a system that runs on a schedule without manual intervention — from research through publishing — rather than a tool that still requires a human in the loop at each step.",
      },
      {
        title: "Adding an evaluation gate before publishing",
        body:
          "Summarization alone isn't reliable enough to publish unchecked. An evaluation step reviews agent output before it goes live, catching low-quality or off-topic results.",
      },
      {
        title: "Orchestrating multi-step agent workflows",
        body:
          "Research, summarization, and evaluation needed to run as coordinated, stateful steps rather than one large prompt. LangGraph is used specifically where that stateful, multi-step orchestration is needed.",
      },
    ],
    outcomes: [
      "A fully automated daily pipeline from research to publishing",
      "A working web interface for reading published content",
      "Daily notification delivery tied to the publishing schedule",
    ],
    image: {
      src: "/images/projects/news-card.svg",
      alt: "Abstract diagram representing an automated AI news research and publishing pipeline",
    },
    heroImage: {
      src: "/images/projects/news-hero.svg",
      alt: "Abstract diagram representing an automated AI news research and publishing pipeline",
    },
    screenshots: [],
    links: {},
    featured: true,
  },
  {
    slug: "crypto-futures-alert",
    name: "Crypto Futures Alert",
    category: "Automation / Market Monitoring",
    tagline:
      "An automated Python script that watches Binance USDT perpetual futures and sends a Telegram alert as soon as a predefined market condition is met.",
    summary:
      "Crypto Futures Alert is an automated market-monitoring script built around Binance USDT perpetual futures. It continuously checks the market against a set of predefined conditions and pushes a Telegram notification whenever one of them is met, so conditions are watched without anyone having to sit in front of a chart.",
    overview:
      "Crypto Futures Alert is a small, focused automation project: a Python script that monitors Binance USDT perpetual futures and reports back through Telegram when predefined market conditions are met. Its job is to remove manual price-watching — the condition checking runs on its own, and the alert reaches a channel that is actually looked at.",
    problem:
      "Markets move whether or not anyone is watching, and the moments worth knowing about rarely happen while someone happens to be in front of a chart. Checking prices by hand is unreliable, and doing it across more than a symbol or two stops being realistic. A full trading platform with a built-in alerting stack, on the other hand, is far more machinery than the problem needs.",
    solution:
      "The script connects to Binance USDT perpetual futures market data and evaluates the incoming values against a set of predefined conditions. When a condition is met, it composes an alert and delivers it through a Telegram bot, so the notification arrives on a device that is already part of daily use. The whole thing runs unattended — there is no dashboard to remember to open.",
    architecture:
      "A Python process runs the monitoring loop: it pulls market data for Binance USDT perpetual futures, evaluates the incoming values against the predefined conditions, and — when one is satisfied — hands the alert to the Telegram delivery step, which sends the message to the configured chat. Because the conditions are predefined rather than inferred, what the script will and will not alert on is known in advance.",
    keyFeatures: [
      "Automated Python script that runs the market check unattended",
      "Monitors Binance USDT perpetual futures market data",
      "Evaluates incoming values against predefined market conditions",
      "Sends a Telegram alert as soon as a condition is met",
      "Predefined conditions, so alert behaviour is predictable rather than inferred",
      "No dashboard required — notifications arrive in Telegram",
    ],
    technologies: [
      "Python",
      "Binance Futures API",
      "USDT Perpetual Futures",
      "Telegram Bot API",
      "Market Monitoring",
      "Automation",
    ],
    challenges: [
      {
        title: "Watching the market continuously, not on demand",
        body:
          "The whole value of an alerting script is that it keeps running when nobody is looking. The check has to cycle against live Binance USDT perpetual futures data on its own, without depending on a person opening a terminal at the right moment.",
      },
      {
        title: "Defining conditions precisely enough to be trusted",
        body:
          "A condition that is loosely defined either fires constantly or never fires at all. The conditions had to be pinned down clearly enough that an alert actually means the market did the thing it was supposed to signal.",
      },
      {
        title: "Routing the alert somewhere it will be seen",
        body:
          "An alert that only prints to a console is easy to miss. Delivering notifications through Telegram puts the signal into a client that is already part of daily use, on phone and desktop alike.",
      },
    ],
    outcomes: [
      "A Python monitor running against Binance USDT perpetual futures",
      "Telegram alerts delivered when predefined market conditions are met",
    ],
    image: {
      src: "/images/projects/crypto-card.svg",
      alt: "Abstract candlestick chart with an orange alert marker representing a market monitoring script",
    },
    heroImage: {
      src: "/images/projects/crypto-hero.svg",
      alt: "Abstract candlestick chart with an orange alert marker representing a market monitoring script",
    },
    screenshots: [],
    links: {},
    featured: false,
  },
];
