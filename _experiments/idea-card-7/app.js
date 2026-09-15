import { ideas as sourceIdeas } from './data.js'

const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5.5 23.5c4.2-6.2 7.7-9.8 10.5-10.8 3.3-1.2 6.8.3 10.5 4.5"/><path d="M5.5 17.7c3.7-4.5 6.9-7.2 9.6-8 3.8-1.1 7.6.4 11.4 4.5"/><path d="M5.5 11.8c3-2.8 5.9-4.4 8.7-4.8 4-.6 8.1 1 12.3 4.8"/></svg>`,
  credit: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M7.4 10h5.2M10 7.4v5.2"/></svg>`,
  chevron: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 8 3 3 3-3"/></svg>`,
  more: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="16" cy="10" r="1.2"/></svg>`,
  arrow: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4"/></svg>`,
  check: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.8"/></svg>`,
  lock: `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5.5" y="8.5" width="9" height="7" rx="1.5"/><path d="M7.5 8.5V6.7a2.5 2.5 0 0 1 5 0v1.8"/></svg>`,
  warning: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.7 3.7 15h12.6L10 3.7Z"/><path d="M10 7.7v3.6M10 13.5v.1"/></svg>`,
  progress: `<svg class="progress-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/></svg>`,
  close: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg>`,
}

let ideas = structuredClone(sourceIdeas)
const app = document.querySelector('#app')

function stageIcon(state) {
  if (state === 'locked') return icons.lock
  if (state === 'complete') return icons.check
  if (state === 'running') return icons.progress
  if (state === 'failed') return icons.warning
  return icons.arrow
}

function stageMarkup(stage, index) {
  const isLocked = stage.state === 'locked'
  const element = isLocked ? 'div' : 'button'
  const attributes = isLocked
    ? `role="group" aria-label="${stage.label}: ${stage.note}"`
    : `type="button" data-stage="${stage.key}" aria-label="${stage.action}: ${stage.label}"`

  return `
    <li class="stage stage--${stage.state}">
      <${element} class="stage__control" ${attributes}>
        <span class="stage__marker" aria-hidden="true">${isLocked ? icons.lock : index + 1}</span>
        <span class="stage__text">
          <span class="stage__label">${stage.label}</span>
          <span class="stage__note">${stage.note}</span>
        </span>
        <span class="stage__action">
          <span>${stage.action}</span>
          ${stageIcon(stage.state)}
        </span>
      </${element}>
    </li>`
}

function cardMarkup(idea) {
  const hasFailure = idea.stages.some((stage) => stage.state === 'failed')
  const hasRunning = idea.stages.some((stage) => stage.state === 'running')
  const cardState = hasFailure ? 'failed' : hasRunning ? 'running' : idea.signal ? 'attention' : 'quiet'
  return `
    <article class="idea-card idea-card--${cardState}" data-id="${idea.id}">
      <div class="idea-card__body">
        <div class="idea-card__meta">
          ${idea.signal ? `<span class="signal signal--${cardState}"><span aria-hidden="true"></span>${idea.signal}</span>` : '<span class="signal signal--quiet">In your workspace</span>'}
          <span>Updated ${idea.updated}</span>
        </div>
        <div class="idea-card__heading">
          <h2>${idea.title}</h2>
          <div class="menu-wrap">
            <button type="button" class="icon-button menu-trigger" aria-label="More actions for ${idea.title}" aria-haspopup="menu" aria-expanded="false">${icons.more}</button>
            <div class="card-menu" role="menu" hidden>
              <button type="button" role="menuitem" data-action="rename">Rename</button>
              <button type="button" role="menuitem" data-action="delete" class="danger">Delete idea</button>
            </div>
          </div>
        </div>
        <p class="idea-card__brief">${idea.brief}</p>
        ${idea.verdict ? `<div class="verdict"><span class="verdict__mark">${icons.check}</span><span><b>${idea.verdict.label}</b><small>${idea.verdict.confidence}</small></span></div>` : ''}
      </div>
      <ol class="stages" aria-label="Progress for ${idea.title}">
        ${idea.stages.map(stageMarkup).join('')}
      </ol>
    </article>`
}

function render() {
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#" aria-label="Groundwork, Your ideas">${icons.mark}<span>Groundwork</span></a>
      <nav class="account-nav" aria-label="Account">
        <button type="button" class="credits" data-popover="credits">${icons.credit}<span><strong>18</strong> credits</span></button>
        <span class="nav-divider" aria-hidden="true"></span>
        <button type="button" class="profile" data-popover="profile" aria-label="Open profile menu" aria-controls="account-popover" aria-expanded="false"><span aria-hidden="true">PS</span><span class="profile__label">Profile</span>${icons.chevron}</button>
      </nav>
    </header>
    <main>
      <section class="page-heading" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Your ideas</h1>
          <p>Keep shaping what is promising. Test what is uncertain.</p>
        </div>
        <button type="button" class="button button--primary" id="new-idea">New idea <span aria-hidden="true">＋</span></button>
      </section>

      <section class="composer" id="composer" hidden aria-labelledby="composer-title">
        <div class="composer__heading">
          <div>
            <h2 id="composer-title">Start with the rough version</h2>
            <p>A problem, observation, or half-formed solution is enough.</p>
          </div>
          <button type="button" class="icon-button" id="cancel-composer" aria-label="Close new idea composer">${icons.close}</button>
        </div>
        <label for="idea-input">What are you thinking about building?</label>
        <textarea id="idea-input" rows="4" maxlength="600" placeholder="For example: Small clinics lose track of patient requests across email, phone, and text..."></textarea>
        <div class="composer__footer">
          <span><span id="character-count">0</span>/600</span>
          <button type="button" class="button button--primary" id="start-shaping" disabled>Start shaping</button>
        </div>
      </section>

      <div class="list-heading">
        <h2>Your workspace</h2>
        <p><span id="idea-count">${ideas.length}</span> ${ideas.length === 1 ? 'idea' : 'ideas'}, most recently updated</p>
      </div>
      <section class="idea-list" aria-label="Your ideas">
        ${ideas.length ? ideas.map(cardMarkup).join('') : emptyMarkup()}
      </section>
    </main>

    <div class="popover" id="account-popover" role="dialog" aria-label="Account information" hidden></div>
    <div class="toast" role="status" aria-live="polite" hidden></div>
    <dialog id="delete-dialog" aria-labelledby="delete-title">
      <form method="dialog">
        <span class="dialog-icon">${icons.warning}</span>
        <h2 id="delete-title">Delete this idea?</h2>
        <p>The Shape conversation, investigation, and roadmap will be removed with it.</p>
        <div class="dialog-actions">
          <button value="cancel" class="button button--secondary">Keep idea</button>
          <button value="confirm" class="button button--danger">Delete idea</button>
        </div>
      </form>
    </dialog>`
  bindEvents()
}

