import { ideaService } from './data.js'

const root = document.querySelector('#root')
const allowedPreviewStates = new Set(['populated', 'empty', 'loading', 'error'])
const requestedPreview = new URLSearchParams(window.location.search).get('state') || 'populated'
const preview = allowedPreviewStates.has(requestedPreview) ? requestedPreview : 'populated'

const state = {
  ideas: [],
  view: preview === 'populated' ? 'loading' : preview,
  composerOpen: preview === 'empty',
  composerDraft: '',
  composerError: '',
  profileOpen: false,
  openMenuId: null,
  editingId: null,
  renameDrafts: {},
  renameErrors: {},
  deletingId: null,
  toast: '',
}

const iconPaths = {
  logo: '<circle cx="12" cy="12" r="8.25"/><path d="M12 1.75v4.5M12 17.75v4.5M1.75 12h4.5M17.75 12h4.5"/><circle cx="12" cy="12" r="2.35" fill="currentColor" stroke="none"/>',
  credits: '<path d="m12 2 7.8 4.5v9L12 20l-7.8-4.5v-9L12 2Z"/><path d="m8.7 12 2.1 2.1 4.7-4.8"/>',
  user: '<circle cx="12" cy="8.1" r="3.2"/><path d="M5.8 20c.5-4 2.6-6 6.2-6s5.7 2 6.2 6"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M5 12h13M13 7l5 5-5 5"/>',
  check: '<path d="m6.5 12 3.4 3.4L17.8 7.5"/>',
  lock: '<rect x="5.7" y="10" width="12.6" height="9.5" rx="2"/><path d="M8.5 10V7.7a3.5 3.5 0 0 1 7 0V10"/>',
  search: '<circle cx="10.7" cy="10.7" r="6.3"/><path d="m15.3 15.3 4.2 4.2"/>',
  sparkle: '<path d="M12 3.4c.7 4.8 2.2 6.3 7 7-.1.1-.1.1 0 0-4.8.7-6.3 2.2-7 7-.7-4.8-2.2-6.3-7-7 4.8-.7 6.3-2.2 7-7Z"/>',
  warning: '<path d="M12 3.4 21 19H3L12 3.4Z"/><path d="M12 8.5v5.2M12 16.7v.1"/>',
  file: '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h5"/>',
  route: '<path d="M5 18.5c0-3.6 2.2-4.5 5.2-5.2 3.4-.8 6.3-1.4 6.3-5.1"/><circle cx="5" cy="18.5" r="1.8"/><circle cx="16.5" cy="6" r="1.8"/>',
  trash: '<path d="M4.5 7h15M9 7V4.5h6V7M7 7l.8 13h8.4L17 7M10 10.5v6M14 10.5v6"/>',
  edit: '<path d="m5 16.8-.8 3 3-.8L18 8.2 15.8 6 5 16.8Z"/><path d="m14.5 7.3 2.2 2.2"/>',
  close: '<path d="m7 7 10 10M17 7 7 17"/>',
}

function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character])
}

function statusIcon(status) {
  const names = {
    current: 'arrow',
    completed: 'check',
    available: 'arrow',
    running: 'search',
    ready: 'sparkle',
    locked: 'lock',
    failed: 'warning',
  }
  return icon(names[status])
}

function stageControl(stage, ideaTitle) {
  const disabled = stage.state === 'locked'
  const title = disabled ? ` title="${escapeHtml(stage.detail)}"` : ''

  return `<button
    class="stage-control stage-${stage.state}"
    type="button"
    data-action="stage"
    data-label="${escapeHtml(stage.action)}"
    aria-label="${escapeHtml(`${stage.name}: ${stage.action}. ${stage.detail}. ${ideaTitle}`)}"
    ${disabled ? 'disabled aria-disabled="true"' : ''}${title}
  >
    <span class="stage-marker">${statusIcon(stage.state)}</span>
    <span class="stage-name">${escapeHtml(stage.name)}</span>
    <strong>${escapeHtml(stage.action)}</strong>
    <small>${escapeHtml(stage.detail)}</small>
  </button>`
}

