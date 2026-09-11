const initialIdeas = [
  {
    id: 'cutlery', title: 'Compostable cutlery kits for small events', updated: 'Edited today',
    brief: 'Branded, compostable cutlery kits for independent event organisers and caterers who need a simpler way to meet sustainability expectations.',
    stages: [['shape', 'active', 'Continue shaping'], ['investigate', 'locked', 'Investigation locked', 'Review your idea first'], ['roadmap', 'locked', 'Roadmap locked', 'Complete investigation first']],
  },
  {
    id: 'clinic', title: 'Aftercare check-ins for independent clinics', updated: 'Edited yesterday',
    brief: 'A lightweight patient follow-up service for clinics that want to surface post-treatment concerns before they become support calls.',
    stages: [['shape', 'active', 'Review idea', 'Brief ready'], ['investigate', 'locked', 'Investigation locked', 'Confirm the brief first'], ['roadmap', 'locked', 'Roadmap locked', 'Complete investigation first']],
  },
  {
    id: 'procurement', title: 'Procurement brief builder for local councils', updated: 'Researching now',
    brief: 'A guided tool for turning repeat purchasing needs into more consistent supplier briefs for small local-government teams.',
    stages: [['shape', 'complete', 'View shaped idea'], ['investigate', 'running', 'View research progress', 'Mapping alternatives'], ['roadmap', 'locked', 'Roadmap locked', 'Research in progress']],
  },
  {
    id: 'tenancy', title: 'Plain-language tenancy renewal assistant', updated: 'Report ready today',
    brief: 'A renewal companion for independent landlords and tenants navigating practical questions before a tenancy agreement is renewed.',
    verdict: ['Test the critical assumption', 'Moderate confidence'],
    stages: [['shape', 'complete', 'View shaped idea'], ['investigate', 'ready', 'Report ready', 'New research'], ['roadmap', 'available', 'Build roadmap', 'Available after you read the report']],
  },
  {
    id: 'fleet', title: 'Service reminders for independent vehicle fleets', updated: 'Investigation reviewed',
    brief: 'A shared maintenance reminder workflow for small trade fleets that do not have a dedicated operations manager.',
    verdict: ['Refine before pursuing', 'High confidence'],
    stages: [['shape', 'complete', 'View shaped idea'], ['investigate', 'complete', 'Open investigation'], ['roadmap', 'available', 'Build roadmap']],
  },
  {
    id: 'subscription', title: 'Ingredient swaps for local meal subscriptions', updated: 'Roadmap completed',
    brief: 'A service layer for meal-subscription businesses managing late customer changes without creating manual kitchen work.',
    verdict: ['Worth pursuing', 'Moderate confidence'],
    stages: [['shape', 'complete', 'View shaped idea'], ['investigate', 'complete', 'Open investigation'], ['roadmap', 'complete', 'Open roadmap', 'Ready to revisit']],
  },
  {
    id: 'repair', title: 'Repair request triage for housing co-ops', updated: 'Research needs attention',
    brief: 'A request-intake layer for volunteer-run housing co-operatives, designed to make urgent repairs easier to identify and route.',
    stages: [['shape', 'complete', 'View shaped idea'], ['investigate', 'failed', 'Retry research', 'Credits restored'], ['roadmap', 'locked', 'Roadmap locked', 'Research did not complete']],
  },
]

const state = { ideas: structuredClone(initialIdeas), preview: 'populated', composer: false, profile: false, menu: null, editing: null, deleting: null, toast: '' }
const root = document.querySelector('#root')
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]))

function iconFor(status) {
  if (status === 'complete') return '<span class="mark" aria-hidden="true">✓</span>'
  if (status === 'locked') return '<span class="mark" aria-hidden="true">⌁</span>'
  if (status === 'running') return '<span class="progress-dot" aria-label="In progress"></span>'
  if (status === 'ready') return '<span class="mark" aria-hidden="true">✦</span>'
  if (status === 'failed') return '<span class="mark" aria-hidden="true">!</span>'
  if (status === 'available') return '<span class="mark" aria-hidden="true">→</span>'
  return '<span class="mark" aria-hidden="true">↗</span>'
}

