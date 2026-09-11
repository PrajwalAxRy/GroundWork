import { getIdeas } from './data.js'

const list = document.querySelector('#ideas-list')
const pageState = document.querySelector('#page-state')
const ideaSummary = document.querySelector('#idea-summary')
const newIdeaButton = document.querySelector('#new-idea-button')
const newIdeaPanel = document.querySelector('#new-idea-panel')
const newIdeaForm = document.querySelector('#new-idea-form')
const ideaInput = document.querySelector('#idea-input')
const inputError = document.querySelector('#idea-input-error')
const cancelIdeaButton = document.querySelector('#cancel-idea-button')
const viewState = document.querySelector('#view-state')
const toast = document.querySelector('#toast')

let ideas = []
let toastTimer

const icons = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>',
  active: '<span class="state-dot" aria-hidden="true"></span>',
  ready: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3"/></svg>',
  warning: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 17h.01" /></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>',
}

const stageCopy = {
  shape: {
    editable: { label: 'Shape', status: 'In progress', action: 'Continue shaping', tone: 'active', icon: 'active' },
    review: { label: 'Shape', status: 'Ready to review', action: 'Review idea', tone: 'active', icon: 'active' },
    frozen: { label: 'Shape', status: 'Brief confirmed', action: 'View transcript', tone: 'complete', icon: 'check' },
  },
  investigation: {
    locked: { label: 'Investigate', status: 'Review your idea first', action: 'Locked', tone: 'locked', icon: 'lock', disabled: true },
    available: { label: 'Investigate', status: 'Ready to begin', action: 'Start investigation', tone: 'available', icon: 'plus' },
    running: { label: 'Investigate', status: 'Checking claims and sources', action: 'View research progress', tone: 'running', icon: 'active' },
    ready: { label: 'Investigate', status: 'New report', action: 'Read report', tone: 'ready', icon: 'ready' },
    complete: { label: 'Investigate', status: 'Report complete', action: 'Open investigation', tone: 'complete', icon: 'check' },
    failed: { label: 'Investigate', status: 'Credits restored', action: 'Retry research', tone: 'failed', icon: 'warning' },
  },
  roadmap: {
    locked: { label: 'Roadmap', status: 'Complete research first', action: 'Locked', tone: 'locked', icon: 'lock', disabled: true },
    available: { label: 'Roadmap', status: 'Available next', action: 'Build roadmap', tone: 'available', icon: 'plus' },
    running: { label: 'Roadmap', status: 'Building your path', action: 'View roadmap progress', tone: 'running', icon: 'active' },
    complete: { label: 'Roadmap', status: 'Roadmap complete', action: 'Open roadmap', tone: 'complete', icon: 'check' },
    failed: { label: 'Roadmap', status: 'Generation stopped', action: 'View what happened', tone: 'failed', icon: 'warning' },
  },
}

function renderStage(kind, state, index, ideaId) {
  const copy = stageCopy[kind][state]
  return `
    <li class="stage stage--${copy.tone}">
      <span class="stage__number">${index}</span>
      <span class="stage__state-icon stage__state-icon--${copy.tone}">${icons[copy.icon]}</span>
      <div class="stage__copy">
        <span class="stage__label">${copy.label}</span>
        <span class="stage__status">${copy.status}</span>
      </div>
      <button
        class="stage__action"
        type="button"
        data-idea="${ideaId}"
        data-stage="${kind}"
        ${copy.disabled ? 'disabled aria-disabled="true"' : ''}
      >${copy.action}</button>
    </li>
  `
}

function renderVerdict(verdict) {
  if (!verdict) return ''
  return `
    <div class="verdict" aria-label="Investigation verdict">
      <span class="verdict__mark">Finding</span>
      <strong>${verdict.label}</strong>
      <span>${verdict.confidence}</span>
    </div>
  `
}

