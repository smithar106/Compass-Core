import { InterventionPath, BusinessProblem, InterventionOption, EvidenceRecord, Department, PipelineContext } from "../types/index.js";
import { loadBlueprintLibrary } from "./blueprint-library.js";

interface GenerateInterventionOptionsInput {
  businessProblem: BusinessProblem;
  candidateBlueprintIds: string[];
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  evidence: EvidenceRecord[];
}

function generateAllInterventionPaths(): InterventionOption[] {
  const baseProblemScore = 5;
  const businessCaseScore = 7;
  const riskScore = 8;

  const paths: InterventionOption[] = [
    {
      id: "ai_ml_model",
      path: "ai",
      summary: "Build an AI/ML model to automatically handle this task",
      expectedImpact: {
        cost: 100000,
        timePerOccurrence: 45,
        userHoursPerWeek: 20,
        customerImpactScore: 7,
        revenueImpact: 250000,
        strategicImportance: "high",
      },
      estimatedCost: {
        initial: 120000,
        monthly: 15000,
        yearly: 5000,
        implementationComplexity: "high",
      },
      estimatedTimeToValue: {
        min: 12,
        max: 20,
        unit: "months",
      },
      implementationComplexity: 8,
      dataReadiness: 5,
      organizationalReadiness: 4,
      technicalRisk: 7,
      operationalRisk: 6,
      humanJudgmentRequirement: 3,
      reversibility: 6,
      confidence: 6,
      assumptions: [
        { id: "ai_assumptions_1", statement: "Sufficient training data available", confidence: 7, evidenceIds: ["det-data-availability"] },
        { id: "ai_assumptions_2", statement: "Stakeholders will adopt AI solution", confidence: 5, evidenceIds: ["det-adoption-likelihood"] },
      ],
      evidenceIds: ["det-ai-potential-1", "det-ai-potential-2"],
      disqualifiers: [],
    },
    {
      id: "deterministic_automation",
      path: "deterministic_software",
      summary: "Build deterministic software rules and automation scripts",
      expectedImpact: {
        cost: 30000,
        timePerOccurrence: 5,
        userHoursPerWeek: 5,
        customerImpactScore: 5,
        revenueImpact: 50000,
        strategicImportance: "medium",
      },
      estimatedCost: {
        initial: 40000,
        monthly: 2000,
        yearly: 1000,
        implementationComplexity: "medium",
      },
      estimatedTimeToValue: {
        min: 4,
        max: 8,
        unit: "months",
      },
      implementationComplexity: 5,
      dataReadiness: 8,
      organizationalReadiness: 7,
      technicalRisk: 4,
      operationalRisk: 3,
      humanJudgmentRequirement: 2,
      reversibility: 9,
      confidence: 8,
      assumptions: [
        { id: "det_assumptions_1", statement: "Process rules are well-defined and stable", confidence: 8, evidenceIds: ["det-process-specification"] },
        { id: "det_assumptions_2", statement: "Data is reliable and complete", confidence: 7, evidenceIds: ["det-data-quality"] },
      ],
      evidenceIds: ["det-rules-clarity", "det-data-readiness"],
      disqualifiers: [],
    },
    {
      id: "process_redesign",
      path: "process_redesign",
      summary: "Redesign the process to eliminate waste and improve flow",
      expectedImpact: {
        cost: 15000,
        timePerOccurrence: 15,
        userHoursPerWeek: 10,
        customerImpactScore: 6,
        revenueImpact: 100000,
        strategicImportance: "high",
      },
      estimatedCost: {
        initial: 25000,
        monthly: 1500,
        yearly: 500,
        implementationComplexity: "medium",
      },
      estimatedTimeToValue: {
        min: 3,
        max: 6,
        unit: "months",
      },
      implementationComplexity: 6,
      dataReadiness: 6,
      organizationalReadiness: 8,
      technicalRisk: 5,
      operationalRisk: 7,
      humanJudgmentRequirement: 8,
      reversibility: 8,
      confidence: 7,
      assumptions: [
        { id: "proc_assumptions_1", statement: "Process ownership is clear", confidence: 6, evidenceIds: ["det-process-owners"] },
        { id: "proc_assumptions_2", statement: "Stakeholders are open to change", confidence: 5, evidenceIds: ["det-change-readiness"] },
      ],
      evidenceIds: ["det-current-process", "det-stakeholder-interviews"],
      disqualifiers: [],
    },
    {
      id: "human_work_focus",
      path: "human_work",
      summary: "Assign to humans where judgment and empathy are required",
      expectedImpact: {
        cost: 10000,
        timePerOccurrence: 120,
        userHoursPerWeek: 15,
        customerImpactScore: 8,
        revenueImpact: 0,
        strategicImportance: "medium",
      },
      estimatedCost: {
        initial: 5000,
        monthly: 3000,
        yearly: 0,
        implementationComplexity: "low",
      },
      estimatedTimeToValue: {
        min: 0,
        max: 1,
        unit: "months",
      },
      implementationComplexity: 3,
      dataReadiness: 3,
      organizationalReadiness: 5,
      technicalRisk: 2,
      operationalRisk: 4,
      humanJudgmentRequirement: 9,
      reversibility: 10,
      confidence: 9,
      assumptions: [
        { id: "human_assumptions_1", statement: "Available staff have the necessary expertise", confidence: 8, evidenceIds: ["det-staff-availability"] },
        { id: "human_assumptions_2", statement: "Customers prefer human interaction", confidence: 7, evidenceIds: ["det-customer-preferences"] },
      ],
      evidenceIds: ["det-human-expertise", "det-customer-preferences"],
      disqualifiers: [],
    },
    {
      id: "hybrid_approach",
      path: "hybrid",
      summary: "Combine AI assistance with human oversight and deterministic rules",
      expectedImpact: {
        cost: 60000,
        timePerOccurrence: 30,
        userHoursPerWeek: 8,
        customerImpactScore: 8,
        revenueImpact: 150000,
        strategicImportance: "high",
      },
      estimatedCost: {
        initial: 80000,
        monthly: 10000,
        yearly: 3000,
        implementationComplexity: "high",
      },
      estimatedTimeToValue: {
        min: 8,
        max: 14,
        unit: "months",
      },
      implementationComplexity: 7,
      dataReadiness: 6,
      organizationalReadiness: 6,
      technicalRisk: 6,
      operationalRisk: 5,
      humanJudgmentRequirement: 6,
      reversibility: 7,
      confidence: 6,
      assumptions: [
        { id: "hyb_assumptions_1", statement: "Sufficient data for AI component", confidence: 6, evidenceIds: ["det-data-availability"] },
        { id: "hyb_assumptions_2", statement: "Human oversight resources available", confidence: 7, evidenceIds: ["det-human-resources"] },
      ],
      evidenceIds: ["det-hybrid-vision", "det-mixed-confidence"],
      disqualifiers: [],
    },
    {
      id: "no_action",
      path: "no_action_yet",
      summary: "Do not implement this problem yet; track and reassess later",
      expectedImpact: {
        cost: 0,
        timePerOccurrence: 0,
        userHoursPerWeek: 0,
        customerImpactScore: 2,
        revenueImpact: 0,
        strategicImportance: "low",
      },
      estimatedCost: {
        initial: 0,
        monthly: 0,
        yearly: 0,
        implementationComplexity: "none",
      },
      estimatedTimeToValue: {
        min: 12,
        max: 24,
        unit: "months",
      },
      implementationComplexity: 0,
      dataReadiness: 2,
      organizationalReadiness: 2,
      technicalRisk: 0,
      operationalRisk: 0,
      humanJudgmentRequirement: 1,
      reversibility: 10,
      confidence: 5,
      assumptions: [
        { id: "none_assumptions_1", statement: "Problem will remain unsolved without intervention", confidence: 6, evidenceIds: ["det-impact-assessment"] },
      ],
      evidenceIds: ["det-problem-justification", "det-impact-threshold"],
      disqualifiers: ["Low strategic importance", "Insignificant impact", "Missing executive sponsorship"],
    },
  ];

  return paths;
}

