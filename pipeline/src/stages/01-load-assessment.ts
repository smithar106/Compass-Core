import type { EvidenceRecord, InferredField, CompanyIntelligence, EvidenceBackedSignal, ConfidenceAssessment, PipelineContext } from "../types/index.js";

export interface LoadAssessmentOutput {
  sessionId: string;
  userId: string;
  answers: Array<{
    questionId: number;
    questionVersion: string;
    value: string | number | boolean;
    type: string;
    order: number;
    wasSkipped: boolean;
    timeSpent: number;
    metadata: Record<string, unknown>;
  }>;
  metadata: Record<string, unknown>;
  evidence: EvidenceRecord[];
}

export async function loadAssessment(input: { sessionId: string }, context: PipelineContext): Promise<LoadAssessmentOutput> {
  const start = Date.now();
  context.log("load_assessment", "Loading assessment answers", { sessionId: input.sessionId });

  const { data: answers, error: answersError } = await context.supabase
    .from("assessment_answers")
    .select("*")
    .eq("session_id", input.sessionId)
    .order("question_order", { ascending: true });

  if (answersError) throw new Error(`Failed to load assessment answers: ${answersError.message}`);
  if (!answers || answers.length === 0) throw new Error(`No answers found for session ${input.sessionId}`);

  const { data: session, error: sessionError } = await context.supabase
    .from("assessment_sessions")
    .select("*")
    .eq("id", input.sessionId)
    .single();

  if (sessionError) throw new Error(`Failed to load session: ${sessionError.message}`);

  const evidence: EvidenceRecord[] = answers.map((a: any) => ({
    id: `evt-answer-${a.id}`,
    type: "user_answer" as const,
    evidenceClass: "User" as const,
    sourceLabel: `Assessment Q${a.question_id}`,
    content: `User answered Q${a.question_id} (${a.answer_type}): ${JSON.stringify(a.answer_value)}`,
    observedAt: a.created_at,
    confidence: 0.9,
    reliability: 0.9,
    metadata: a.metadata || {},
  }));

  context.log("load_assessment", "Loaded assessment", {
    answerCount: answers.length,
    evidenceCount: evidence.length,
    duration: Date.now() - start,
  });

  return {
    sessionId: input.sessionId,
    userId: session.user_id,
    answers: answers.map((a: any, i: number) => ({
      questionId: a.question_id,
      questionVersion: a.question_version || "1.0",
      value: a.answer_value,
      type: a.answer_type,
      order: a.question_order ?? i,
      wasSkipped: a.was_skipped || false,
      timeSpent: a.time_spent || 0,
      metadata: a.metadata || {},
    })),
    metadata: session.metadata || {},
    evidence,
  };
}