function verdictBlock(verdict) {
  if (!verdict) return ''

  return `<div class="verdict-note" aria-label="Investigation verdict: ${escapeHtml(verdict.label)}. ${escapeHtml(verdict.confidence)}.">
    ${icon('file')}
    <span>Investigation found</span>
    <strong>${escapeHtml(verdict.label)}</strong>
    <small>${escapeHtml(verdict.confidence)}</small>
  </div>`
}

function ideaMenu(idea) {
  if (state.openMenuId !== idea.id) return ''

  return `<div class="idea-menu" id="idea-actions-${escapeHtml(idea.id)}" aria-label="Actions for ${escapeHtml(idea.title)}">
    <button type="button" data-action="rename" data-id="${escapeHtml(idea.id)}">${icon('edit')}Rename</button>
    <button type="button" class="danger-action" data-action="ask-delete" data-id="${escapeHtml(idea.id)}">${icon('trash')}Delete</button>
  </div>`
}

function renameForm(idea) {
  const value = state.renameDrafts[idea.id] ?? idea.title
  const error = state.renameErrors[idea.id] || ''

  return `<form class="rename-form" data-form="rename" data-id="${escapeHtml(idea.id)}">
    <label for="rename-${escapeHtml(idea.id)}">Dashboard title</label>
    <div class="rename-row">
      <input
        id="rename-${escapeHtml(idea.id)}"
        name="title"
        value="${escapeHtml(value)}"
        autocomplete="off"
        aria-invalid="${Boolean(error)}"
        ${error ? `aria-describedby="rename-error-${escapeHtml(idea.id)}"` : ''}
        required
      />
      <button class="button button-quiet" type="button" data-action="cancel-rename">Cancel</button>
      <button class="button button-primary button-compact" type="submit">Save title</button>
    </div>
    ${error ? `<p class="form-error" id="rename-error-${escapeHtml(idea.id)}" role="alert">${escapeHtml(error)}</p>` : ''}
    <p>Renaming does not change the shaped brief or purchased research.</p>
  </form>`
}

function deleteConfirmation(idea) {
  return `<section class="delete-confirmation" aria-labelledby="delete-${escapeHtml(idea.id)}">
    <div>
      <h3 id="delete-${escapeHtml(idea.id)}">Delete this idea?</h3>
      <p>This removes its Shape chat, investigation, and roadmap from this prototype.</p>
    </div>
    <div class="confirmation-actions">
      <button class="button button-quiet" type="button" data-action="keep-idea">Keep idea</button>
      <button class="button button-danger" type="button" data-action="delete-idea" data-id="${escapeHtml(idea.id)}">Delete idea</button>
    </div>
  </section>`
}

function ideaCard(idea) {
  const editing = state.editingId === idea.id
  const deleting = state.deletingId === idea.id

  return `<article class="idea-record ${idea.unread ? 'idea-unread' : ''}">
    <div class="record-body">
      <div class="record-meta">
        <span class="position-label">${escapeHtml(idea.positionLabel)}</span>
        <span>${escapeHtml(idea.updatedLabel)}</span>
        ${idea.unread ? '<span class="unread-label"><i aria-hidden="true"></i>Unread</span>' : ''}
      </div>
      <div class="record-copy">
        ${editing ? renameForm(idea) : `<h2>${escapeHtml(idea.title)}</h2>`}
        <p class="idea-brief">${escapeHtml(idea.brief)}</p>
        ${verdictBlock(idea.verdict)}
      </div>
      <div class="menu-wrap">
        <button
          class="icon-button"
          type="button"
          aria-label="Actions for ${escapeHtml(idea.title)}"
          aria-expanded="${state.openMenuId === idea.id}"
          aria-controls="idea-actions-${escapeHtml(idea.id)}"
          data-action="menu"
          data-id="${escapeHtml(idea.id)}"
        >${icon('more')}</button>
        ${ideaMenu(idea)}
      </div>
    </div>
    ${deleting
      ? deleteConfirmation(idea)
      : `<div class="stage-route" role="group" aria-label="Stages for ${escapeHtml(idea.title)}">${idea.stages.map((stage) => stageControl(stage, idea.title)).join('')}</div>`}
  </article>`
}

