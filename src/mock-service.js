import { ideas as initialIdeas } from './data.js'
import { shapeSessions as initialShapeSessions } from './shape-data.js'

const storageKey = 'groundwork-prototype-state-v2'

function clone(value) {
  return structuredClone(value)
}

function initialStore() {
  return {
    ideas: clone(initialIdeas),
    shapes: clone(initialShapeSessions),
    drafts: {},
  }
}

function readStore() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return initialStore()
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed.ideas) || !Array.isArray(parsed.shapes)) return initialStore()
    return { ideas: parsed.ideas, shapes: parsed.shapes, drafts: parsed.drafts || {} }
  } catch {
    return initialStore()
  }
}

function writeStore(store) {
  window.localStorage.setItem(storageKey, JSON.stringify(store))
}

function genericShape(idea) {
  const frozen = idea.stages.some((stage) => stage.key === 'shape' && stage.state === 'complete')
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
      { label: 'Primary uncertainty', value: 'Which assumption should be tested first.', provenance: 'suggested' },
    ],
    messages: [
      { id: `${idea.id}-1`, role: 'user', body: idea.brief },
      { id: `${idea.id}-2`, role: 'assistant', body: frozen ? 'This conversation is now read-only because Investigation has begun.' : 'There is a useful starting point here, but the customer and the painful moment are still broad. Who experiences this problem often enough to actively look for a solution?' },
    ],
    openQuestions: [],
  }
}

function titleFromThought(thought) {
  const clean = thought.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '')
  if (clean.length <= 58) return clean
  return `${clean.slice(0, 55).trim()}…`
}

function briefFromThought(thought) {
  const clean = thought.replace(/\s+/g, ' ').trim()
  return clean.length <= 170 ? clean : `${clean.slice(0, 167).trim()}…`
}

export const prototypeService = {
  listIdeas() {
    return clone(readStore().ideas)
  },

  getIdea(ideaId) {
    return clone(readStore().ideas.find((idea) => idea.id === ideaId) || null)
  },

  getShape(ideaId) {
    const store = readStore()
    const idea = store.ideas.find((entry) => entry.id === ideaId)
    if (!idea) return null
    let shape = store.shapes.find((entry) => entry.ideaId === ideaId)
    if (!shape) {
      shape = genericShape(idea)
      store.shapes.push(shape)
      writeStore(store)
    }
    return clone(shape)
  },

  createIdea(thought) {
    const store = readStore()
    const ideaId = 'idea-draft'
    store.ideas = store.ideas.filter((idea) => idea.id !== ideaId)
    store.shapes = store.shapes.filter((shape) => shape.ideaId !== ideaId)
    const idea = {
      id: ideaId,
      title: titleFromThought(thought),
      brief: briefFromThought(thought),
      updated: 'Updated just now',
      stages: [
        { key: 'shape', label: 'Shape', state: 'active', action: 'Continue shaping', note: 'Clarify the customer and problem' },
        { key: 'investigate', label: 'Investigate', state: 'locked', action: 'Locked', note: 'Review the idea first' },
        { key: 'roadmap', label: 'Roadmap', state: 'locked', action: 'Locked', note: 'Complete investigation' },
      ],
    }
    const shape = {
      ideaId,
      frozen: false,
      readiness: 'Still taking shape',
      summary: [
        { label: 'Idea', value: briefFromThought(thought), provenance: 'confirmed' },
        { label: 'Target user', value: 'Not clear yet', provenance: 'unknown' },
        { label: 'Problem', value: 'Not clear yet', provenance: 'unknown' },
        { label: 'Proposed solution', value: 'Not clear yet', provenance: 'unknown' },
        { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
        { label: 'Primary uncertainty', value: 'Who feels this problem most sharply.', provenance: 'suggested' },
      ],
      messages: [
        { id: `${ideaId}-1`, role: 'user', body: thought },
        { id: `${ideaId}-2`, role: 'assistant', body: 'There is enough here to begin, but the idea will become much stronger once the painful moment is concrete. Who experiences this problem most often, and what are they doing when it happens?' },
      ],
      openQuestions: [],
    }
    store.ideas.unshift(idea)
    store.shapes.push(shape)
    store.drafts[ideaId] = ''
    writeStore(store)
    return clone(idea)
  },

  renameIdea(ideaId, title) {
    const store = readStore()
    const idea = store.ideas.find((entry) => entry.id === ideaId)
    if (idea) idea.title = title
    writeStore(store)
  },

  deleteIdea(ideaId) {
    const store = readStore()
    store.ideas = store.ideas.filter((idea) => idea.id !== ideaId)
    store.shapes = store.shapes.filter((shape) => shape.ideaId !== ideaId)
    delete store.drafts[ideaId]
    writeStore(store)
  },

  saveDraft(ideaId, draft) {
    const store = readStore()
    store.drafts[ideaId] = draft
    writeStore(store)
  },

  getDraft(ideaId) {
    return readStore().drafts[ideaId] || ''
  },

  appendMessage(ideaId, message) {
    const store = readStore()
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId)
    if (!shape || shape.frozen) return null
    shape.messages.push(message)
    store.drafts[ideaId] = ''
    const idea = store.ideas.find((entry) => entry.id === ideaId)
    if (idea) idea.updated = 'Updated just now'
    writeStore(store)
    return clone(shape)
  },

  replaceFailedMessage(ideaId, message) {
    const store = readStore()
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId)
    if (!shape || shape.frozen) return null
    const failedIndex = shape.messages.findIndex((entry) => entry.failed)
    if (failedIndex >= 0) shape.messages.splice(failedIndex, 1, message)
    else shape.messages.push(message)
    writeStore(store)
    return clone(shape)
  },

  addResearchQuestion(ideaId, question) {
    const store = readStore()
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId)
    if (!shape || shape.openQuestions.includes(question)) return
    shape.openQuestions.push(question)
    shape.readiness = `${shape.openQuestions.length} research question${shape.openQuestions.length === 1 ? '' : 's'} saved`
    writeStore(store)
  },

  updateSummaryField(ideaId, field) {
    const store = readStore()
    const shape = store.shapes.find((entry) => entry.ideaId === ideaId)
    if (!shape || shape.frozen) return null
    const fieldIndex = shape.summary.findIndex((entry) => entry.label === field.label)
    if (fieldIndex >= 0) shape.summary.splice(fieldIndex, 1, field)
    else shape.summary.push(field)
    writeStore(store)
    return clone(shape)
  },
}
