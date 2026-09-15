import type { SkillCategory } from "@/types";

/**
 * Local static skills data for Phase 1.
 * Read through `lib/skills-repository.ts` — not imported directly by UI.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "ai-engineering",
    title: "AI Engineering",
    description:
      "Building production-ready AI systems that combine LLMs, retrieval, agents, and automation to solve real-world problems.",
    items: [
      "Python",
      "LLMs",
      "RAG",
      "LangChain",
      "LangGraph",
      "AI Agents",
"Vector DB",
      "n8n",
    ],
  },
  {
    id: "full-stack-development",
    title: "Full-Stack Development",
    description:
      "Building the frontend and backend that turn an AI system into a real, usable product.",
    items: ["Next.js", "React.js", "TypeScript", "FastAPI", "REST APIs", "PostgreSQL"],
  },
  {
    id: "devops-deployment",
    title: "DevOps & Deployment",
    description:
      "Shipping and running applications reliably, not just demoing them locally.",
    items: ["Docker", "Git", "GitHub Actions", "DigitalOcean", "CI/CD"],
  },
];
