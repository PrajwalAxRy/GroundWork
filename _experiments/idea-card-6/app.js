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

let ideas = structuredClone(initialIdeas)
const app = document.querySelector('#app')

const statusIcon = (state) => {
  if (state === 'locked') return icons.lock
  if (state === 'complete') return icons.check
  if (state === 'running') return icons.spinner
  if (state === 'failed') return icons.warning
  return icons.arrow
}

function stageMarker(stage, index) {
  if (stage.state === 'complete') return icons.check
  if (stage.state === 'locked') return icons.lock
  if (stage.state === 'running') return icons.spinner
  if (stage.state === 'failed') return icons.warning
  return index + 1
}

function secondaryStageMarkup(stage, index) {
  const disabled = stage.state === 'locked'
  return `
    <button type="button" class="card-stage card-stage--${stage.state}" ${disabled ? 'disabled' : ''} data-stage="${stage.key}" aria-label="${stage.action}: ${stage.label}">
      <span class="card-stage__marker" aria-hidden="true">${stageMarker(stage, index)}</span>
      <span><strong>${stage.label}</strong><small>${stage.action}</small></span>
    </button>`
}

function primaryStage(idea) {
  const priority = ['unread', 'running', 'failed', 'ready', 'active', 'available']
  return priority.map(state => idea.stages.find(stage => stage.state === state)).find(Boolean) || idea.stages[0]
}

function cardMarkup(idea) {
  const focus = primaryStage(idea)
  const signal = idea.notice || (focus.state === 'active' ? 'Shape in progress' : focus.note)
  return `
    <article class="idea-card idea-card--${focus.state}" data-id="${idea.id}">
      <div class="idea-card__signal" aria-hidden="true"></div>
      <div class="idea-card__body">
        <p class="notice"><span aria-hidden="true"></span>${signal}</p>
        <h2>${idea.title}</h2>
        <p class="brief">${idea.brief}</p>
      </div>
      <div class="idea-card__history" aria-label="Other idea stages">
        ${idea.stages.filter(stage => stage !== focus).map(stage => secondaryStageMarkup(stage, idea.stages.indexOf(stage))).join('')}
      </div>
      <button type="button" class="idea-card__focus idea-card__focus--${focus.state}" data-stage="${focus.key}">
        <span>${focus.note}</span><strong>${focus.action}</strong>${statusIcon(focus.state)}
      </button>
      <div class="card-menu-wrap">
        <button class="icon-button menu-trigger" aria-label="More actions for ${idea.title}" aria-expanded="false">${icons.more}</button>
        <div class="card-menu" hidden>
          <button data-action="rename">Rename</button>
          <button data-action="delete" class="danger">Delete idea</button>
        </div>
      </div>
    </article>`
}

function render() {
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#" aria-label="Groundwork, Your ideas">${icons.mark}<span>Groundwork</span></a>
      <nav aria-label="Account">
        <button class="credits">${icons.credit}<span><strong>18</strong> credits</span></button>
        <button class="profile" aria-label="Open profile menu">${icons.profile}</button>
      </nav>
    </header>
    <main>
      <section class="page-heading">
        <div>
          <p class="kicker">Your working set</p>
          <h1>Your ideas</h1>
          <p class="intro">Pick up where you left off, or give a new thought room to become specific.</p>
        </div>
        <button class="primary" id="new-idea">New idea <span aria-hidden="true">＋</span></button>
      </section>
      <section class="composer" id="composer" hidden aria-labelledby="composer-title">
        <div>
          <h2 id="composer-title">What are you thinking about building?</h2>
          <p>A sentence or a rough problem is enough to begin.</p>
        </div>
        <textarea id="idea-input" rows="3" placeholder="I keep noticing that…"></textarea>
        <div class="composer__actions">
          <button class="text-button" id="cancel-composer">Cancel</button>
          <button class="primary" id="start-shaping" disabled>Start shaping</button>
        </div>
      </section>
      <div class="list-heading"><p>${ideas.length} ideas</p><span>Most recently updated</span></div>
      <section class="idea-list" aria-label="Your ideas">
        ${ideas.map(cardMarkup).join('')}
      </section>
    </main>
    <div class="toast" role="status" aria-live="polite" hidden></div>
    <dialog id="delete-dialog">
      <form method="dialog">
        <p class="dialog-label">Delete idea</p>
        <h2>This removes the whole working record.</h2>
        <p>The Shape conversation, investigation report, and roadmap for this idea will all be removed.</p>
        <div class="dialog-actions">
          <button value="cancel" class="text-button">Keep idea</button>
          <button value="confirm" class="delete-button">Delete idea</button>
        </div>
      </form>
    </dialog>`
  bindEvents()
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.hidden = false
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => { toast.hidden = true }, 2600)
}

function bindEvents() {
  const composer = document.querySelector('#composer')
  const input = document.querySelector('#idea-input')
  const start = document.querySelector('#start-shaping')
  document.querySelector('#new-idea').addEventListener('click', () => {
    composer.hidden = false
    composer.scrollIntoView({ behavior: 'smooth', block: 'center' })
    input.focus()
  })
  document.querySelector('#cancel-composer').addEventListener('click', () => { composer.hidden = true; input.value = '' })
  input.addEventListener('input', () => { start.disabled = input.value.trim().length === 0 })
  start.addEventListener('click', () => showToast('Your idea is ready to shape.'))

  document.querySelectorAll('.menu-trigger').forEach(button => button.addEventListener('click', (event) => {
    event.stopPropagation()
    const menu = button.nextElementSibling
    document.querySelectorAll('.card-menu').forEach(other => { if (other !== menu) other.hidden = true })
    menu.hidden = !menu.hidden
    button.setAttribute('aria-expanded', String(!menu.hidden))
  }))

  document.querySelectorAll('[data-action="rename"]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.idea-card')
    const heading = card.querySelector('h2')
    heading.contentEditable = 'true'
    heading.focus()
    const range = document.createRange(); range.selectNodeContents(heading)
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range)
    button.closest('.card-menu').hidden = true
    heading.addEventListener('blur', () => { heading.contentEditable = 'false'; showToast('Idea renamed.') }, { once: true })
  }))

  let pendingDelete = null
  const dialog = document.querySelector('#delete-dialog')
  document.querySelectorAll('[data-action="delete"]').forEach(button => button.addEventListener('click', () => {
    pendingDelete = button.closest('.idea-card').dataset.id
    button.closest('.card-menu').hidden = true
    dialog.showModal()
  }))
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm' && pendingDelete) {
      ideas = ideas.filter(idea => idea.id !== pendingDelete)
      render()
      showToast('Idea deleted from this prototype.')
    }
    pendingDelete = null
  })
  document.querySelectorAll('[data-stage]:not(:disabled)').forEach(button => button.addEventListener('click', () => {
    showToast(`${button.textContent.trim()} selected.`)
  }))
  document.addEventListener('click', () => document.querySelectorAll('.card-menu').forEach(menu => { menu.hidden = true }), { once: true })
}

render()