function stageControl([stage, status, label, detail]) {
  const disabled = status === 'locked' ? 'disabled aria-disabled="true"' : ''
  return `<button class="stage-control stage-${status}" ${disabled} data-action="stage" data-label="${escapeHtml(label)}">
    ${iconFor(status)}
    <span class="stage-copy"><span>${escapeHtml(label)}</span>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</span>
  </button>`
}

function card(idea) {
  const isEditing = state.editing === idea.id
  const isDeleting = state.deleting === idea.id
  const title = escapeHtml(idea.title)
  const verdict = idea.verdict ? `<div class="verdict" aria-label="Verdict: ${escapeHtml(idea.verdict[0])}, ${escapeHtml(idea.verdict[1])}"><span>Research verdict</span><strong>${escapeHtml(idea.verdict[0])}</strong><em>${escapeHtml(idea.verdict[1])}</em></div>` : ''
  const editor = `<form class="rename-form" data-form="rename" data-id="${idea.id}"><label for="rename-${idea.id}">Idea title</label><div><input id="rename-${idea.id}" name="title" value="${title}" required><button class="quiet-button" type="button" data-action="cancel-rename">Cancel</button><button class="small-solid" type="submit">Save</button></div></form>`
  const menu = state.menu === idea.id ? `<div class="card-menu" role="menu"><button role="menuitem" data-action="rename" data-id="${idea.id}">Rename</button><button role="menuitem" class="menu-danger" data-action="ask-delete" data-id="${idea.id}">Delete</button></div>` : ''
  const confirm = isDeleting ? `<div class="confirm-overlay" role="dialog" aria-modal="true" aria-label="Delete ${title}"><p>This removes the idea, its chat, research report, and roadmap from this prototype.</p><div><button class="quiet-button" data-action="keep-idea">Keep idea</button><button class="delete-button" data-action="delete-idea" data-id="${idea.id}">Delete idea</button></div></div>` : ''
  return `<article class="idea-card">
    <div class="field-rule" aria-hidden="true"><span></span></div>
    <div class="card-main">
      <div class="idea-meta"><span>${escapeHtml(idea.updated)}</span><div class="card-menu-wrap"><button class="icon-button" aria-label="Actions for ${title}" aria-expanded="${state.menu === idea.id}" data-action="menu" data-id="${idea.id}">•••</button>${menu}</div></div>
      ${isEditing ? editor : `<h2>${title}</h2>`}
      <p class="idea-brief">${escapeHtml(idea.brief)}</p>${verdict}
      <div class="stage-controls" aria-label="Stages for ${title}">${idea.stages.map(stageControl).join('')}</div>
    </div>${confirm}
  </article>`
}

function composer() {
  return `<section class="composer" aria-labelledby="composer-title"><div class="composer-head"><p class="section-kicker">Start with a thought, not a plan</p><h2 id="composer-title">What are you thinking about building?</h2><p>A customer, a problem, or a rough solution is enough to begin shaping an idea.</p></div>
    <form data-form="composer"><label class="sr-only" for="idea-input">Your initial idea</label><textarea id="idea-input" name="idea" placeholder="For example: a way for freelance tutors to…" rows="3" required></textarea><div class="composer-actions"><button class="solid-button" type="submit">Start shaping <span aria-hidden="true">↗</span></button><button class="quiet-button" type="button" data-action="cancel-composer">Cancel</button></div></form>
    <div class="idea-starters" aria-label="Idea starters"><span>Try a starting point:</span><button type="button" data-action="starter" data-value="A simple way for independent cafés to reduce food waste at the end of each day.">Independent cafés</button><button type="button" data-action="starter" data-value="A lightweight service that helps landlords manage recurring repairs.">Landlords</button></div>
  </section>`
}

function loading() {
  return `<section class="loading-stack" aria-label="Loading ideas" aria-busy="true">${[1, 2, 3].map(() => '<div class="skeleton-card"><i></i><b></b><span></span><footer></footer></div>').join('')}</section>`
}

function empty() {
  return `<section class="empty-state"><span class="empty-symbol" aria-hidden="true">+</span><h2>Your ideas start as rough notes.</h2><p>Bring a customer problem, a small irritation, or the beginning of a solution. Groundwork will help you make it researchable.</p><button class="solid-button" data-action="empty-start">Start your first idea <span aria-hidden="true">↗</span></button></section>`
}

