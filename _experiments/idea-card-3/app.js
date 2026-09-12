import { getIdeasDashboard } from './data.js'

const ideasContent = document.querySelector('#ideas-content')
const ideasCount = document.querySelector('#ideas-count')
const creditBalance = document.querySelector('#credit-balance')
const newIdeaButton = document.querySelector('[data-action="new-idea"]')
const composer = document.querySelector('.idea-composer')
const composerForm = document.querySelector('#new-idea-form')
const ideaThought = document.querySelector('#idea-thought')
const startShapingButton = composerForm.querySelector('[type="submit"]')
const cancelComposerButton = composerForm.querySelector('[data-action="cancel-new-idea"]')
const profileButton = document.querySelector('[data-action="profile"]')
const profileMenu = document.querySelector('.profile-menu')
const toast = document.querySelector('.toast')
const toastCopy = toast.querySelector('span')

let ideas = []
let dashboardStatus = 'loading'
let openMenuId = null
let editingId = null
let deletingId = null
let toastTimer

const icons = {
  alert:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2 17 16H3l7-12.8Z"/><path d="M10 7.2v4.3M10 14.2h.01"/></svg>',
  check:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.2 3.4 3.3 7.6-7"/></svg>',
  compass:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m12.8 7.2-1.6 4-4 1.6 1.6-4 4-1.6Z"/></svg>',
  lock:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="8.5" width="11" height="8" rx="2"/><path d="M7 8.5V6.7a3 3 0 0 1 6 0v1.8"/></svg>',
  more:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1.35"/><circle cx="10" cy="10" r="1.35"/><circle cx="16" cy="10" r="1.35"/></svg>',
  progress:
    '<svg class="progress-ring" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3a7 7 0 1 1-6.5 4.4"/><path d="M3.5 3.5v4h4"/></svg>',
  save:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.2 3.4 3.3 7.6-7"/></svg>',
  close:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg>',
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function markerFor(stage, sequence) {
  if (stage.state === 'complete') return icons.check
  if (stage.state === 'locked') return icons.lock
  if (stage.state === 'running') return icons.progress
  if (stage.state === 'failed') return icons.alert
  return escapeHtml(sequence)
}

function renderStage(stage, sequence, ideaId) {
  const detail = stage.detail
    ? `<span class="stage-control__detail">${escapeHtml(stage.detail)}</span>`
    : ''
  const disabled = stage.disabled ? ' disabled aria-disabled="true"' : ''

  return `
    <li>
      <button
        class="stage-control stage-control--${escapeHtml(stage.state)}"
        type="button"
        data-action="stage"
        data-idea-id="${escapeHtml(ideaId)}"
        data-stage-key="${escapeHtml(stage.key)}"
        ${disabled}
      >
        <span class="stage-control__top">
          <span class="stage-control__marker">${markerFor(stage, sequence)}</span>
          <span class="stage-control__name">${escapeHtml(stage.name)}</span>
          <span class="stage-control__status">${escapeHtml(stage.status)}</span>
        </span>
        <span class="stage-control__action">${escapeHtml(stage.action)}</span>
        ${detail}
      </button>
    </li>
  `
}

function renderVerdict(verdict) {
  if (!verdict) return ''

  const tone =
    verdict.label === 'Worth pursuing'
      ? 'positive'
      : ['Refine before pursuing', 'Test the critical assumption'].includes(verdict.label)
        ? 'caution'
        : 'negative'

  return `
    <span class="verdict verdict--${tone}">
      ${icons.compass}
      <span class="verdict__label">${escapeHtml(verdict.label)}</span>
      <span class="verdict__confidence">${escapeHtml(verdict.confidence)}</span>
    </span>
  `
}

function renderTitle(idea) {
  if (editingId !== idea.id) {
    const frozen = idea.isFrozen
      ? `<span class="frozen-icon">
          ${icons.lock}
          <span>Frozen</span>
        </span>`
      : ''

    return `<div class="idea-card__title-row"><h3>${escapeHtml(idea.title)}</h3>${frozen}</div>`
  }

  return `
    <form class="title-edit-form" data-form="rename" data-idea-id="${escapeHtml(idea.id)}">
      <label class="sr-only" for="rename-${escapeHtml(idea.id)}">Idea title</label>
      <input id="rename-${escapeHtml(idea.id)}" name="title" value="${escapeHtml(idea.title)}" maxlength="80" required />
      <button class="icon-button" type="submit" aria-label="Save title">${icons.save}</button>
      <button class="icon-button" type="button" data-action="cancel-rename" data-idea-id="${escapeHtml(idea.id)}" aria-label="Cancel rename">${icons.close}</button>
    </form>
  `
}

function renderMenu(idea) {
  const isOpen = openMenuId === idea.id
  const menuId = `idea-menu-${idea.id}`

  return `
    <div class="card-menu-shell">
      <button
        class="more-button"
        type="button"
        data-action="menu"
        data-idea-id="${escapeHtml(idea.id)}"
        aria-label="More actions for ${escapeHtml(idea.title)}"
        aria-haspopup="menu"
        aria-controls="${escapeHtml(menuId)}"
        aria-expanded="${isOpen}"
      >
        ${icons.more}
      </button>
      <div class="card-menu" id="${escapeHtml(menuId)}" role="menu" ${isOpen ? '' : 'hidden'}>
        <button type="button" role="menuitem" data-action="rename" data-idea-id="${escapeHtml(idea.id)}">Rename</button>
        <button type="button" role="menuitem" data-action="delete" data-idea-id="${escapeHtml(idea.id)}">Delete</button>
      </div>
    </div>
  `
}

function renderNotice(idea) {
  if (!idea.notice) return ''

  const failed = idea.stages.some((stage) => stage.state === 'failed')
  return `
    <div class="idea-notice ${failed ? 'idea-notice--failed' : ''}">
      ${failed ? icons.alert : icons.progress}
      <span>${escapeHtml(idea.notice)}</span>
    </div>
  `
}

function renderDeleteConfirmation(idea) {
  if (deletingId !== idea.id) return ''

  return `
    <div class="inline-confirm" role="group" aria-label="Confirm deletion">
      <p><strong>Remove “${escapeHtml(idea.title)}”?</strong> This removes its Shape conversation and any purchased work from this prototype.</p>
      <div class="inline-confirm__actions">
        <button class="button button--quiet" type="button" data-action="cancel-delete" data-idea-id="${escapeHtml(idea.id)}">Keep idea</button>
        <button class="button button--danger" type="button" data-action="confirm-delete" data-idea-id="${escapeHtml(idea.id)}">Remove idea</button>
      </div>
    </div>
  `
}

function renderIdeaCard(idea) {
  return `
    <article class="idea-card" data-idea-card="${escapeHtml(idea.id)}">
      <div class="idea-card__summary">
        <div class="idea-card__main">
          ${renderTitle(idea)}
          <p class="idea-card__brief">${escapeHtml(idea.brief)}</p>
        </div>
        <div class="idea-card__meta">
          <div class="idea-card__facts">
            ${renderVerdict(idea.verdict)}
            <span class="updated-label">${escapeHtml(idea.updatedLabel)}</span>
          </div>
          ${renderMenu(idea)}
        </div>
      </div>
      ${renderNotice(idea)}
      ${renderDeleteConfirmation(idea)}
      <ol class="stage-rail" aria-label="Progress for ${escapeHtml(idea.title)}">
        ${idea.stages.map((item, index) => renderStage(item, index + 1, idea.id)).join('')}
      </ol>
    </article>
  `
}

function renderIdeas() {
  ideasCount.textContent = `${ideas.length} ${ideas.length === 1 ? 'idea' : 'ideas'}`

  if (ideas.length === 0) {
    ideasContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__inner">
          <span class="state-icon">${icons.compass}</span>
          <h3>Your first idea can start rough</h3>
          <p>Describe the problem, the person, or simply what has been on your mind. Shape will help make it clearer.</p>
        </div>
      </div>
    `
    setComposerOpen(true, { focus: false })
    cancelComposerButton.hidden = true
    ideasContent.setAttribute('aria-busy', 'false')
    return
  }

  cancelComposerButton.hidden = false
  ideasContent.innerHTML = `<div class="idea-stack">${ideas.map(renderIdeaCard).join('')}</div>`
  ideasContent.setAttribute('aria-busy', 'false')
}

function renderLoading() {
  ideasCount.textContent = 'Loading ideas'
  ideasContent.setAttribute('aria-busy', 'true')
  ideasContent.innerHTML = `
    <div class="skeleton-stack" aria-label="Loading your ideas">
      ${Array.from(
        { length: 3 },
        () => `
          <div class="skeleton-card" aria-hidden="true">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--brief"></div>
            <div class="skeleton-stage-row"><span></span><span></span><span></span></div>
          </div>`,
      ).join('')}
    </div>
  `
}

function renderError(message) {
  ideasCount.textContent = 'Your ideas'
  ideasContent.innerHTML = `
    <div class="error-state">
      <div class="error-state__inner">
        <span class="state-icon">${icons.alert}</span>
        <h3>We could not load your ideas</h3>
        <p>${escapeHtml(message)}</p>
        <button class="button button--primary" type="button" data-action="retry-load">Try again</button>
      </div>
    </div>
  `
  ideasContent.setAttribute('aria-busy', 'false')
}

function setComposerOpen(isOpen, options = {}) {
  composer.hidden = !isOpen
  newIdeaButton.setAttribute('aria-expanded', String(isOpen))

  if (isOpen && options.focus !== false) {
    requestAnimationFrame(() => ideaThought.focus())
  }
}

function closeProfileMenu() {
  profileMenu.hidden = true
  profileButton.setAttribute('aria-expanded', 'false')
}

function closeIdeaMenu() {
  if (!openMenuId) return
  const menuId = openMenuId
  openMenuId = null
  const menu = document.querySelector(`#idea-menu-${CSS.escape(menuId)}`)
  const button = document.querySelector(
    `[data-idea-id="${CSS.escape(menuId)}"][data-action="menu"]`,
  )
  if (menu) menu.hidden = true
  if (button) button.setAttribute('aria-expanded', 'false')
}

function focusIdeaMenuButton(ideaId) {
  requestAnimationFrame(() =>
    document.querySelector(`[data-idea-id="${CSS.escape(ideaId)}"][data-action="menu"]`)?.focus(),
  )
}

function focusIdeaStage(ideaId, stageKey) {
  requestAnimationFrame(() =>
    document
      .querySelector(
        `[data-idea-card="${CSS.escape(ideaId)}"] [data-stage-key="${CSS.escape(stageKey)}"]`,
      )
      ?.focus(),
  )
}

function showToast(message) {
  window.clearTimeout(toastTimer)
  toastCopy.textContent = message
  toast.hidden = false
  toastTimer = window.setTimeout(() => {
    toast.hidden = true
  }, 3400)
}

function titleFromThought(thought) {
  const firstLine = thought.split(/[.!?\n]/)[0].trim()
  if (!firstLine) return thought.slice(0, 58).trim() || 'Untitled idea'
  if (firstLine.length <= 58) return firstLine
  return `${firstLine.slice(0, 55).trimEnd()}…`
}

function createDraftIdea(thought) {
  return {
    schemaVersion: '1.0',
    id: `idea-${Date.now()}`,
    title: titleFromThought(thought),
    brief: thought,
    updatedLabel: 'Updated just now',
    isFrozen: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'current', status: 'In progress', action: 'Continue shaping' },
      {
        key: 'investigate',
        name: 'Investigate',
        state: 'locked',
        status: 'Locked',
        action: 'Finish Shape first',
        disabled: true,
        detail: 'Review the idea before starting research.',
      },
      {
        key: 'roadmap',
        name: 'Roadmap',
        state: 'locked',
        status: 'Locked',
        action: 'Research required',
        disabled: true,
        detail: 'Complete an Investigation to unlock the Roadmap.',
      },
    ],
  }
}