function emptyMarkup() {
  return `<div class="empty-state"><h2>Your first idea can be rough.</h2><p>Start with something you noticed, a customer problem, or a product you wish existed.</p><button type="button" class="button button--primary" data-empty-action>Start an idea</button></div>`
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.hidden = false
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => { toast.hidden = true }, 2600)
}

function closeMenus(except) {
  document.querySelectorAll('.card-menu').forEach((menu) => {
    if (menu !== except) {
      menu.hidden = true
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false')
    }
  })
}

function openComposer() {
  const composer = document.querySelector('#composer')
  composer.hidden = false
  composer.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => document.querySelector('#idea-input')?.focus(), 220)
}

function bindEvents() {
  const composer = document.querySelector('#composer')
  const input = document.querySelector('#idea-input')
  const start = document.querySelector('#start-shaping')
  const count = document.querySelector('#character-count')

  document.querySelector('#new-idea')?.addEventListener('click', openComposer)
  document.querySelector('[data-empty-action]')?.addEventListener('click', openComposer)
  document.querySelector('#cancel-composer')?.addEventListener('click', () => {
    composer.hidden = true
    input.value = ''
    count.textContent = '0'
    start.disabled = true
    document.querySelector('#new-idea')?.focus()
  })
  input?.addEventListener('input', () => {
    const length = input.value.length
    count.textContent = String(length)
    start.disabled = input.value.trim().length === 0
  })
  start?.addEventListener('click', () => {
    start.disabled = true
    start.textContent = 'Opening Shape…'
    window.setTimeout(() => {
      showToast('Idea created. Shape would open next.')
      start.textContent = 'Start shaping'
      composer.hidden = true
      input.value = ''
      count.textContent = '0'
    }, 500)
  })

  document.querySelectorAll('.menu-trigger').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation()
    const menu = button.nextElementSibling
    const willOpen = menu.hidden
    closeMenus(menu)
    menu.hidden = !willOpen
    button.setAttribute('aria-expanded', String(willOpen))
  }))

  document.querySelectorAll('[data-action="rename"]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.idea-card')
    const heading = card.querySelector('h2')
    closeMenus()
    heading.contentEditable = 'true'
    heading.setAttribute('role', 'textbox')
    heading.setAttribute('aria-label', 'Rename idea')
    heading.focus()
    const range = document.createRange()
    range.selectNodeContents(heading)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    const finish = () => {
      heading.contentEditable = 'false'
      heading.removeAttribute('role')
      heading.removeAttribute('aria-label')
      showToast('Idea renamed.')
    }
    heading.addEventListener('blur', finish, { once: true })
    heading.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); heading.blur() }
      if (event.key === 'Escape') heading.blur()
    }, { once: true })
  }))

  let pendingDelete = null
  const dialog = document.querySelector('#delete-dialog')
  document.querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', () => {
    pendingDelete = button.closest('.idea-card').dataset.id
    closeMenus()
    dialog.showModal()
  }))
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm' && pendingDelete) {
      ideas = ideas.filter((idea) => idea.id !== pendingDelete)
      render()
      showToast('Idea deleted from this prototype.')
    }
    pendingDelete = null
  })

  document.querySelectorAll('.stage__control[data-stage]').forEach((button) => button.addEventListener('click', () => {
    const label = button.querySelector('.stage__action span')?.textContent
    showToast(`${label} selected.`)
  }))

  document.querySelectorAll('[data-popover]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation()
    const popover = document.querySelector('#account-popover')
    const isProfile = button.dataset.popover === 'profile'
    popover.innerHTML = isProfile
      ? '<strong>Priya Singh</strong><span>Account settings are outside this prototype.</span>'
      : '<strong>18 credits available</strong><span>Credits open the purchase page in the full product.</span>'
    popover.hidden = false
    popover.style.right = isProfile ? '24px' : '116px'
    if (isProfile) button.setAttribute('aria-expanded', 'true')
  }))

  document.onclick = () => {
    closeMenus()
    const popover = document.querySelector('#account-popover')
    if (popover) popover.hidden = true
    document.querySelector('[data-popover="profile"]')?.setAttribute('aria-expanded', 'false')
  }
  document.onkeydown = (event) => {
    if (event.key !== 'Escape') return
    closeMenus()
    const popover = document.querySelector('#account-popover')
    if (popover) popover.hidden = true
    document.querySelector('[data-popover="profile"]')?.setAttribute('aria-expanded', 'false')
  }
}

render()
