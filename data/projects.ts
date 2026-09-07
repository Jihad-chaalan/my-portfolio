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
    slug: "resume-ats-predictor",
    name: "Resume ATS Predictor",
    category: "Machine Learning",
    tagline:
      "An XGBoost model that predicts how well a resume is likely to perform against ATS-style screening.",
    summary:
      "A machine learning system trained on approximately 6,000 resumes to predict ATS-style resume outcomes, deployed so resumes can be analyzed and scored through a simple interface.",
    overview:
      "Resume ATS Predictor is a machine learning project focused on predicting how an Applicant Tracking System might screen a given resume. It was trained on a dataset of approximately 6,000 resumes and deployed so resumes can be analyzed through a simple interface rather than staying a notebook-only experiment.",
    problem:
      "Many job seekers have no visibility into how ATS software might screen their resume before a human ever sees it. Turning this into a useful tool required moving beyond a one-off analysis script into a trained, reusable model that could be deployed and queried on new resumes.",
    solution:
      "Resume text and structured features were extracted and processed, then used to train a gradient-boosted model (XGBoost) on a dataset of roughly 6,000 resumes to predict ATS-style outcomes. The trained model was packaged and deployed behind an interface so new resumes can be submitted and scored without retraining or manual analysis.",
    architecture:
      "Resume data is parsed and converted into structured features suitable for a tabular ML model. An XGBoost classifier/regressor is trained on the processed dataset, evaluated, and serialized. A deployment layer loads the trained model and exposes it so a resume can be submitted and scored through a simple interface.",
    keyFeatures: [
      "Resume text parsing and feature extraction",
      "XGBoost model trained on ~6,000 resumes",
      "ATS-style outcome prediction for a submitted resume",
      "Deployed model accessible through a simple interface",
    ],
    technologies: ["Python", "XGBoost", "Machine Learning", "Resume Parsing", "Model Deployment"],
    challenges: [
      {
        title: "Turning unstructured resumes into usable features",
        body:
          "Resumes vary widely in format and structure. Extracting consistent, useful features from free-form resume text was necessary before any model could be trained on the data.",
      },
      {
        title: "Choosing a model suited to tabular resume features",
        body:
          "XGBoost was chosen for its strength on structured/tabular data extracted from resumes, rather than defaulting to a deep learning approach that would need far more data than the ~6,000 resumes available.",
      },
      {
        title: "Deploying beyond a notebook",
        body:
          "The trained model was packaged and deployed behind an interface so it could be used on new resumes directly, instead of remaining a one-off training script.",
      },
    ],
    outcomes: [
      "A trained XGBoost model built on a dataset of approximately 6,000 resumes",
      "A deployed interface for scoring new resumes against the trained model",
    ],
    image: {
      src: "/images/projects/ats-card.svg",
      alt: "Abstract chart representing a machine learning model scoring resumes",
    },
    heroImage: {
      src: "/images/projects/ats-hero.svg",
      alt: "Abstract chart representing a machine learning model scoring resumes",
    },
    screenshots: [],
    links: {},
    featured: false,
  },
];
