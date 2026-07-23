// Pipeline debug logging (Priority 3)
// Every pipeline stage produces inspectable output. Not exposed to end users.
// Used for debugging, benchmarking, and audit.

import type { PipelineStageLog, StageName } from "../types/index.js";

export class PipelineLogger {
  private logs: PipelineStageLog[] = [];
  private startedAt: Date;

  constructor(private readonly requestId: string) {
    this.startedAt = new Date();
  }

  startStage(stage: StageName, inputSize: number, detail?: Record<string, unknown>): void {
    this.logs.push({
      stage,
      startedAt: new Date().toISOString(),
      completedAt: "",
      durationMs: 0,
      inputSize,
      outputSize: 0,
      detail: detail ?? {},
    });
  }

  completeStage(stage: StageName, outputSize: number, detail?: Record<string, unknown>): void {
    const log = this.logs.find((l) => l.stage === stage && l.completedAt === "");
    if (!log) return;
    log.completedAt = new Date().toISOString();
    log.durationMs = new Date().getTime() - new Date(log.startedAt).getTime();
    log.outputSize = outputSize;
    if (detail) Object.assign(log.detail, detail);
  }

  failStage(stage: StageName, error: string): void {
    const log = this.logs.find((l) => l.stage === stage && l.completedAt === "");
    if (!log) return;
    log.completedAt = new Date().toISOString();
    log.durationMs = new Date().getTime() - new Date(log.startedAt).getTime();
    log.detail["error"] = error;
  }

  getLogs(): PipelineStageLog[] {
    return [...this.logs];
  }

  getSummary(): string {
    const total = this.logs.reduce((sum, l) => sum + l.durationMs, 0);
    const parts = this.logs.map((l) => `${l.stage}: ${l.durationMs}ms (in=${l.inputSize} out=${l.outputSize})`);
    return `Pipeline Run ${this.requestId}\n${parts.join("\n")}\nTotal: ${total}ms`;
  }
}

export function createLogger(requestId: string): PipelineLogger {
  return new PipelineLogger(requestId);
}