function selectBestInterventionPaths(options: InterventionOption[], problem: BusinessProblem): InterventionOption[] {
  const rankedOptions = options
    .filter(option => {
      if (option.path === "no_action_yet") return true;
      if (option.path === "hybrid") return option.technicalRisk <= 6 && option.estimatedCost.initial <= 100000;
      if (option.path === "ai") return option.dataReadiness >= 4 && option.technicalRisk <= 8;
      if (option.path === "deterministic_software") return option.estimatedCost.initial <= 50000 && option.dataReadiness >= 7;
      if (option.path === "process_redesign") return option.humanJudgmentRequirement <= 7 && problem.currentImpact.userHoursPerWeek <= 20;
      if (option.path === "human_work") return true;
      return true;
    })
    .sort((a, b) => {
      const scoreA = a.expectedImpact.customerImpactScore * 0.4 + a.confidence * 0.3 - a.estimatedCost.initial / 100000 * 0.2 + a.expectedImpact.strategicImportance === "high" ? 2 : 0;
      const scoreB = b.expectedImpact.customerImpactScore * 0.4 + b.confidence * 0.3 - b.estimatedCost.initial / 100000 * 0.2 + b.expectedImpact.strategicImportance === "high" ? 2 : 0;
      return scoreB - scoreA;
    })
    .slice(0, 4);

  return rankedOptions;
}

