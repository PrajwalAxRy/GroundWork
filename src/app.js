import { ideas as initialIdeas } from './data.js'

const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 25 16 6l10 19h-5l-5-10-5 10H6Z"/><path d="M11 25h10"/></svg>`,
  credit: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6.5 19c.8-3 2.6-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="9" rx="2"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>`,
  spinner: `<svg class="spinner" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 3.8 19h16.4L12 4Z"/><path d="M12 9v4M12 16.5v.1"/></svg>`,
}

const supportedPreviews = new Set(['populated', 'empty', 'loading', 'error'])
const requestedPreview = new URLSearchParams(window.location.search).get('state')
const state = {
  ideas: structuredClone(initialIdeas),
  preview: supportedPreviews.has(requestedPreview) ? requestedPreview : 'populated',
  composer: false,
  profile: false,
  menu: null,
  editing: null,
  deleting: null,
  toast: '',
}

const root = document.querySelector('#root')
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]))

function statusIcon(status) {
  if (status === 'locked') return icons.lock
  if (status === 'complete') return icons.check
  if (status === 'running') return icons.spinner
  if (status === 'failed') return icons.warning
  return icons.arrow
}

function stageMarker(stage, index) {
  if (stage.state === 'complete') return icons.check
  if (stage.state === 'locked') return icons.lock
  if (stage.state === 'running') return icons.spinner
  if (stage.state === 'failed') return icons.warning
  return index + 1
}

function primaryStage(idea) {
  const priority = ['unread', 'running', 'failed', 'ready', 'active', 'available']
  return priority.map((status) => idea.stages.find((stage) => stage.state === status)).find(Boolean) || idea.stages.at(-1)
}

function secondaryStageMarkup(stage, index, title) {
  const disabled = stage.state === 'locked'
  return `<button type="button" class="card-stage card-stage--${stage.state}" ${disabled ? 'disabled aria-disabled="true"' : ''} data-action="stage" data-label="${escapeHtml(stage.action)}" aria-label="${escapeHtml(stage.action)}: ${escapeHtml(stage.label)} for ${title}">
    <span class="card-stage__marker" aria-hidden="true">${stageMarker(stage, index)}</span>
    <span><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.action)}</small></span>
  </button>`
}

function card(idea) {
  const focus = primaryStage(idea)
  const isEditing = state.editing === idea.id
  const isDeleting = state.deleting === idea.id
  const title = escapeHtml(idea.title)
  const signal = escapeHtml(idea.notice || (focus.state === 'active' ? 'Shape in progress' : focus.note || focus.action))
  const editor = `<form class="rename-form" data-form="rename" data-id="${idea.id}"><label for="rename-${idea.id}">Idea title</label><div><input id="rename-${idea.id}" name="title" value="${title}" required><button class="text-button" type="button" data-action="cancel-rename">Cancel</button><button class="small-primary" type="submit">Save</button></div></form>`
  const menu = state.menu === idea.id ? `<div class="card-menu" role="menu"><button role="menuitem" data-action="rename" data-id="${idea.id}">Rename</button><button role="menuitem" class="danger" data-action="ask-delete" data-id="${idea.id}">Delete idea</button></div>` : ''
  const confirm = isDeleting ? `<div class="confirm-overlay" role="dialog" aria-modal="true" aria-label="Delete ${title}"><p><strong>Delete this idea?</strong> This removes its Shape conversation, investigation report, and roadmap from this prototype.</p><div><button class="text-button" data-action="keep-idea">Keep idea</button><button class="delete-button" data-action="delete-idea" data-id="${idea.id}">Delete idea</button></div></div>` : ''

  return `<article class="idea-card idea-card--${focus.state}" data-id="${idea.id}">
    <div class="idea-card__signal" aria-hidden="true"></div>
    <div class="idea-card__body">
      <p class="notice"><span aria-hidden="true"></span>${signal}</p>
      ${isEditing ? editor : `<h2>${title}</h2>`}
      <p class="brief">${escapeHtml(idea.brief)}</p>
    </div>
    <div class="idea-card__history" aria-label="Other stages for ${title}">
      ${idea.stages.filter((stage) => stage !== focus).map((stage) => secondaryStageMarkup(stage, idea.stages.indexOf(stage), title)).join('')}
    </div>
    <button type="button" class="idea-card__focus idea-card__focus--${focus.state}" data-action="stage" data-label="${escapeHtml(focus.action)}" aria-label="${escapeHtml(focus.action)}: ${escapeHtml(focus.label)} for ${title}">
      <span>${escapeHtml(focus.note || focus.label)}</span><strong>${escapeHtml(focus.action)}</strong>${statusIcon(focus.state)}
    </button>
    <div class="card-menu-wrap">
      <button class="icon-button" aria-label="More actions for ${title}" aria-expanded="${state.menu === idea.id}" data-action="menu" data-id="${idea.id}">${icons.more}</button>${menu}
    </div>${confirm}
  </article>`
}