newIdeaButton.addEventListener('click', () => {
  if (!composer.hidden) {
    ideaThought.focus()
    return
  }

  setComposerOpen(true)
  startShapingButton.disabled = ideaThought.value.trim().length === 0
})

cancelComposerButton.addEventListener('click', () => {
  ideaThought.value = ''
  startShapingButton.disabled = true
  setComposerOpen(false)
  newIdeaButton.focus()
})

ideaThought.addEventListener('input', () => {
  startShapingButton.disabled = ideaThought.value.trim().length === 0
})

composer.addEventListener('click', (event) => {
  const exampleButton = event.target.closest('[data-example]')
  if (!exampleButton) return
  ideaThought.value = exampleButton.dataset.example
  startShapingButton.disabled = false
  ideaThought.focus()
})

composerForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const thought = ideaThought.value.trim()
  if (!thought) return

  const draftIdea = createDraftIdea(thought)
  ideas.unshift(draftIdea)
  ideaThought.value = ''
  startShapingButton.disabled = true
  setComposerOpen(false)
  renderIdeas()
  focusIdeaStage(draftIdea.id, 'shape')
  showToast('Idea created. Shape would open with your first message ready.')
})

profileButton.addEventListener('click', () => {
  const willOpen = profileMenu.hidden
  closeIdeaMenu()
  profileMenu.hidden = !willOpen
  profileButton.setAttribute('aria-expanded', String(willOpen))
  if (willOpen) requestAnimationFrame(() => profileMenu.querySelector('[role="menuitem"]')?.focus())
})