function calculatePathSuitability(option: InterventionOption, problem: BusinessProblem): { score: number; disqualifiers: string[]; } {
  let score = 0;
  const disqualifiers: string[] = [];

  switch (option.path) {
    case "ai":
      score += option.dataReadiness * 0.3;
      score += option.technicalRisk <= 6 ? 3 : 0;
      score += option.estimatedCost.initial <= 50000 ? 2 : 0;
      if (option.technicalRisk > 8) disqualifiers.push("Technical risk too high for AI solution");
      if (problem.currentImpact.userHoursPerWeek < 5) disqualifiers.push("Insufficient manual work to justify AI");
      if (option.estimatedCost.initial > 100000) disqualifiers.push("Cost exceeds typical AI project budget");
      break;
    case "deterministic_software":
      score += option.dataReadiness * 0.4;
      score += (10 - option.technicalRisk) * 0.25;
      score += option.estimatedTimeToValue.max <= 6 ? 3 : 0;
      if (option.dataReadiness < 5) disqualifiers.push("Data not mature enough for deterministic automation");
      if (problem.currentImpact.customerImpactScore < 4) disqualifiers.push("Customer impact too low for deterministic solution");
      if (option.estimatedTimeToValue.max > 9) disqualifiers.push("Timeline too long for deterministic approach");
      break;
    case "process_redesign":
      score += (10 - option.humanJudgmentRequirement) * 0.3;
      score += problem.currentImpact.userHoursPerWeek > 10 ? 3 : 0;
      score += option.estimatedTimeToValue.max <= 8 ? 2 : 0;
      if (option.humanJudgmentRequirement > 8) disqualifiers.push("Human judgment requirement too high for process redesign");
      if (problem.currentImpact.customerImpactScore < 5) disqualifiers.push("Customer impact too low for process redesign");
      if (option.estimatedTimeToValue.max > 10) disqualifiers.push("Timeline too long for process redesign");
      break;
    case "human_work":
      score += (10 - option.implementationComplexity) * 0.4;
      score += option.humanJudgmentRequirement >= 7 ? 3 : 0;
      score += option.estimatedCost.initial <= 5000 ? 2 : 0;
      if (problem.currentImpact.customerImpactScore < 6) disqualifiers.push("Customer impact too low for human intervention");
      if (option.reversibility < 7) disqualifiers.push("Solution not reversible enough");
      if (option.implementationComplexity > 5) disqualifiers.push("Implementation complexity too high for human solution");
      break;
    case "hybrid":
      score += option.dataReadiness * 0.3;
      score += (10 - option.technicalRisk) * 0.3;
      score += problem.currentImpact.customerImpactScore * 0.2;
      if (option.dataReadiness < 4) disqualifiers.push("Data not mature enough for hybrid approach");
      if (option.technicalRisk > 7) disqualifiers.push("Technical risk too high for hybrid approach");
      if (option.estimatedCost.initial > 80000) disqualifiers.push("Cost too high for hybrid implementation");
      break;
    case "no_action_yet":
      score += option.estimatedCost.initial === 0 ? 5 : 0;
      score += option.expectedImpact.strategicImportance === "low" ? 5 : 0;
      if (option.expectedImpact.customerImpactScore > 6) disqualifiers.push("Impact too high to defer");
      if (option.expectedImpact.strategicImportance === "high") disqualifiers.push("Strategic importance too high to defer");
      break;
  }

  return { score: Math.round(score * 10) / 10, disqualifiers };
}