function composer() {
  return `<section class="composer" aria-labelledby="composer-title"><div><h2 id="composer-title">What are you thinking about building?</h2><p>A sentence or a rough problem is enough to begin.</p></div><form data-form="composer"><label class="sr-only" for="idea-input">Your initial idea</label><textarea id="idea-input" name="idea" rows="3" placeholder="I keep noticing that…" required></textarea><div class="composer__actions"><button class="text-button" type="button" data-action="cancel-composer">Cancel</button><button class="primary" type="submit">Start shaping</button></div></form><div class="idea-starters" aria-label="Idea starters"><span>Try a starting point:</span><button type="button" data-action="starter" data-value="A simple way for independent cafés to reduce food waste at the end of each day.">Independent cafés</button><button type="button" data-action="starter" data-value="A lightweight service that helps landlords manage recurring repairs.">Landlords</button></div></section>`
}

function loading() {
  return `<section class="loading-stack" aria-label="Loading ideas" aria-busy="true">${[1, 2, 3].map(() => '<div class="skeleton-card"><i></i><b></b><span></span><footer></footer></div>').join('')}</section>`
}

function empty() {
  return `<section class="empty-state"><span class="empty-symbol" aria-hidden="true">+</span><h2>Your ideas start as rough notes.</h2><p>Bring a customer problem, a small irritation, or the beginning of a solution. Groundwork will help you make it researchable.</p><button class="primary" data-action="empty-start">Start your first idea</button></section>`
}

function error() {
  return `<section class="error-state" role="alert"><span aria-hidden="true">!</span><div><h2>Your ideas could not load.</h2><p>Your saved ideas have not changed. Try loading them again.</p></div><button class="outline-button" data-action="retry">Try again</button></section>`
}

function appMarkup() {
  const list = state.preview === 'loading' ? loading() : state.preview === 'empty' ? empty() : state.preview === 'error' ? error() : `<div class="list-heading"><p>${state.ideas.length} ideas</p><span>Most recently updated</span></div><section class="idea-list" aria-label="Your ideas">${state.ideas.map(card).join('')}</section>`
  const profile = state.profile ? '<div class="profile-menu"><strong>Priya Singh</strong><button data-action="profile-settings">Account settings</button><button data-action="sign-out">Sign out</button></div>' : ''
  return `<div class="app-shell"><header class="topbar"><a class="brand" href="/ideas" aria-label="Groundwork, return to your ideas">${icons.mark}<span>Groundwork</span></a><nav aria-label="Account"><button class="credits" data-action="credits" aria-label="18 credits, open credits">${icons.credit}<span><strong>18</strong> credits</span></button><div class="profile-wrap"><button class="profile" data-action="profile" aria-expanded="${state.profile}" aria-label="Open profile menu">${icons.profile}</button>${profile}</div></nav></header><main><section class="page-heading"><div><p class="kicker">Your working set</p><h1>Your ideas</h1><p class="intro">Pick up where you left off, or give a new thought room to become specific.</p></div><button class="primary" data-action="new-idea">New idea <span aria-hidden="true">＋</span></button></section>${state.composer ? composer() : ''}${list}</main>${state.toast ? `<div class="toast" role="status" aria-live="polite">${escapeHtml(state.toast)}</div>` : ''}</div>`
}

function render() {
  root.innerHTML = appMarkup()
}

function notify(message) {
  state.toast = message
  render()
  window.setTimeout(() => {
    if (state.toast === message) {
      state.toast = ''
      render()
    }
  }, 3000)
}

root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]')
  if (!target) {
    if (state.menu) {
      state.menu = null
      render()
    }
    return
  }

  const { action, id, label, value } = target.dataset
  if (action === 'new-idea') { state.preview = 'populated'; state.composer = true; render(); document.querySelector('#idea-input')?.focus() }
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
  if (action === 'empty-start') { state.preview = 'populated'; state.composer = true; render(); document.querySelector('#idea-input')?.focus() }
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