function composer() {
  const canCancel = state.ideas.length > 0 && state.view !== 'empty'
  const error = state.composerError

  return `<section class="idea-composer" aria-labelledby="composer-title">
    <div class="composer-intro">
      <span class="composer-mark">${icon('route')}</span>
      <div>
        <h2 id="composer-title">Start with the part you know.</h2>
        <p>A problem, a customer, or a rough solution is enough to begin.</p>
      </div>
    </div>
    <form data-form="composer">
      <label for="idea-thought">What are you thinking about building?</label>
      <textarea
        id="idea-thought"
        name="thought"
        rows="3"
        placeholder="For example: a simpler way for small venues to fill cancelled bookings"
        aria-invalid="${Boolean(error)}"
        ${error ? 'aria-describedby="composer-error"' : ''}
        required
      >${escapeHtml(state.composerDraft)}</textarea>
      ${error ? `<p class="form-error" id="composer-error" role="alert">${escapeHtml(error)}</p>` : ''}
      <div class="composer-footer">
        <div class="idea-starters" aria-label="Example starting points">
          <button type="button" data-action="starter" data-value="A simpler way for small venues to fill cancelled bookings.">Small venues</button>
          <button type="button" data-action="starter" data-value="Help community clinics follow up with patients after treatment.">Community clinics</button>
        </div>
        <div class="composer-actions">
          ${canCancel ? '<button class="button button-quiet" type="button" data-action="cancel-composer">Cancel</button>' : ''}
          <button class="button button-primary" type="submit">Start shaping${icon('arrow')}</button>
        </div>
      </div>
    </form>
  </section>`
}

function loadingState() {
  return `<section class="loading-list" role="status" aria-live="polite" aria-busy="true">
    <span class="sr-only">Loading your ideas</span>
    ${[1, 2, 3].map(() => `<div class="skeleton-record" aria-hidden="true"><span></span><div><i></i><b></b><em></em></div><span class="skeleton-footer"></span></div>`).join('')}
  </section>`
}

function errorState() {
  return `<section class="page-message page-error" role="alert">
    <span class="message-icon">${icon('warning')}</span>
    <div>
      <h2>Your ideas could not load.</h2>
      <p>Your saved work has not changed. Try loading the page again.</p>
    </div>
    <button class="button button-secondary" type="button" data-action="retry">Try again</button>
  </section>`
}

function emptyState() {
  return `<div class="empty-intro">
    <p>No ideas yet. A useful starting thought can be one sentence.</p>
  </div>${composer()}`
}

function ideaList() {
  return `<section class="idea-list" aria-label="Your ideas">${state.ideas.map(ideaCard).join('')}</section>`
}

function mainContent() {
  if (state.view === 'loading') return loadingState()
  if (state.view === 'error') return errorState()
  if (state.view === 'empty') return emptyState()
  return `${state.composerOpen ? composer() : ''}${ideaList()}`
}

function profileMenu() {
  if (!state.profileOpen) return ''
  return `<div class="profile-menu" id="profile-actions" aria-label="Profile actions">
    <span>Signed in</span>
    <button type="button" data-action="account">Account</button>
    <button type="button" data-action="sign-out">Sign out</button>
  </div>`
}

