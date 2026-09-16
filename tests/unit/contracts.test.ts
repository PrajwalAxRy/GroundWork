import {
  creditBalanceSchema,
  ideaSchema,
  jobSchema,
  roadmapSchema,
  shapeSessionSchema,
} from '@/lib/contracts/product';
import { ideas } from '@/lib/fixtures/ideas';
import { shapeSessions } from '@/lib/fixtures/shapes';
import { describe, expect, it } from 'vitest';

describe('product contracts', () => {
  it('accepts every dashboard fixture', () => {
    expect(ideas.map((idea) => ideaSchema.parse(idea))).toHaveLength(5);
  });

  it('accepts every Shape fixture', () => {
    expect(shapeSessions.map((shape) => shapeSessionSchema.parse(shape))).toHaveLength(2);
  });

  it('migrates the previous frozen Shape format', () => {
    const migrated = shapeSessionSchema.parse({
      ideaId: 'idea-legacy',
      frozen: true,
      readiness: 'Idea frozen',
      summary: [{ label: 'Idea', value: 'A saved summary', provenance: 'confirmed' }],
      messages: [{ id: 'message-1', role: 'user', body: 'A saved thought' }],
      openQuestions: [],
    });

    expect(migrated.lifecycle).toBe('frozen');
    expect(migrated.acceptedSummary).toBe('A saved summary');
  });

  it('rejects unknown frontend report blocks', () => {
    const result = roadmapSchema.safeParse({ schemaVersion: 1 });
    expect(result.success).toBe(false);
  });

  it('models backend-owned credit and job state', () => {
    expect(creditBalanceSchema.parse({ available: 18, reserved: 0 })).toEqual({
      available: 18,
      reserved: 0,
    });
    expect(
      jobSchema.safeParse({
        id: 'job-1',
        ideaId: 'idea-1',
        kind: 'investigation',
        state: 'researching',
        phaseLabel: 'Gathering evidence',
        reservedCredits: 4,
        creditsReleased: false,
      }).success,
    ).toBe(true);
  });
});