document.querySelector('[data-action="credits"]').addEventListener('click', () => {
  closeProfileMenu()
  closeIdeaMenu()
  showToast('Credits would open in general purchase mode.')
})

document.querySelector('[data-action="home"]').addEventListener('click', (event) => {
  event.preventDefault()
  closeProfileMenu()
  closeIdeaMenu()
  showToast('You are already on Your ideas.')
})

profileMenu.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action
  if (!action) return
  closeProfileMenu()
  profileButton.focus()
  showToast(action === 'account' ? 'Account settings are outside this prototype.' : 'Sign out is outside this prototype.')
})

ideasContent.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]')
  if (!control) return

  const action = control.dataset.action
  const ideaId = control.dataset.ideaId
  const idea = ideas.find((item) => item.id === ideaId)

  if (action === 'retry-load') {
    window.location.search = ''
    return
  }

  if (action === 'menu') {
    closeProfileMenu()
    const willOpen = openMenuId !== ideaId
    closeIdeaMenu()
    if (willOpen) {
      openMenuId = ideaId
      const menu = document.querySelector(`#idea-menu-${CSS.escape(ideaId)}`)
      if (menu) menu.hidden = false
      control.setAttribute('aria-expanded', 'true')
      requestAnimationFrame(() =>
        document.querySelector(`#idea-menu-${CSS.escape(openMenuId)} [role="menuitem"]`)?.focus(),
      )
    }
    return
  }

  if (!idea) return

  if (action === 'rename') {
    openMenuId = null
    editingId = idea.id
    deletingId = null
    renderIdeas()
    requestAnimationFrame(() => document.querySelector(`#rename-${CSS.escape(idea.id)}`)?.select())
    return
  }

  if (action === 'cancel-rename') {
    editingId = null
    renderIdeas()
    focusIdeaMenuButton(idea.id)
    return
  }

  if (action === 'delete') {
    openMenuId = null
    deletingId = idea.id
    editingId = null
    renderIdeas()
    requestAnimationFrame(() =>
      document.querySelector(`[data-idea-card="${CSS.escape(idea.id)}"] [data-action="cancel-delete"]`)?.focus(),
    )
    return
  }

  if (action === 'cancel-delete') {
    deletingId = null
    renderIdeas()
    focusIdeaMenuButton(idea.id)
    return
  }

  if (action === 'confirm-delete') {
    const removedIndex = ideas.findIndex((item) => item.id === idea.id)
    ideas = ideas.filter((item) => item.id !== idea.id)
    deletingId = null
    renderIdeas()
    const nextIdea = ideas[removedIndex] ?? ideas[removedIndex - 1]
    if (nextIdea) focusIdeaMenuButton(nextIdea.id)
    else requestAnimationFrame(() => newIdeaButton.focus())
    showToast('Idea removed from this prototype.')
    return
  }

  if (action === 'stage') {
    const selectedStage = idea.stages.find((stage) => stage.key === control.dataset.stageKey)
    if (selectedStage) showToast(`${selectedStage.action} would open in the full product.`)
  }
})

