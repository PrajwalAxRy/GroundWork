import { prototypeService } from './mock-service.js'
import { escapeHtml, icons, shellMarkup } from './shared.js'

const supportedPreviews = new Set(['populated', 'empty', 'loading', 'error'])

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

function secondaryStageMarkup(stage, index, idea) {
  const disabled = stage.state === 'locked'
  return `<button type="button" class="card-stage card-stage--${stage.state}" ${disabled ? 'disabled aria-disabled="true"' : ''} data-action="stage" data-id="${idea.id}" data-stage-key="${stage.key}" data-label="${escapeHtml(stage.action)}" aria-label="${escapeHtml(stage.action)}: ${escapeHtml(stage.label)} for ${escapeHtml(idea.title)}">
    <span class="card-stage__marker" aria-hidden="true">${stageMarker(stage, index)}</span>
    <span><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.action)}</small></span>
  </button>`
}

export function mountIdeasPage(root, { navigate, isActive }) {
  const requestedPreview = new URLSearchParams(window.location.search).get('state')
  const state = {
    ideas: prototypeService.listIdeas(),
    preview: supportedPreviews.has(requestedPreview) ? requestedPreview : 'populated',
    composer: false,
    profile: false,
    menu: null,
    editing: null,
    deleting: null,
    toast: '',
  }

  document.title = 'Your ideas | Groundwork'

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
        ${idea.stages.filter((stage) => stage !== focus).map((stage) => secondaryStageMarkup(stage, idea.stages.indexOf(stage), idea)).join('')}
      </div>
      <button type="button" class="idea-card__focus idea-card__focus--${focus.state}" data-action="stage" data-id="${idea.id}" data-stage-key="${focus.key}" data-label="${escapeHtml(focus.action)}" aria-label="${escapeHtml(focus.action)}: ${escapeHtml(focus.label)} for ${title}">
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
    return `<section class="error-state" role="alert"><span aria-hidden="true">!</span><div><h2>Your ideas could not load.</h2><p>Your saved ideas have not changed. Try loading them again.</p></div><button class="outline-button" data-action="retry-load">Try again</button></section>`
  }

  function render() {
    const list = state.preview === 'loading'
      ? loading()
      : state.preview === 'empty'
        ? empty()
        : state.preview === 'error'
          ? error()
          : `<div class="list-heading"><p>${state.ideas.length} ideas</p><span>Most recently updated</span></div><section class="idea-list" aria-label="Your ideas">${state.ideas.map(card).join('')}</section>`

    root.innerHTML = `<div class="app-shell">${shellMarkup(state.profile)}<main class="ideas-page"><section class="page-heading"><div><p class="kicker">Your working set</p><h1>Your ideas</h1><p class="intro">Pick up where you left off, or give a new thought room to become specific.</p></div><button class="primary" data-action="new-idea">New idea <span aria-hidden="true">＋</span></button></section>${state.composer ? composer() : ''}${list}</main>${state.toast ? `<div class="toast" role="status" aria-live="polite">${escapeHtml(state.toast)}</div>` : ''}</div>`
  }

  function notify(message) {
    state.toast = message
    render()
    window.setTimeout(() => {
      if (isActive() && state.toast === message) {
        state.toast = ''
        render()
      }
    }, 3000)
  }

  root.onclick = (event) => {
    const link = event.target.closest('[data-link]')
    if (link) {
      event.preventDefault()
      navigate(link.getAttribute('href'))
      return
    }

    const target = event.target.closest('[data-action]')
    if (!target) {
      if (state.menu) {
        state.menu = null
        render()
      }
      return
    }

    const { action, id, label, value, stageKey } = target.dataset
    if (action === 'new-idea') { state.preview = 'populated'; state.composer = true; render(); document.querySelector('#idea-input')?.focus() }
    if (action === 'profile') { state.profile = !state.profile; render() }
    if (action === 'credits') notify('Credits would open general purchase mode')
    if (action === 'profile-settings') notify('Account settings are outside this prototype')
    if (action === 'sign-out') notify('Signed out in a complete product')
    if (action === 'stage' && stageKey === 'shape') navigate(`/ideas/${id}/shape`)
    if (action === 'stage' && stageKey !== 'shape') notify(`${label} opens in a later prototype phase`)
    if (action === 'menu') { state.menu = state.menu === id ? null : id; render() }
    if (action === 'rename') { state.editing = id; state.menu = null; render(); document.querySelector(`#rename-${id}`)?.focus() }
    if (action === 'cancel-rename') { state.editing = null; render() }
    if (action === 'ask-delete') { state.deleting = id; state.menu = null; render() }
    if (action === 'keep-idea') { state.deleting = null; render() }
    if (action === 'delete-idea') {
      prototypeService.deleteIdea(id)
      state.ideas = prototypeService.listIdeas()
      state.deleting = null
      notify('Idea removed from this prototype')
    }
    if (action === 'cancel-composer') { state.composer = false; render() }
    if (action === 'empty-start') { state.preview = 'populated'; state.composer = true; render(); document.querySelector('#idea-input')?.focus() }
    if (action === 'retry-load') { state.preview = 'populated'; state.ideas = prototypeService.listIdeas(); render() }
    if (action === 'starter') { const input = document.querySelector('#idea-input'); input.value = value; input.focus() }
  }

  root.onsubmit = (event) => {
    event.preventDefault()
    const form = event.target
    if (form.dataset.form === 'composer') {
      const thought = new FormData(form).get('idea').trim()
      if (thought) {
        const idea = prototypeService.createIdea(thought)
        navigate(`/ideas/${idea.id}/shape`)
      }
    }
    if (form.dataset.form === 'rename') {
      const title = new FormData(form).get('title').trim()
      if (title) {
        prototypeService.renameIdea(form.dataset.id, title)
        state.ideas = prototypeService.listIdeas()
        state.editing = null
        notify('Dashboard title renamed')
      }
    }
  }

  root.oninput = null
  root.onchange = null
  render()
}
