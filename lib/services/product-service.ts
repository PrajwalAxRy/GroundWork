import {
  PROTOTYPE_INITIAL_CREDITS,
  PROTOTYPE_INVESTIGATION_CREDITS,
} from '@/lib/config/prototype-commercial';
import {
  type CreditBalance,
  type Idea,
  type IdeaBrief,
  type InvestigationReport,
  type ProductJob,
  type Roadmap,
  type ShapeSession,
  type SummaryField,
  creditBalanceSchema,
  ideaSchema,
  jobSchema,
  shapeSessionSchema,
} from '@/lib/contracts/product';
import { ideas as initialIdeas } from '@/lib/fixtures/ideas';
import { investigationJobs as initialInvestigationJobs } from '@/lib/fixtures/jobs';
import { shapeSessions as initialShapeSessions } from '@/lib/fixtures/shapes';
import { type MockShapeResponder, createMockShapeReply } from '@/lib/services/mock-shape-responder';
import { z } from 'zod';

const storageKey = 'groundwork-product-state-v4';
const legacyStorageKey = 'groundwork-product-state-v3';

const prototypeStoreSchema = z.object({
  ideas: z.array(ideaSchema),
  shapes: z.array(shapeSessionSchema),
  drafts: z.record(z.string()),
  jobs: z.array(jobSchema).default([]),
  creditBalance: creditBalanceSchema.default({
    available: PROTOTYPE_INITIAL_CREDITS,
    reserved: 0,
  }),
});

type PrototypeStore = z.infer<typeof prototypeStoreSchema>;

type StartInvestigationResult = {
  session: ShapeSession;
  job: ProductJob;
  creditBalance: CreditBalance;
};

type RetryInvestigationResult = {
  job: ProductJob;
  creditBalance: CreditBalance;
};

export class ProductServiceError extends Error {
  constructor(
    public readonly code: 'IDEA_NOT_FOUND' | 'INVALID_SHAPE_STATE' | 'INSUFFICIENT_CREDITS',
    message: string,
  ) {
    super(message);
    this.name = 'ProductServiceError';
  }
}

export interface ProductService {
  listIdeas(): Promise<Idea[]>;
  getIdea(ideaId: string): Promise<Idea | null>;
  createIdea(thought: string): Promise<Idea>;
  renameIdea(ideaId: string, title: string): Promise<Idea | null>;
  deleteIdea(ideaId: string): Promise<void>;
  getShape(ideaId: string): Promise<ShapeSession | null>;
  getBrief(ideaId: string): Promise<IdeaBrief | null>;
  getDraft(ideaId: string): Promise<string>;
  saveDraft(ideaId: string, draft: string): Promise<void>;
  submitShapeTurn(ideaId: string, body: string): Promise<ShapeSession | null>;
  retryShapeResponse(ideaId: string): Promise<ShapeSession | null>;
  acceptShapeSummary(ideaId: string): Promise<ShapeSession | null>;
  resumeShape(ideaId: string): Promise<ShapeSession | null>;
  addInvestigationQuestion(ideaId: string, question: string): Promise<void>;
  updateSummaryField(ideaId: string, field: SummaryField): Promise<ShapeSession | null>;
  startInvestigation(ideaId: string): Promise<StartInvestigationResult>;
  retryInvestigation(ideaId: string): Promise<RetryInvestigationResult>;
  getCreditBalance(): Promise<CreditBalance>;
  getJob(ideaId: string, kind: 'investigation' | 'roadmap'): Promise<ProductJob | null>;
  getReport(ideaId: string): Promise<InvestigationReport | null>;
  getRoadmap(ideaId: string): Promise<Roadmap | null>;
}