ideasContent.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-form="rename"]')
  if (!form) return
  event.preventDefault()

  const nextTitle = new FormData(form).get('title')?.toString().trim()
  if (!nextTitle) return

  const idea = ideas.find((item) => item.id === form.dataset.ideaId)
  if (!idea) return

  idea.title = nextTitle
  editingId = null
  renderIdeas()
  focusIdeaMenuButton(idea.id)
  showToast('Idea title updated.')
})

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.profile-shell')) closeProfileMenu()
  if (!event.target.closest('.card-menu-shell') && openMenuId) closeIdeaMenu()
})

document.addEventListener('focusin', (event) => {
  if (!profileMenu.hidden && !event.target.closest('.profile-shell')) closeProfileMenu()
  if (openMenuId && !event.target.closest('.card-menu-shell')) closeIdeaMenu()
})

document.addEventListener('keydown', (event) => {
  const activeMenu = event.target.closest('[role="menu"]')
  const menuKeys = ['ArrowDown', 'ArrowUp', 'Home', 'End']

  if (activeMenu && menuKeys.includes(event.key)) {
    event.preventDefault()
    const items = [...activeMenu.querySelectorAll('[role="menuitem"]')]
    const currentIndex = items.indexOf(document.activeElement)
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowDown'
            ? (currentIndex + 1) % items.length
            : (currentIndex - 1 + items.length) % items.length
    items[nextIndex]?.focus()
    return
  }

  if (event.key !== 'Escape') return

  if (!profileMenu.hidden) {
    closeProfileMenu()
    profileButton.focus()
    return
  }

  if (openMenuId) {
    const menuId = openMenuId
    closeIdeaMenu()
    document.querySelector(`[data-idea-id="${CSS.escape(menuId)}"][data-action="menu"]`)?.focus()
    return
  }

  if (editingId || deletingId) {
    const ideaId = editingId ?? deletingId
    editingId = null
    deletingId = null
    renderIdeas()
    focusIdeaMenuButton(ideaId)
    return
  }

  if (!composer.hidden && ideas.length > 0) {
    ideaThought.value = ''
    startShapingButton.disabled = true
    setComposerOpen(false)
    newIdeaButton.focus()
  }
})

async function initialise() {
  newIdeaButton.disabled = true
  renderLoading()

  const allowedViews = new Set(['populated', 'empty', 'loading', 'error'])
  const requestedView = new URLSearchParams(window.location.search).get('view')
  const view = allowedViews.has(requestedView) ? requestedView : 'populated'
  const dashboard = await getIdeasDashboard({ view })

  dashboardStatus = dashboard.status
  creditBalance.textContent = dashboard.credits.balance

  if (dashboardStatus === 'loading') return
  if (dashboardStatus === 'error') {
    renderError(dashboard.message)
    return
  }

  ideas = dashboard.ideas.map((idea) => structuredClone(idea))
  newIdeaButton.disabled = false
  renderIdeas()
}

initialise()