function renderIdeaCard(idea) {
  const attention = idea.investigation === 'ready' || idea.investigation === 'failed'
  return `
    <article class="idea-card ${attention ? 'idea-card--attention' : ''}" data-card-id="${idea.id}">
      <div class="idea-card__main ${idea.verdict ? '' : 'idea-card__main--without-verdict'}">
        <div class="idea-card__content">
          <div class="title-row">
            <div>
              <h2>${idea.title}</h2>
              <p class="updated">${idea.updated}</p>
            </div>
            <div class="overflow">
              <button class="icon-button overflow__trigger" type="button" aria-label="Actions for ${idea.title}" aria-expanded="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
              <div class="overflow__menu" role="menu" hidden>
                <button type="button" role="menuitem" data-card-action="rename">Rename</button>
                <button type="button" role="menuitem" data-card-action="delete">Delete</button>
              </div>
            </div>
          </div>
          <p class="brief">${idea.brief}</p>
        </div>
        ${renderVerdict(idea.verdict)}
      </div>

      <ol class="stage-rail" aria-label="Idea stages">
        ${renderStage('shape', idea.shape, 1, idea.id)}
        ${renderStage('investigation', idea.investigation, 2, idea.id)}
        ${renderStage('roadmap', idea.roadmap, 3, idea.id)}
      </ol>

      <div class="inline-edit" hidden></div>
    </article>
  `
}

function renderIdeas(nextIdeas = ideas) {
  pageState.hidden = true
  list.hidden = false
  list.innerHTML = nextIdeas.map(renderIdeaCard).join('')
  ideaSummary.textContent = `${nextIdeas.length} ideas, two waiting for your decision.`
}

function renderLoading() {
  pageState.hidden = true
  list.hidden = false
  list.innerHTML = Array.from({ length: 3 }, (_, index) => `
    <article class="idea-card skeleton-card" aria-label="Loading idea ${index + 1}">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line-short"></div>
      <div class="skeleton skeleton--rail"></div>
    </article>
  `).join('')
  ideaSummary.textContent = 'Loading your ideas.'
}

function renderEmpty() {
  list.hidden = true
  pageState.hidden = false
  pageState.innerHTML = `
    <div class="empty-illustration" aria-hidden="true"><span></span><span></span><span></span></div>
    <h2>Start with the thought you keep returning to</h2>
    <p>It can be incomplete. Describe the problem, the person, or the change you want to make.</p>
    <button class="primary-button" type="button" data-empty-action="new">Start your first idea</button>
  `
  ideaSummary.textContent = 'No saved ideas yet.'
}

function renderError() {
  list.hidden = true
  pageState.hidden = false
  pageState.innerHTML = `
    <span class="error-icon">${icons.warning}</span>
    <h2>Your ideas did not load</h2>
    <p>Your work is still saved. Check the connection and try again.</p>
    <button class="secondary-button" type="button" data-empty-action="retry">Try again</button>
  `
  ideaSummary.textContent = 'Ideas are temporarily unavailable.'
}

function openComposer() {
  newIdeaPanel.hidden = false
  newIdeaButton.setAttribute('aria-expanded', 'true')
  newIdeaButton.classList.add('is-active')
  requestAnimationFrame(() => ideaInput.focus())
}

function closeComposer() {
  newIdeaPanel.hidden = true
  newIdeaButton.setAttribute('aria-expanded', 'false')
  newIdeaButton.classList.remove('is-active')
  inputError.hidden = true
  ideaInput.removeAttribute('aria-invalid')
}

function showToast(message) {
  clearTimeout(toastTimer)
  toast.textContent = message
  toast.hidden = false
  toastTimer = setTimeout(() => { toast.hidden = true }, 2800)
}

function closeMenus(except) {
  document.querySelectorAll('.overflow__menu').forEach((menu) => {
    if (menu !== except) menu.hidden = true
  })
  document.querySelectorAll('.overflow__trigger').forEach((trigger) => {
    if (trigger.nextElementSibling !== except) trigger.setAttribute('aria-expanded', 'false')
  })
}

function beginRename(card, idea) {
  const edit = card.querySelector('.inline-edit')
  edit.hidden = false
  edit.innerHTML = `
    <form class="rename-form">
      <label for="rename-${idea.id}">Idea title</label>
      <input id="rename-${idea.id}" value="${idea.title}" />
      <div>
        <button class="secondary-button" type="button" data-inline-cancel>Cancel</button>
        <button class="primary-button" type="submit">Save name</button>
      </div>
    </form>
  `
  edit.querySelector('input').focus()
}