function app() {
  return `<div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to ideas</a>
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="./" aria-label="Groundwork, return to Your ideas">
          <span class="brand-mark">${icon('logo')}</span>
          <span>Groundwork</span>
        </a>
        <div class="topbar-actions">
          <button class="credits-button" type="button" data-action="credits" aria-label="18 credits, open credits">
            ${icon('credits')}<strong>18</strong><span>credits</span>
          </button>
          <div class="profile-wrap">
            <button class="profile-button" type="button" data-action="profile" aria-label="Open profile menu" aria-expanded="${state.profileOpen}" aria-controls="profile-actions">
              <span class="avatar">${icon('user')}</span>${icon('chevron', 'chevron')}
            </button>
            ${profileMenu()}
          </div>
        </div>
      </div>
    </header>

    <main id="main-content">
      <section class="page-header" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Your ideas</h1>
          <p>Move each thought from a rough outline to evidence and a practical path.</p>
        </div>
        <button class="button button-primary new-idea-button" type="button" data-action="new-idea" ${state.view === 'loading' ? 'disabled' : ''}>
          ${icon('plus')}New idea
        </button>
      </section>
      ${mainContent()}
    </main>
    <div class="toast-region" aria-live="polite" aria-atomic="true">${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}</div>
  </div>`
}

function captureTransientInputs() {
  const composerInput = document.querySelector('#idea-thought')
  if (composerInput) state.composerDraft = composerInput.value

  const renameInput = document.querySelector('.rename-form input[name="title"]')
  if (renameInput) state.renameDrafts[renameInput.closest('form').dataset.id] = renameInput.value
}

function render(preserveInputs = true) {
  if (preserveInputs) captureTransientInputs()
  root.innerHTML = app()
}

let toastTimer
function renderToast() {
  const region = document.querySelector('.toast-region')
  if (region) region.innerHTML = state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''
}

function notify(message) {
  window.clearTimeout(toastTimer)
  state.toast = message
  renderToast()
  toastTimer = window.setTimeout(() => {
    if (state.toast === message) {
      state.toast = ''
      renderToast()
    }
  }, 3200)
}

function dismissPopovers(restoreFocus = false) {
  const menuId = state.openMenuId
  const profileWasOpen = state.profileOpen
  state.openMenuId = null
  state.profileOpen = false
  document.querySelector('.idea-menu')?.remove()
  document.querySelector('.profile-menu')?.remove()
  document.querySelectorAll('[data-action="menu"], [data-action="profile"]').forEach((button) => button.setAttribute('aria-expanded', 'false'))

  if (restoreFocus) {
    if (menuId) document.querySelector(`[data-action="menu"][data-id="${CSS.escape(menuId)}"]`)?.focus()
    else if (profileWasOpen) document.querySelector('[data-action="profile"]')?.focus()
  }
}

async function loadIdeas() {
  state.view = 'loading'
  render()
  try {
    state.ideas = await ideaService.listIdeas()
    state.view = state.ideas.length ? 'populated' : 'empty'
    state.composerOpen = state.ideas.length === 0
  } catch {
    state.view = 'error'
  }
  render()
}