export async function generateBusinessProblems(input: GenerateCandidatesInput, _context: PipelineContext): Promise<{ problems: BusinessProblem[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];

  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

  const painPoints = input.workflowSignals.painPoints || [];

  const problems: BusinessProblem[] = [];

  for (const pain of painPoints) {
    const problem: BusinessProblem = {
      id: `problem-${problems.length + 1}`,
      title: pain.name,
      description: pain.value,
      department: pain.department,
      workflow: `Current ${pain.department} workflow includes ${pain.value}`,
      desiredOutcome: `Improve efficiency by 30% or reduce costs by 20%",
      currentImpact: {
        cost: pain.severity === "high" ? 50000 : pain.severity === "medium" ? 25000 : 10000,
        timePerOccurrence: pain.severity === "high" ? 120 : pain.severity === "medium" ? 60 : 30,
        userHoursPerWeek: pain.severity === "high" ? 20 : pain.severity === "medium" ? 10 : 5,
        customerImpactScore: pain.severity === "high" ? 8 : pain.severity === "medium" ? 6 : 4,
        strategicImportance: pain.severity === "high" ? "high" : pain.severity === "medium" ? "medium" : "low",
      },
      evidenceIds: [pain.evidenceIds[0]],
    };
    problems.push(problem);
  }

  return { problems, evidence };
}

export async function generateInterventionOptions(input: GenerateInterventionOptionsInput, _context: PipelineContext): Promise<{ options: InterventionOption[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];

  const managerDepartment = input.businessProblem.department as Department;

  const allPaths = generateAllInterventionPaths();

  const problemSpecificQualifications: Record<string, string[]> = {
    "customer_data": ["ai", "deterministic_software", "hybrid"],
    "repetitive_rule": ["deterministic_software", "process_redesign", "hybrid"],
    "high_judgment": ["human_work", "hybrid", "ai"],
    "complex_process": ["process_redesign", "hybrid"],
    "regulatory_heavy": ["human_work", "hybrid"],
    "data_sparse": ["no_action_yet", "human_work"],
  };

  const possibleDataDrizzle = ["customer_data", "repetitive_rule", "high_judgment", "complex_process", "regulatory_heavy", "data_sparse"];

  const likelyQualifications = possibleDataDrizzle.reduce((qualifications: InterventionPath[], drizzle: string): InterventionPath[] => {
    const matchingPaths = problemSpecificQualifications[drizzle] || [];
    return [...qualifications, ...matchingPaths];
  }, [] as InterventionPath[]);

  const filteredPaths = allPaths.filter(option => 
    likelyQualifications.includes(option.path)
  );

  const documentedImpacts = [];
  for (const path of filteredPaths.map(p => p.path)) {
    const docs = [
      { path, doc: "Process Map", type: "deterministic_derivation" },
      { path, doc: "Available Metrics", type: "deterministic_derivation" },
    ];
    for (const doc of docs) {
      const evId = `ev-${path}-${doc.type}`;
      const evidenceRecord: EvidenceRecord = {
        id: evId,
        type: doc.type,
        evidenceClass: "Deterministic",
        sourceLabel: `${doc.path}: ${doc.doc}`,
        content: `${doc.path}: ${doc.doc}`, 
        confidence: 8,
        reliability: 0.8,
      };
      evidence.push(evidenceRecord);
      documentedImpacts.push(evId);
    }
  }

  const problemsWithDPI = input.answers.filter((a) => 
    a.department && a.department.includes(input.businessProblem.department)
  ).length > 0;

  if (problemsWithDPI) {
    const evId = "ev-system-adoption-likely";
    const adoptionEv: EvidenceRecord = {
      id: evId,
      type: "inference",
      evidenceClass: "Inference",
      sourceLabel: "Stakeholder analysis",
      content: "Based on department responses, intervention supported",
      confidence: 7,
      reliability: 0.7,
    };
    evidence.push(adoptionEv);
    documentedImpacts.push(evId);
  }

  const finalOptions = filteredPaths.map(option => {
    const suitability = calculatePathSuitability(option, input.businessProblem);

    const updatedOption: InterventionOption = {
      ...option,
      confidence: Math.min(option.confidence + 0.2, 10),
      assumptions: option.assumptions.map((a, i) => ({ ...a, confidence: Math.min(a.confidence + 0.15, 10) })),
      evidenceIds: [...option.evidenceIds, ...documentedImpacts],
      disqualifiers: [...option.disqualifiers, ...suitability.disqualifiers],
    };

    return updatedOption;
  });

  return { options: finalOptions, evidence };
}