type StoreAccess = {
  read(): PrototypeStore;
  write(store: PrototypeStore): void;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function initialStore(): PrototypeStore {
  return prototypeStoreSchema.parse({
    ideas: clone(initialIdeas),
    shapes: clone(initialShapeSessions),
    drafts: {},
    jobs: clone(initialInvestigationJobs),
    creditBalance: { available: PROTOTYPE_INITIAL_CREDITS, reserved: 0 },
  });
}

function withFixtureJobs(store: PrototypeStore): PrototypeStore {
  const jobs = [...store.jobs];
  for (const fixture of initialInvestigationJobs) {
    const idea = store.ideas.find((entry) => entry.id === fixture.ideaId);
    const investigate = idea?.stages.find((stage) => stage.key === 'investigate');
    const fixtureMatchesIdea =
      (fixture.state === 'failed' && investigate?.state === 'failed') ||
      (fixture.state === 'completed' &&
        ['complete', 'unread'].includes(investigate?.state ?? '')) ||
      (['queued', 'researching', 'verifying', 'assembling'].includes(fixture.state) &&
        investigate?.state === 'running');

    if (
      fixtureMatchesIdea &&
      !jobs.some((job) => job.ideaId === fixture.ideaId && job.kind === fixture.kind)
    ) {
      jobs.push(clone(fixture));
    }
  }
  return { ...store, jobs };
}

function parseStoredValue(value: string | null): PrototypeStore | null {
  if (!value) return null;
  try {
    const parsed = prototypeStoreSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const browserStore: StoreAccess = {
  read() {
    if (typeof window === 'undefined') return initialStore();

    const current = parseStoredValue(window.localStorage.getItem(storageKey));
    if (current) return withFixtureJobs(current);

    const migrated = parseStoredValue(window.localStorage.getItem(legacyStorageKey));
    if (migrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(migrated));
      return withFixtureJobs(migrated);
    }

    return withFixtureJobs(initialStore());
  },

  write(store) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(prototypeStoreSchema.parse(store)));
  },
};

function titleFromThought(thought: string): string {
  const clean = thought
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]+$/, '');
  return clean.length <= 58 ? clean : `${clean.slice(0, 55).trim()}…`;
}

function briefFromThought(thought: string): string {
  const clean = thought.replace(/\s+/g, ' ').trim();
  return clean.length <= 170 ? clean : `${clean.slice(0, 167).trim()}…`;
}

function workingSummary(session: ShapeSession): string {
  return (
    session.summary.find((field) => field.label === 'Idea')?.value ??
    session.summary[0]?.value ??
    'The current Idea summary is unavailable.'
  );
}

