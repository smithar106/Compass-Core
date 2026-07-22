import type { Department } from "../types/index.js";

export interface BenchmarkCase {
  id: string;
  name: string;
  answers: Record<number, string | number | boolean>;
  expected: {
    companySummary?: string;
    industry?: string;
    departments?: Department[];
    topTierDepartment?: Department;
    minTier1Count: number;
    maxTier1Count: number;
    disqualifiers?: string[];
    confidenceMin?: number;
    confidenceMax?: number;
  };
}

export const benchmarks: BenchmarkCase[] = [
  {
    id: "b2b-saas-manual-support",
    name: "B2B SaaS with manual customer-support triage",
    answers: {
      1: true, 2: "3 - Balanced", 3: "Salesforce", 4: true, 5: "3", 6: "Multi-touch",
      7: false, 8: "1 - Reactive only", 9: "Gainsight", 10: "0-10%", 11: false, 12: "4-6 hours",
      13: true, 14: "4-7 days", 15: true, 16: "Stack ranking", 17: true, 18: "3 - Balanced",
      19: "1 hour", 20: true, 21: "Manual annual reviews", 22: false, 23: "External counsel",
      24: true, 25: "Customer onboarding time",
    },
    expected: {
      industry: "B2B SaaS",
      departments: ["Sales", "Marketing", "Customer Success", "Support", "Finance", "Product", "Engineering", "People/HR", "Legal", "Operations"],
      topTierDepartment: "Support",
      minTier1Count: 1,
      maxTier1Count: 3,
      confidenceMin: 0.4,
      confidenceMax: 1,
    },
  },
  {
    id: "b2b-saas-slow-reporting",
    name: "B2B SaaS with slow month-end reporting",
    answers: {
      1: true, 2: "4", 3: "HubSpot", 4: false, 5: "2", 6: "Last-touch",
      7: true, 8: "3", 9: "Totango", 10: "10-25%", 11: true, 12: "2 hours",
      13: false, 14: "15+ days", 15: false, 16: "CEO decides", 17: true, 18: "4",
      19: "30 minutes", 20: true, 21: "Culture Amp", 22: true, 23: "Internal team",
      24: true, 25: "Month-end close cycle",
    },
    expected: {
      industry: "B2B SaaS",
      topTierDepartment: "Finance",
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "sales-led-losing-leads",
    name: "Sales-led company losing after-hours leads",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "No CRM", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "None", 10: "0-10%", 11: false, 12: "24+ hours",
      13: false, 14: "8-14 days", 15: false, 16: "Ad hoc", 17: false, 18: "1 - Mostly maintenance",
      19: "Days", 20: false, 21: "None", 22: false, 23: "No compliance process",
      24: false, 25: "Lead response time",
    },
    expected: {
      topTierDepartment: "Sales",
      minTier1Count: 1,
      maxTier1Count: 2,
    },
  },
  {
    id: "fragmented-project-status",
    name: "Company with fragmented project-status reporting",
    answers: {
      1: true, 2: "3 - Balanced", 3: "Salesforce", 4: true, 5: "3", 6: "Multi-touch",
      7: true, 8: "3", 9: "PlanHat", 10: "10-25%", 11: true, 12: "1-2 hours",
      13: true, 14: "4-7 days", 15: true, 16: "Framework (RICE)", 17: true, 18: "3 - Balanced",
      19: "2 hours", 20: true, 21: "Lattice", 22: true, 23: "GDPR checklist",
      24: false, 25: "Cross-team reporting",
    },
    expected: {
      topTierDepartment: "Operations",
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "poor-data-quality",
    name: "Company with poor data quality",
    answers: {
      1: true, 2: "2", 3: "Salesforce (poor data)", 4: false, 5: "2", 6: "First-touch",
      7: false, 8: "2", 9: "None", 10: "0-10%", 11: false, 12: "6-8 hours",
      13: true, 14: "8-14 days", 15: false, 16: "HiPPO", 17: true, 18: "2",
      19: "4 hours", 20: true, 21: "Google Forms", 22: false, 23: "Minimal",
      24: false, 25: "Data quality",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "no-clear-workflow-owner",
    name: "Company with no clear workflow owner",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "None", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "None", 10: "0-10%", 11: false, 12: "Unknown",
      13: false, 14: "15+ days", 15: false, 16: "None", 17: false, 18: "1 - Mostly maintenance",
      19: "Unknown", 20: false, 21: "None", 22: false, 23: "None",
      24: false, 25: "Everything",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 1,
    },
  },
  {
    id: "heavily-regulated",
    name: "Heavily regulated company (financial services)",
    answers: {
      1: true, 2: "4", 3: "Salesforce Financial Services Cloud", 4: true, 5: "4", 6: "Multi-touch",
      7: true, 8: "4", 9: "Gainsight", 10: "25-50%", 11: true, 12: "30 min",
      13: true, 14: "1-3 days", 15: true, 16: "RICE scoring", 17: true, 18: "4",
      19: "15 min", 20: true, 21: "Workday", 22: true, 23: "SOC2, GDPR, SOX",
      24: true, 25: "Compliance reporting time",
    },
    expected: {
      industry: "B2B SaaS",
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "low-ai-maturity",
    name: "Company with low AI maturity",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "Excel", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "Email", 10: "0-10%", 11: false, 12: "24 hours",
      13: false, 14: "15+ days", 15: false, 16: "None", 17: false, 18: "1 - Mostly maintenance",
      19: "Days", 20: false, 21: "None", 22: false, 23: "None",
      24: false, 25: "Everything is manual",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 1,
    },
  },
  {
    id: "multiple-automation-tools",
    name: "Company already using multiple automation tools",
    answers: {
      1: true, 2: "5 - Mostly selling", 3: "Salesforce + Gong + Outreach", 4: true, 5: "5 - Fully personalized at scale", 6: "Multi-touch",
      7: true, 8: "5 - Fully proactive", 9: "Gainsight + ChurnZero", 10: "50%+", 11: true, 12: "5 min",
      13: true, 14: "1-3 days", 15: true, 16: "RICE + Amplitude", 17: true, 18: "5 - Mostly new features",
      19: "10 min", 20: true, 21: "Lattice + Culture Amp", 22: true, 23: "OneTrust + Vanta",
      24: true, 25: "Customer onboarding time",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 1,
    },
  },
  {
    id: "strong-engineering",
    name: "Company with strong engineering resources",
    answers: {
      1: true, 2: "4", 3: "Salesforce (custom)", 4: true, 5: "4", 6: "Multi-touch",
      7: true, 8: "4", 9: "Custom", 10: "25-50%", 11: true, 12: "15 min",
      13: true, 14: "1-3 days", 15: true, 16: "A/B testing + data", 17: true, 18: "5 - Mostly new features",
      19: "5 min", 20: true, 21: "Custom", 22: true, 23: "Automated",
      24: true, 25: "Deployment frequency",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 1,
    },
  },
  {
    id: "deterministic-better-than-ai",
    name: "Company where deterministic automation is preferable to AI",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "No CRM, spreadsheets", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "Email only", 10: "0-10%", 11: false, 12: "24+ hours",
      13: false, 14: "15+ days", 15: false, 16: "None", 17: true, 18: "2",
      19: "4 hours", 20: false, 21: "None", 22: false, 23: "None",
      24: false, 25: "Basic process documentation",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "no-tier1-opportunity",
    name: "Company where no opportunity should be Tier 1",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "", 10: "0-10%", 11: false, 12: "",
      13: false, 14: "15+ days", 15: false, 16: "", 17: false, 18: "1 - Mostly maintenance",
      19: "", 20: false, 21: "", 22: false, 23: "",
      24: false, 25: "",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 0,
    },
  },
  {
    id: "incomplete-answers",
    name: "Company with incomplete answers",
    answers: {
      1: true, 2: "3 - Balanced", 3: "Salesforce", 10: "0-10%", 11: false,
      14: "8-14 days", 17: true, 22: false,
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "contradictory-answers",
    name: "Company with contradictory answers",
    answers: {
      1: true, 2: "5 - Mostly selling", 3: "No CRM", 4: true, 5: "1 - Basic mail merge", 6: "Multi-touch",
      7: true, 8: "1 - Reactive only", 9: "Gainsight", 10: "50%+", 11: false, 12: "5 min",
      13: true, 14: "4-7 days", 15: true, 16: "Data-driven", 17: true, 18: "3 - Balanced",
      19: "30 min", 20: true, 21: "Lattice", 22: true, 23: "SOC2",
      24: true, 25: "Unknown",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "outside-icp",
    name: "Company outside the initial ICP (e-commerce)",
    answers: {
      1: false, 2: "3 - Balanced", 3: "Shopify", 4: true, 5: "3", 6: "Multi-touch",
      7: false, 8: "2", 9: "None", 10: "10-25%", 11: true, 12: "1 hour",
      13: false, 14: "4-7 days", 15: true, 16: "Sales data", 17: true, 18: "3 - Balanced",
      19: "2 hours", 20: false, 21: "None", 22: false, 23: "PCI DSS",
      24: false, 25: "Inventory accuracy",
    },
    expected: {
      industry: "B2B SaaS",  // Will still classify as B2B SaaS due to question framing
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "very-small-startup",
    name: "Very small startup (under 10 employees)",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "HubSpot free", 4: false, 5: "1 - Basic mail merge", 6: "Don't track",
      7: false, 8: "1 - Reactive only", 9: "None", 10: "0-10%", 11: false, 12: "Same day",
      13: false, 14: "1-3 days", 15: false, 16: "Founder decides", 17: false, 18: "2",
      19: "Same day", 20: false, 21: "None", 22: false, 23: "None",
      24: false, 25: "Time to first sale",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 1,
    },
  },
  {
    id: "enterprise-org",
    name: "Enterprise organization",
    answers: {
      1: true, 2: "4", 3: "Salesforce Enterprise", 4: true, 5: "4", 6: "Multi-touch",
      7: true, 8: "4", 9: "Gainsight Enterprise", 10: "25-50%", 11: true, 12: "< 30 min",
      13: true, 14: "4-7 days", 15: true, 16: "Stakeholder voting", 17: true, 18: "4",
      19: "30 min", 20: true, 21: "Workday", 22: true, 23: "Full compliance team",
      24: true, 25: "Vendor consolidation",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "professional-services",
    name: "Professional-services company",
    answers: {
      1: true, 2: "2", 3: "Dynamics 365", 4: true, 5: "2", 6: "First-touch",
      7: true, 8: "2", 9: "Dynamics", 10: "0-10%", 11: false, 12: "4 hours",
      13: true, 14: "4-7 days", 15: false, 16: "Partner feedback", 17: true, 18: "2",
      19: "2 hours", 20: true, 21: "BambooHR", 22: false, 23: "GDPR",
      24: true, 25: "Utilization rate",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "ecommerce-company",
    name: "E-commerce company",
    answers: {
      1: true, 2: "3 - Balanced", 3: "Shopify Plus", 4: true, 5: "3", 6: "Multi-touch",
      7: true, 8: "3", 9: "Gorgias", 10: "10-25%", 11: true, 12: "1 hour",
      13: true, 14: "4-7 days", 15: true, 16: "Sales data", 17: true, 18: "3 - Balanced",
      19: "1 hour", 20: true, 21: "BambooHR", 22: true, 23: "PCI compliance",
      24: true, 25: "Cart abandonment rate",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
  {
    id: "multiple-equal-opportunities",
    name: "Company with multiple equally strong opportunities",
    answers: {
      1: false, 2: "1 - Mostly manual", 3: "Salesforce", 4: false, 5: "1 - Basic mail merge", 6: "First-touch",
      7: false, 8: "1 - Reactive only", 9: "None", 10: "0-10%", 11: false, 12: "8 hours",
      13: false, 14: "15+ days", 15: false, 16: "None", 17: false, 18: "1 - Mostly maintenance",
      19: "Days", 20: false, 21: "None", 22: false, 23: "None",
      24: false, 25: "Multiple processes",
    },
    expected: {
      minTier1Count: 0,
      maxTier1Count: 2,
    },
  },
];