root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]')
  if (!target) return

  const { action, id, label, value } = target.dataset

  if (action === 'new-idea') {
    state.composerOpen = true
    state.view = state.view === 'empty' ? 'empty' : 'populated'
    state.openMenuId = null
    render()
    document.querySelector('#idea-thought')?.focus()
  }

  if (action === 'cancel-composer') {
    captureTransientInputs()
    state.composerDraft = ''
    state.composerError = ''
    state.composerOpen = false
    render(false)
    document.querySelector('[data-action="new-idea"]')?.focus()
  }

  if (action === 'starter') {
    const textarea = document.querySelector('#idea-thought')
    if (textarea) {
      textarea.value = value
      textarea.focus()
    }
  }

  if (action === 'stage') notify(`${label} would open this stage in the complete prototype.`)
  if (action === 'credits') notify('Credits would open in general purchase mode.')
  if (action === 'account' || action === 'sign-out') {
    dismissPopovers()
    notify(action === 'account' ? 'Account settings are outside this prototype.' : 'Sign out is outside this prototype.')
  }

  if (action === 'profile') {
    const opening = !state.profileOpen
    state.profileOpen = opening
    state.openMenuId = null
    render()
    if (opening) document.querySelector('.profile-menu button')?.focus()
    else document.querySelector('[data-action="profile"]')?.focus()
  }

  if (action === 'menu') {
    const opening = state.openMenuId !== id
    state.openMenuId = opening ? id : null
    state.profileOpen = false
    render()
    if (opening) document.querySelector(`#idea-actions-${CSS.escape(id)} button`)?.focus()
    else document.querySelector(`[data-action="menu"][data-id="${CSS.escape(id)}"]`)?.focus()
  }

  if (action === 'rename') {
    state.editingId = id
    state.openMenuId = null
    render()
    const input = document.querySelector(`#rename-${CSS.escape(id)}`)
    input?.focus()
    input?.select()
  }

  if (action === 'cancel-rename') {
    const previousId = state.editingId
    captureTransientInputs()
    state.editingId = null
    delete state.renameDrafts[previousId]
    delete state.renameErrors[previousId]
    render(false)
    document.querySelector(`[data-action="menu"][data-id="${CSS.escape(previousId)}"]`)?.focus()
  }

  if (action === 'ask-delete') {
    state.deletingId = id
    state.openMenuId = null
    render()
    document.querySelector('[data-action="keep-idea"]')?.focus()
  }

  if (action === 'keep-idea') {
    const previousId = state.deletingId
    state.deletingId = null
    render()
    document.querySelector(`[data-action="menu"][data-id="${CSS.escape(previousId)}"]`)?.focus()
  }

  if (action === 'delete-idea') {
    state.ideas = state.ideas.filter((idea) => idea.id !== id)
    state.deletingId = null
    if (state.ideas.length === 0) {
      state.view = 'empty'
      state.composerOpen = true
    }
    render()
    notify('Idea deleted from this prototype.')
  }

  if (action === 'retry') loadIdeas()
})

root.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = event.target

  if (form.dataset.form === 'composer') {
    const thought = String(new FormData(form).get('thought') || '').trim()
    captureTransientInputs()
    if (!thought) {
      state.composerError = 'Enter a starting thought before continuing.'
      render(false)
      document.querySelector('#idea-thought')?.focus()
      return
    }
    state.ideas.unshift(ideaService.createDraft(thought))
    state.view = 'populated'
    state.composerOpen = false
    state.composerDraft = ''
    state.composerError = ''
    render(false)
    notify('Idea created. Shape would open next.')
  }

  if (form.dataset.form === 'rename') {
    const title = String(new FormData(form).get('title') || '').trim()
    const id = form.dataset.id
    captureTransientInputs()
    if (!title) {
      state.renameErrors[id] = 'Enter a dashboard title.'
      render(false)
      document.querySelector(`#rename-${CSS.escape(id)}`)?.focus()
      return
    }
    state.ideas = state.ideas.map((idea) => idea.id === form.dataset.id ? { ...idea, title } : idea)
    state.editingId = null
    delete state.renameDrafts[id]
    delete state.renameErrors[id]
    render(false)
    notify('Dashboard title updated.')
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  if (state.openMenuId || state.profileOpen) {
    dismissPopovers(true)
  }
})

document.addEventListener('click', (event) => {
  if (!state.openMenuId && !state.profileOpen) return
  if (event.target.closest('.menu-wrap, .profile-wrap')) return
  dismissPopovers()
})

render()

if (preview === 'populated') {
  loadIdeas()
} else {
  ideaService.listIdeas().then((ideas) => {
    state.ideas = preview === 'empty' ? [] : ideas
    render()
  }).catch(() => {
    state.view = 'error'
    render()
  })
}
