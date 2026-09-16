import {
  PROTOTYPE_INITIAL_CREDITS,
  PROTOTYPE_INVESTIGATION_CREDITS,
} from '@/lib/config/prototype-commercial';
import { createMockShapeReply } from '@/lib/services/mock-shape-responder';
import { createMemoryProductService } from '@/lib/services/product-service';
import { describe, expect, it } from 'vitest';

describe('Shape product service', () => {
  it('pauses on acceptance, invalidates acceptance on resume, and can be accepted again', async () => {
    const service = createMemoryProductService();

    const paused = await service.acceptShapeSummary('idea-01');
    expect(paused?.lifecycle).toBe('review_paused');
    expect(paused?.acceptedSummary).toBeTruthy();

    const resumed = await service.resumeShape('idea-01');
    expect(resumed?.lifecycle).toBe('shaping');
    expect(resumed?.acceptedSummary).toBeUndefined();

    const pausedAgain = await service.acceptShapeSummary('idea-01');
    expect(pausedAgain?.lifecycle).toBe('review_paused');
  });

  it('freezes Shape and reserves credits exactly once', async () => {
    const service = createMemoryProductService();
    await service.acceptShapeSummary('idea-01');

    const first = await service.startInvestigation('idea-01');
    const duplicate = await service.startInvestigation('idea-01');

    expect(first.session.lifecycle).toBe('frozen');
    expect(duplicate.job.id).toBe(first.job.id);
    expect(duplicate.creditBalance).toEqual({
      available: PROTOTYPE_INITIAL_CREDITS - PROTOTYPE_INVESTIGATION_CREDITS,
      reserved: PROTOTYPE_INVESTIGATION_CREDITS,
    });
  });

  it('keeps the accepted summary paused when there are not enough credits', async () => {
    const service = createMemoryProductService();
    await service.acceptShapeSummary('idea-01');
    await service.startInvestigation('idea-01');
    await service.acceptShapeSummary('idea-02');
    await service.startInvestigation('idea-02');

    const idea = await service.createIdea('A third idea that should remain safely paused.');
    const accepted = await service.acceptShapeSummary(idea.id);

    await expect(service.startInvestigation(idea.id)).rejects.toMatchObject({
      code: 'INSUFFICIENT_CREDITS',
    });
    expect((await service.getShape(idea.id))?.lifecycle).toBe('review_paused');
    expect((await service.getShape(idea.id))?.acceptedSummary).toBe(accepted?.acceptedSummary);
    expect(await service.getCreditBalance()).toEqual({ available: 0, reserved: 10 });
  });

  it('retries a failed Investigation without duplicating its reservation', async () => {
    const service = createMemoryProductService();

    const first = await service.retryInvestigation('idea-05');
    const duplicate = await service.retryInvestigation('idea-05');

    expect(first.job.state).toBe('queued');
    expect(first.job.creditsReleased).toBe(false);
    expect(duplicate.job.id).toBe(first.job.id);
    expect(duplicate.creditBalance).toEqual({
      available: PROTOTYPE_INITIAL_CREDITS - PROTOTYPE_INVESTIGATION_CREDITS,
      reserved: PROTOTYPE_INVESTIGATION_CREDITS,
    });
  });

  it('defers current-evidence questions to Investigation', async () => {
    const service = createMemoryProductService();
    const question = 'Who are the current competitors and what is their pricing?';

    const session = await service.submitShapeTurn('idea-01', question);
    const reply = session?.messages.at(-1);

    expect(session?.openQuestions).toContain(question);
    expect(reply?.note).toBe('Saved for live research during Investigation');
    expect(reply?.body).toContain('will not guess from memory');
  });

  it('preserves the user message when the mock response fails and replaces only the failure on retry', async () => {
    let attempts = 0;
    const service = createMemoryProductService({
      responder: async (session, message) => {
        attempts += 1;
        if (attempts === 1) throw new Error('Temporary mock failure');
        return createMockShapeReply(session, message);
      },
    });

    const failed = await service.submitShapeTurn('idea-01', 'The buyer is the clinic manager.');
    expect(failed?.messages.at(-2)?.body).toBe('The buyer is the clinic manager.');
    expect(failed?.messages.at(-1)?.failed).toBe(true);

    const retried = await service.retryShapeResponse('idea-01');
    expect(retried?.messages.at(-2)?.body).toBe('The buyer is the clinic manager.');
    expect(retried?.messages.at(-1)?.failed).toBeUndefined();
  });
});
