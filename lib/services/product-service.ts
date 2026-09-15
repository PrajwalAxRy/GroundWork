import {
  type CreditBalance,
  type Idea,
  type IdeaBrief,
  type InvestigationReport,
  type ProductJob,
  type Roadmap,
  type ShapeMessage,
  type ShapeSession,
  type SummaryField,
  creditBalanceSchema,
  ideaSchema,
  shapeSessionSchema,
} from '@/lib/contracts/product';
import { ideas as initialIdeas } from '@/lib/fixtures/ideas';
import { shapeSessions as initialShapeSessions } from '@/lib/fixtures/shapes';
import { z } from 'zod';

const storageKey = 'groundwork-product-state-v3';

const prototypeStoreSchema = z.object({
  ideas: z.array(ideaSchema),
  shapes: z.array(shapeSessionSchema),
  drafts: z.record(z.string()),
});

type PrototypeStore = z.infer<typeof prototypeStoreSchema>;

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
  appendShapeMessage(ideaId: string, message: ShapeMessage): Promise<ShapeSession | null>;
  replaceFailedShapeMessage(ideaId: string, message: ShapeMessage): Promise<ShapeSession | null>;
  addInvestigationQuestion(ideaId: string, question: string): Promise<void>;
  updateSummaryField(ideaId: string, field: SummaryField): Promise<ShapeSession | null>;
  getCreditBalance(): Promise<CreditBalance>;
  getJob(ideaId: string, kind: 'investigation' | 'roadmap'): Promise<ProductJob | null>;
  getReport(ideaId: string): Promise<InvestigationReport | null>;
  getRoadmap(ideaId: string): Promise<Roadmap | null>;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function initialStore(): PrototypeStore {
  return {
    ideas: clone(initialIdeas),
    shapes: clone(initialShapeSessions),
    drafts: {},
  };
}

function readStore(): PrototypeStore {
  if (typeof window === 'undefined') return initialStore();
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialStore();
    const parsed = prototypeStoreSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : initialStore();
  } catch {
    return initialStore();
  }
}

function writeStore(store: PrototypeStore): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(prototypeStoreSchema.parse(store)));
}

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

function genericShape(idea: Idea): ShapeSession {
  const frozen = idea.stages.some((stage) => stage.key === 'shape' && stage.state === 'complete');
  return {
    ideaId: idea.id,
    frozen,
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
  };
}

export const mockProductService: ProductService = {
  async listIdeas() {
    return clone(readStore().ideas);
  },

  async getIdea(ideaId) {
    return clone(readStore().ideas.find((idea) => idea.id === ideaId) ?? null);
  },

  async createIdea(thought) {
    const cleanThought = thought.trim();
    if (!cleanThought) throw new Error('An idea needs at least one non-space character.');
    const store = readStore();
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
    const shape: ShapeSession = {
      ideaId: id,
      frozen: false,
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
    };
    store.ideas.unshift(idea);
    store.shapes.push(shape);
    store.drafts[id] = '';
    writeStore(store);
    return clone(idea);
  },

  async renameIdea(ideaId, title) {
    const store = readStore();
    const idea = store.ideas.find((entry) => entry.id === ideaId);
    if (!idea) return null;
    idea.title = title.trim();
    writeStore(store);
    return clone(idea);
  },

  async deleteIdea(ideaId) {
    const store = readStore();
    store.ideas = store.ideas.filter((idea) => idea.id !== ideaId);
    store.shapes = store.shapes.filter((shape) => shape.ideaId !== ideaId);
    delete store.drafts[ideaId];
    writeStore(store);
  },

  async getShape(ideaId) {
    const store = readStore();
    const idea = store.ideas.find((entry) => entry.id === ideaId);
    if (!idea) return null;
    let shape = store.shapes.find((entry) => entry.ideaId === ideaId);
    if (!shape) {
      shape = genericShape(idea);
      store.shapes.push(shape);
      writeStore(store);
    }
    return clone(shape);
  },

  async getBrief(ideaId) {
    const shape = await this.getShape(ideaId);
    if (!shape) return null;
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
      frozen: shape.frozen,
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
    return readStore().drafts[ideaId] ?? '';
  },

  async saveDraft(ideaId, draft) {
    const store = readStore();
    store.drafts[ideaId] = draft;
    writeStore(store);
  },

  async appendShapeMessage(ideaId, message) {
    const store = readStore();
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
    if (!shape || shape.frozen) return null;
    shape.messages.push(message);
    store.drafts[ideaId] = '';
    const idea = store.ideas.find((entry) => entry.id === ideaId);
    if (idea) idea.updated = 'Updated just now';
    writeStore(store);
    return clone(shape);
  },

  async replaceFailedShapeMessage(ideaId, message) {
    const store = readStore();
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
    if (!shape || shape.frozen) return null;
    const failedIndex = shape.messages.findIndex((entry) => entry.failed);
    if (failedIndex >= 0) shape.messages.splice(failedIndex, 1, message);
    else shape.messages.push(message);
    writeStore(store);
    return clone(shape);
  },

  async addInvestigationQuestion(ideaId, question) {
    const store = readStore();
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
    if (!shape || shape.openQuestions.includes(question)) return;
    shape.openQuestions.push(question);
    shape.readiness = `${shape.openQuestions.length} research question${shape.openQuestions.length === 1 ? '' : 's'} saved`;
    writeStore(store);
  },

  async updateSummaryField(ideaId, field) {
    const store = readStore();
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId);
    if (!shape || shape.frozen) return null;
    const fieldIndex = shape.summary.findIndex((entry) => entry.label === field.label);
    if (fieldIndex >= 0) shape.summary.splice(fieldIndex, 1, field);
    else shape.summary.push(field);
    writeStore(store);
    return clone(shape);
  },

  async getCreditBalance() {
    return creditBalanceSchema.parse({ available: 18, reserved: 0 });
  },

  async getJob() {
    return null;
  },

  async getReport() {
    return null;
  },

  async getRoadmap() {
    return null;
  },
};