function genericShape(idea: Idea): ShapeSession {
  const frozen = idea.stages.some((stage) => stage.key === 'shape' && stage.state === 'complete');
  return shapeSessionSchema.parse({
    ideaId: idea.id,
    lifecycle: frozen ? 'frozen' : 'shaping',
    acceptedSummary: frozen ? idea.brief : undefined,
    readiness: frozen ? 'Idea frozen' : 'Still taking shape',
    summary: [
      { label: 'Idea', value: idea.brief, provenance: 'confirmed' },
      { label: 'Target user', value: 'Not clear yet', provenance: 'unknown' },
      { label: 'Problem', value: 'Not clear yet', provenance: 'unknown' },
      { label: 'Proposed solution', value: 'Not clear yet', provenance: 'unknown' },
      { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
      {
        label: 'Primary uncertainty',
        value: 'Which assumption should be tested first.',
        provenance: 'suggested',
      },
    ],
    messages: [
      { id: `${idea.id}-1`, role: 'user', body: idea.brief },
      {
        id: `${idea.id}-2`,
        role: 'assistant',
        body: frozen
          ? 'This conversation is now read-only because Investigation has begun.'
          : 'There is a useful starting point here, but the customer and the painful moment are still broad. Who experiences this problem often enough to actively look for a solution?',
      },
    ],
    openQuestions: [],
  });
}

function setIdeaStage(
  idea: Idea,
  key: 'shape' | 'investigate',
  update: Pick<Idea['stages'][number], 'state' | 'action' | 'note'>,
) {
  const stage = idea.stages.find((entry) => entry.key === key);
  if (stage) Object.assign(stage, update);
}

function createService(storeAccess: StoreAccess, responder: MockShapeResponder): ProductService {
  return {
    async listIdeas() {
      return clone(storeAccess.read().ideas);
    },

    async getIdea(ideaId) {
      return clone(storeAccess.read().ideas.find((idea) => idea.id === ideaId) ?? null);
    },

    async createIdea(thought) {
      const cleanThought = thought.trim();
      if (!cleanThought) throw new Error('An idea needs at least one non-space character.');
      const store = storeAccess.read();
      const id = `idea-${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
      const idea: Idea = {
        id,
        title: titleFromThought(cleanThought),
        brief: briefFromThought(cleanThought),
        updated: 'Updated just now',
        stages: [
          {
            key: 'shape',
            label: 'Shape',
            state: 'active',
            action: 'Continue shaping',
            note: 'Clarify the customer and problem',
          },
          {
            key: 'investigate',
            label: 'Investigate',
            state: 'locked',
            action: 'Locked',
            note: 'Review the idea first',
          },
          {
            key: 'roadmap',
            label: 'Roadmap',
            state: 'locked',
            action: 'Locked',
            note: 'Complete investigation',
          },
        ],
      };
      const shape = shapeSessionSchema.parse({
        ideaId: id,
        lifecycle: 'shaping',
        readiness: 'Still taking shape',
        summary: [
          { label: 'Idea', value: briefFromThought(cleanThought), provenance: 'confirmed' },
          { label: 'Target user', value: 'Not clear yet', provenance: 'unknown' },
          { label: 'Problem', value: 'Not clear yet', provenance: 'unknown' },
          { label: 'Proposed solution', value: 'Not clear yet', provenance: 'unknown' },
          { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
          {
            label: 'Primary uncertainty',
            value: 'Who feels this problem most sharply.',
            provenance: 'suggested',
          },
        ],
        messages: [
          { id: `${id}-1`, role: 'user', body: cleanThought },
          {
            id: `${id}-2`,
            role: 'assistant',
            body: 'There is enough here to begin, but the idea will become much stronger once the painful moment is concrete. Who experiences this problem most often, and what are they doing when it happens?',
          },
        ],
        openQuestions: [],
      });
      store.ideas.unshift(idea);
      store.shapes.push(shape);
      store.drafts[id] = '';
      storeAccess.write(store);
      return clone(idea);
    },

    async renameIdea(ideaId, title) {
      const store = storeAccess.read();
      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (!idea) return null;
      idea.title = title.trim();
      storeAccess.write(store);
      return clone(idea);
    },

    async deleteIdea(ideaId) {
      const store = storeAccess.read();
      store.ideas = store.ideas.filter((idea) => idea.id !== ideaId);
      store.shapes = store.shapes.filter((shape) => shape.ideaId !== ideaId);
      store.jobs = store.jobs.filter((job) => job.ideaId !== ideaId);
      delete store.drafts[ideaId];
      storeAccess.write(store);
    },

    async getShape(ideaId) {
      const store = storeAccess.read();
      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (!idea) return null;
      let shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape) {
        shape = genericShape(idea);
        store.shapes.push(shape);
        storeAccess.write(store);
      }
      return clone(shape);
    },

    async getBrief(ideaId) {
      const store = storeAccess.read();
      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (!idea) return null;
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId) ?? genericShape(idea);
      const keyByLabel: Record<string, IdeaBrief['fields'][number]['key']> = {
        Idea: 'idea',
        Problem: 'problem',
        'Target user': 'targetUser',
        'Proposed solution': 'solution',
        'Likely business model': 'businessModel',
        'Primary uncertainty': 'criticalAssumptions',
      };
      return {
        schemaVersion: 1,
        ideaId,
        frozen: shape.lifecycle === 'frozen',
        fields: shape.summary.map((field) => ({
          key: keyByLabel[field.label] ?? 'criticalAssumptions',
          label: field.label,
          value: field.provenance === 'unknown' ? '' : field.value,
          status:
            field.provenance === 'confirmed'
              ? 'confirmed'
              : field.provenance === 'unknown' || field.provenance === 'conflicting'
                ? 'investigate'
                : 'assumption',
        })),
        investigationQuestions: clone(shape.openQuestions),
      };
    },

    async getDraft(ideaId) {
      return storeAccess.read().drafts[ideaId] ?? '';
    },

    async saveDraft(ideaId, draft) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (shape?.lifecycle === 'frozen') return;
      store.drafts[ideaId] = draft;
      storeAccess.write(store);
    },

    async submitShapeTurn(ideaId, body) {
      const cleanBody = body.trim();
      if (!cleanBody) return null;

      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.lifecycle !== 'shaping') return null;

      const turnId = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
      shape.messages.push({ id: `${ideaId}-user-${turnId}`, role: 'user', body: cleanBody });

      try {
        const reply = await responder(clone(shape), cleanBody);
        shape.messages.push({
          id: `${ideaId}-assistant-${turnId}`,
          role: 'assistant',
          body: reply.body,
          note: reply.note,
        });
        if (
          reply.investigationQuestion &&
          !shape.openQuestions.includes(reply.investigationQuestion)
        ) {
          shape.openQuestions.push(reply.investigationQuestion);
          shape.readiness = `${shape.openQuestions.length} research question${shape.openQuestions.length === 1 ? '' : 's'} saved`;
        }
      } catch {
        shape.messages.push({
          id: `${ideaId}-assistant-${turnId}`,
          role: 'assistant',
          body: 'Groundwork could not respond. Your message is saved, and you can retry without retyping it.',
          failed: true,
        });
      }

      store.drafts[ideaId] = '';
      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (idea) idea.updated = 'Updated just now';
      storeAccess.write(store);
      return clone(shape);
    },

    async retryShapeResponse(ideaId) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.lifecycle !== 'shaping') return null;

      const failedIndex = shape.messages.findLastIndex(
        (message) => message.role === 'assistant' && message.failed,
      );
      if (failedIndex < 0) return clone(shape);

      const userMessage = [...shape.messages]
        .slice(0, failedIndex)
        .reverse()
        .find((message) => message.role === 'user');
      if (!userMessage) return clone(shape);

      try {
        const reply = await responder(clone(shape), userMessage.body);
        shape.messages.splice(failedIndex, 1, {
          id: `${ideaId}-assistant-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
          role: 'assistant',
          body: reply.body,
          note: reply.note,
        });
        if (
          reply.investigationQuestion &&
          !shape.openQuestions.includes(reply.investigationQuestion)
        ) {
          shape.openQuestions.push(reply.investigationQuestion);
        }
        storeAccess.write(store);
      } catch {
        // Keep the failed response so another retry remains available.
      }

      return clone(shape);
    },

    async acceptShapeSummary(ideaId) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.lifecycle !== 'shaping') return null;

      shape.lifecycle = 'review_paused';
      shape.acceptedSummary = workingSummary(shape);
      shape.readiness = 'Summary accepted';
      store.drafts[ideaId] = '';

      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (idea) {
        idea.notice = 'Ready to investigate';
        setIdeaStage(idea, 'shape', {
          state: 'ready',
          action: 'Review accepted',
          note: 'Continue shaping or investigate',
        });
        setIdeaStage(idea, 'investigate', {
          state: 'available',
          action: 'Start investigation',
          note: 'Ready when you are',
        });
      }

      storeAccess.write(store);
      return clone(shape);
    },

    async resumeShape(ideaId) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.lifecycle !== 'review_paused') return null;

      shape.lifecycle = 'shaping';
      shape.acceptedSummary = undefined;
      shape.readiness = 'Still taking shape';

      const idea = store.ideas.find((entry) => entry.id === ideaId);
      if (idea) {
        idea.notice = undefined;
        setIdeaStage(idea, 'shape', {
          state: 'active',
          action: 'Continue shaping',
          note: 'Review the updated idea',
        });
        setIdeaStage(idea, 'investigate', {
          state: 'locked',
          action: 'Locked',
          note: 'Review the idea first',
        });
      }

      storeAccess.write(store);
      return clone(shape);
    },

    async addInvestigationQuestion(ideaId, question) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.openQuestions.includes(question)) return;
      shape.openQuestions.push(question);
      shape.readiness = `${shape.openQuestions.length} research question${shape.openQuestions.length === 1 ? '' : 's'} saved`;
      storeAccess.write(store);
    },

    async updateSummaryField(ideaId, field) {
      const store = storeAccess.read();
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      if (!shape || shape.lifecycle !== 'shaping') return null;
      const fieldIndex = shape.summary.findIndex((entry) => entry.label === field.label);
      if (fieldIndex >= 0) shape.summary.splice(fieldIndex, 1, field);
      else shape.summary.push(field);
      storeAccess.write(store);
      return clone(shape);
    },

    async startInvestigation(ideaId) {
      const store = storeAccess.read();
      const existing = store.jobs.find(
        (job) => job.ideaId === ideaId && job.kind === 'investigation',
      );
      const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
      const idea = store.ideas.find((entry) => entry.id === ideaId);

      if (!shape || !idea) {
        throw new ProductServiceError('IDEA_NOT_FOUND', 'This Idea could not be found.');
      }

      if (existing) {
        return {
          session: clone(shape),
          job: clone(existing),
          creditBalance: clone(store.creditBalance),
        };
      }

      if (shape.lifecycle !== 'review_paused' || !shape.acceptedSummary) {
        throw new ProductServiceError(
          'INVALID_SHAPE_STATE',
          'Accept the current summary before starting Investigation.',
        );
      }

      if (store.creditBalance.available < PROTOTYPE_INVESTIGATION_CREDITS) {
        throw new ProductServiceError(
          'INSUFFICIENT_CREDITS',
          'Add credits before starting this Investigation.',
        );
      }

      const job = jobSchema.parse({
        id: `job-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
        ideaId,
        kind: 'investigation',
        state: 'queued',
        phaseLabel: 'Preparing the research plan',
        reservedCredits: PROTOTYPE_INVESTIGATION_CREDITS,
        creditsReleased: false,
      });

      shape.lifecycle = 'frozen';
      shape.readiness = 'Idea frozen';
      store.creditBalance.available -= PROTOTYPE_INVESTIGATION_CREDITS;
      store.creditBalance.reserved += PROTOTYPE_INVESTIGATION_CREDITS;
      store.jobs.push(job);
      idea.notice = 'Research in progress';
      idea.updated = 'Updated just now';
      setIdeaStage(idea, 'shape', {
        state: 'complete',
        action: 'View transcript',
        note: 'Idea frozen',
      });
      setIdeaStage(idea, 'investigate', {
        state: 'running',
        action: 'View progress',
        note: 'Preparing the research plan',
      });

      storeAccess.write(store);
      return {
        session: clone(shape),
        job: clone(job),
        creditBalance: clone(store.creditBalance),
      };
    },

    async retryInvestigation(ideaId) {
      const store = storeAccess.read();
      const job = store.jobs.find(
        (entry) => entry.ideaId === ideaId && entry.kind === 'investigation',
      );
      const idea = store.ideas.find((entry) => entry.id === ideaId);

      if (!job || !idea) {
        throw new ProductServiceError('IDEA_NOT_FOUND', 'This Investigation could not be found.');
      }

      if (job.state !== 'failed') {
        return { job: clone(job), creditBalance: clone(store.creditBalance) };
      }

      if (store.creditBalance.available < job.reservedCredits) {
        throw new ProductServiceError(
          'INSUFFICIENT_CREDITS',
          'Add credits before retrying this Investigation.',
        );
      }

      job.state = 'queued';
      job.phaseLabel = 'Preparing the research plan';
      job.creditsReleased = false;
      store.creditBalance.available -= job.reservedCredits;
      store.creditBalance.reserved += job.reservedCredits;
      idea.notice = 'Research in progress';
      idea.updated = 'Updated just now';
      setIdeaStage(idea, 'investigate', {
        state: 'running',
        action: 'View progress',
        note: 'Preparing the research plan',
      });
      storeAccess.write(store);

      return { job: clone(job), creditBalance: clone(store.creditBalance) };
    },

    async getCreditBalance() {
      return clone(storeAccess.read().creditBalance);
    },

    async getJob(ideaId, kind) {
      return clone(
        storeAccess.read().jobs.find((job) => job.ideaId === ideaId && job.kind === kind) ?? null,
      );
    },

    async getReport() {
      return null;
    },

    async getRoadmap() {
      return null;
    },
  };
}

export function createMemoryProductService(options?: { responder?: MockShapeResponder }) {
  let store = initialStore();
  const memoryStore: StoreAccess = {
    read: () => clone(store),
    write: (nextStore) => {
      store = clone(prototypeStoreSchema.parse(nextStore));
    },
  };
  return createService(memoryStore, options?.responder ?? createMockShapeReply);
}

export const mockProductService = createService(browserStore, createMockShapeReply);
