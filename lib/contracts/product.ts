import { z } from 'zod';

export const stageKeySchema = z.enum(['shape', 'investigate', 'roadmap']);
export const stageStateSchema = z.enum([
  'active',
  'ready',
  'locked',
  'running',
  'complete',
  'unread',
  'available',
  'failed',
]);

export const stageSchema = z.object({
  key: stageKeySchema,
  label: z.string().min(1),
  state: stageStateSchema,
  action: z.string().min(1),
  note: z.string().min(1),
});

export const verdictSchema = z.object({
  label: z.enum([
    'Worth pursuing',
    'Refine before pursuing',
    'Test the critical assumption',
    'Major obstacles',
    'Reconsider this version',
  ]),
  confidence: z.string().min(1),
});

export const ideaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  brief: z.string().min(1),
  updated: z.string().min(1),
  verdict: verdictSchema.optional(),
  notice: z.string().min(1).optional(),
  stages: z.array(stageSchema).length(3),
});

export const provenanceSchema = z.enum([
  'confirmed',
  'inferred',
  'suggested',
  'unknown',
  'conflicting',
]);
export const briefFieldStatusSchema = z.enum(['confirmed', 'assumption', 'investigate']);

export const summaryFieldSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  provenance: provenanceSchema,
});

export const shapeMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  body: z.string().min(1),
  note: z.string().min(1).optional(),
  failed: z.boolean().optional(),
});

export const shapeSessionSchema = z.object({
  ideaId: z.string().min(1),
  frozen: z.boolean(),
  readiness: z.string().min(1),
  summary: z.array(summaryFieldSchema),
  messages: z.array(shapeMessageSchema),
  openQuestions: z.array(z.string().min(1)),
});

export const ideaBriefSchema = z.object({
  schemaVersion: z.literal(1),
  ideaId: z.string().min(1),
  frozen: z.boolean(),
  fields: z.array(
    z.object({
      key: z.enum([
        'idea',
        'problem',
        'targetUser',
        'buyer',
        'solution',
        'valueProposition',
        'alternatives',
        'geography',
        'businessModel',
        'distribution',
        'founderContext',
        'criticalAssumptions',
      ]),
      label: z.string().min(1),
      value: z.string(),
      status: briefFieldStatusSchema,
    }),
  ),
  investigationQuestions: z.array(z.string().min(1)),
});

export const sectionStatusSchema = z.enum([
  'complete',
  'partial',
  'insufficient_evidence',
  'not_applicable',
]);
export const evidenceKindSchema = z.enum([
  'verified_fact',
  'external_estimate',
  'groundwork_inference',
  'not_found',
  'not_applicable',
  'research_error',
]);

export const reportSchema = z.object({
  schemaVersion: z.literal(1),
  ideaId: z.string().min(1),
  verdict: verdictSchema,
  summary: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      status: sectionStatusSchema,
      blocks: z.array(
        z.object({
          type: z.enum(['prose', 'evidence_rows', 'key_value', 'table', 'timeline']),
          data: z.unknown(),
        }),
      ),
    }),
  ),
  sources: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      publisher: z.string().min(1),
      url: z.string().url(),
      accessedAt: z.string().min(1),
      evidenceKind: evidenceKindSchema,
    }),
  ),
});

export const roadmapSchema = z.object({
  schemaVersion: z.literal(1),
  ideaId: z.string().min(1),
  recommendedPath: z.string().min(1),
  milestones: z
    .array(
      z.object({ id: z.string(), label: z.string(), sequence: z.number().int().nonnegative() }),
    )
    .min(3)
    .max(5),
  experiments: z
    .array(z.object({ title: z.string(), purpose: z.string(), signal: z.string() }))
    .max(3),
  phases: z
    .array(
      z.object({
        title: z.string().min(1),
        objective: z.string().min(1),
        actions: z.array(z.string().min(1)).max(3),
        milestone: z.string().min(1),
        primaryRisk: z.string().min(1),
      }),
    )
    .min(3)
    .max(5),
});

export const creditBalanceSchema = z.object({
  available: z.number().int().nonnegative(),
  reserved: z.number().int().nonnegative(),
});

export const jobSchema = z.object({
  id: z.string().min(1),
  ideaId: z.string().min(1),
  kind: z.enum(['investigation', 'roadmap']),
  state: z.enum([
    'awaiting_payment',
    'queued',
    'researching',
    'verifying',
    'assembling',
    'completed',
    'failed',
  ]),
  phaseLabel: z.string().min(1),
  reservedCredits: z.number().int().nonnegative(),
  creditsReleased: z.boolean(),
});

export type StageKey = z.infer<typeof stageKeySchema>;
export type StageState = z.infer<typeof stageStateSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type Idea = z.infer<typeof ideaSchema>;
export type Provenance = z.infer<typeof provenanceSchema>;
export type SummaryField = z.infer<typeof summaryFieldSchema>;
export type ShapeMessage = z.infer<typeof shapeMessageSchema>;
export type ShapeSession = z.infer<typeof shapeSessionSchema>;
export type IdeaBrief = z.infer<typeof ideaBriefSchema>;
export type InvestigationReport = z.infer<typeof reportSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
export type CreditBalance = z.infer<typeof creditBalanceSchema>;
export type ProductJob = z.infer<typeof jobSchema>;