function beginDelete(card, idea) {
  const edit = card.querySelector('.inline-edit')
  edit.hidden = false
  edit.innerHTML = `
    <div class="delete-confirmation" role="alertdialog" aria-labelledby="delete-${idea.id}">
      <div>
        <strong id="delete-${idea.id}">Delete this idea?</strong>
        <p>This removes the Shape conversation, investigation, and roadmap from this prototype.</p>
      </div>
      <div>
        <button class="secondary-button" type="button" data-inline-cancel>Keep idea</button>
        <button class="danger-button" type="button" data-confirm-delete="${idea.id}">Delete idea</button>
      </div>
    </div>
  `
  edit.querySelector('[data-inline-cancel]').focus()
}

newIdeaButton.addEventListener('click', () => {
  if (newIdeaPanel.hidden) openComposer()
  else closeComposer()
})

cancelIdeaButton.addEventListener('click', closeComposer)

document.querySelectorAll('.starter').forEach((button) => {
  button.addEventListener('click', () => {
    ideaInput.value = button.textContent
    ideaInput.focus()
  })
})

newIdeaForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const value = ideaInput.value.trim()
  if (!value) {
    inputError.hidden = false
    ideaInput.setAttribute('aria-invalid', 'true')
    ideaInput.focus()
    return
  }
  inputError.hidden = true
  ideaInput.removeAttribute('aria-invalid')
  showToast('Idea captured. Shape would open with your message already sent.')
  newIdeaForm.reset()
  closeComposer()
})

viewState.addEventListener('change', () => {
  closeComposer()
  if (viewState.value === 'loading') renderLoading()
  else if (viewState.value === 'empty') renderEmpty()
  else if (viewState.value === 'error') renderError()
  else renderIdeas()
})

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.overflow__trigger')
  if (trigger) {
    const menu = trigger.nextElementSibling
    const willOpen = menu.hidden
    closeMenus(menu)
    menu.hidden = !willOpen
    trigger.setAttribute('aria-expanded', String(willOpen))
    if (willOpen) menu.querySelector('button').focus()
    return
  }

  const menuAction = event.target.closest('[data-card-action]')
  if (menuAction) {
    const card = menuAction.closest('.idea-card')
    const idea = ideas.find((item) => item.id === card.dataset.cardId)
    closeMenus()
    if (menuAction.dataset.cardAction === 'rename') beginRename(card, idea)
    else beginDelete(card, idea)
    return
  }

  const cancel = event.target.closest('[data-inline-cancel]')
  if (cancel) {
    const edit = cancel.closest('.inline-edit')
    edit.hidden = true
    edit.innerHTML = ''
    return
  }

  const deleteButton = event.target.closest('[data-confirm-delete]')
  if (deleteButton) {
    ideas = ideas.filter((idea) => idea.id !== deleteButton.dataset.confirmDelete)
    renderIdeas()
    showToast('Idea removed from this prototype.')
    return
  }

  const stageAction = event.target.closest('.stage__action:not(:disabled)')
  if (stageAction) {
    const idea = ideas.find((item) => item.id === stageAction.dataset.idea)
    showToast(`${stageAction.textContent.trim()} for ${idea.title}`)
    return
  }

  const simpleNotice = event.target.closest('[data-notice]')
  if (simpleNotice) {
    showToast(simpleNotice.dataset.notice)
    return
  }

  const stateAction = event.target.closest('[data-empty-action]')
  if (stateAction?.dataset.emptyAction === 'new') openComposer()
  if (stateAction?.dataset.emptyAction === 'retry') {
    renderLoading()
    setTimeout(renderIdeas, 650)
  }

  if (!event.target.closest('.overflow')) closeMenus()
})

document.addEventListener('submit', (event) => {
  if (!event.target.matches('.rename-form')) return
  event.preventDefault()
  const card = event.target.closest('.idea-card')
  const idea = ideas.find((item) => item.id === card.dataset.cardId)
  const nextTitle = event.target.querySelector('input').value.trim()
  if (!nextTitle) return
  idea.title = nextTitle
  renderIdeas()
  showToast('Idea name updated.')
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  closeMenus()
  document.querySelectorAll('.inline-edit').forEach((edit) => { edit.hidden = true })
})

ideas = await getIdeas()
renderIdeas()