function error() {
  return `<section class="error-state" role="alert"><span aria-hidden="true">!</span><div><h2>Your ideas could not load.</h2><p>Your saved ideas have not changed. Try loading them again.</p></div><button class="outline-button" data-action="retry">Try again</button></section>`
}

function app() {
  const list = state.preview === 'loading' ? loading() : state.preview === 'empty' ? empty() : state.preview === 'error' ? error() : `<section class="idea-list" aria-label="Your ideas">${state.ideas.map(card).join('')}</section>`
  const profile = state.profile ? '<div class="profile-menu"><strong>Priya Singh</strong><button data-action="profile-settings">Account settings</button><button data-action="sign-out">Sign out</button></div>' : ''
  return `<div class="app-shell"><header class="topbar"><a class="brand" href="/ideas" aria-label="Groundwork, return to your ideas"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>Groundwork</span></a><div class="topbar-actions"><button class="credit-button" data-action="credits" aria-label="15 credits, open credits"><span aria-hidden="true">◇</span><b>15</b><em>credits</em></button><div class="profile-wrap"><button class="profile-button" data-action="profile" aria-expanded="${state.profile}" aria-label="PS, open profile menu"><span>PS</span><i aria-hidden="true">⌄</i></button>${profile}</div></div></header>
  <main><section class="page-intro"><div><p class="section-kicker">Your workspace</p><h1>Your ideas</h1><p class="intro-copy">Give an early idea some shape, then investigate it when the questions are worth paying to answer.</p></div><button class="solid-button" data-action="new-idea">New idea <span aria-hidden="true">+</span></button></section>
  <nav class="preview-switcher" aria-label="Experiment preview state"><span>Experiment state</span>${['populated', 'empty', 'loading', 'error'].map((option) => `<button class="${state.preview === option ? 'selected' : ''}" data-action="preview" data-state="${option}">${option}</button>`).join('')}</nav>${state.composer ? composer() : ''}${list}</main>${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ''}</div>`
}

function render() { root.innerHTML = app() }
function notify(message) { state.toast = message; render(); window.setTimeout(() => { if (state.toast === message) { state.toast = ''; render() } }, 3300) }

root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]')
  if (!target) return
  const { action, id, label, state: nextState, value } = target.dataset
  if (action === 'new-idea') { state.preview = 'populated'; state.composer = true; render() }
  if (action === 'preview') { state.preview = nextState; state.composer = false; render() }
  if (action === 'profile') { state.profile = !state.profile; render() }
  if (action === 'credits') notify('Credits would open general purchase mode')
  if (action === 'profile-settings') notify('Account settings are outside this prototype')
  if (action === 'sign-out') notify('Signed out in a complete product')
  if (action === 'stage') notify(`${label} would open this stage in the full prototype`)
  if (action === 'menu') { state.menu = state.menu === id ? null : id; render() }
  if (action === 'rename') { state.editing = id; state.menu = null; render(); document.querySelector(`#rename-${id}`)?.focus() }
  if (action === 'cancel-rename') { state.editing = null; render() }
  if (action === 'ask-delete') { state.deleting = id; state.menu = null; render() }
  if (action === 'keep-idea') { state.deleting = null; render() }
  if (action === 'delete-idea') { state.ideas = state.ideas.filter((idea) => idea.id !== id); state.deleting = null; notify('Idea removed from this prototype') }
  if (action === 'cancel-composer') { state.composer = false; render() }
  if (action === 'empty-start') { state.preview = 'populated'; state.composer = true; render() }
  if (action === 'retry') { state.preview = 'populated'; render() }
  if (action === 'starter') { const input = document.querySelector('#idea-input'); input.value = value; input.focus() }
})

root.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = event.target
  if (form.dataset.form === 'composer') {
    const draft = new FormData(form).get('idea').trim()
    if (draft) { state.composer = false; notify(`“${draft.slice(0, 38)}${draft.length > 38 ? '…' : ''}” is ready to shape`) }
  }
  if (form.dataset.form === 'rename') {
    const title = new FormData(form).get('title').trim()
    if (title) { state.ideas = state.ideas.map((idea) => idea.id === form.dataset.id ? { ...idea, title } : idea); state.editing = null; notify('Dashboard title renamed') }
  }
})

render()
