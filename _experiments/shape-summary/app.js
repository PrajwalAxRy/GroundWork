import { provenanceCopy, scenarios } from './data.js'

const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 25 16 6l10 19h-5l-5-10-5 10H6Z"/><path d="M11 25h10"/></svg>`,
  credit: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6.5 19c.8-3 2.6-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/></svg>`,
  back: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-7-4 14-3-6-7-1Z"/><path d="m12 13 7-8"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>`,
  info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8v.1"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 3.8 19h16.4L12 4Z"/><path d="M12 9v4M12 16.5v.1"/></svg>`,
}

const availableScenarios = Object.keys(scenarios)
const requestedScenario = new URLSearchParams(window.location.search).get('state')
const savedDraft = window.sessionStorage.getItem('groundwork-shape-draft') || ''
const state = {
  scenario: availableScenarios.includes(requestedScenario) ? requestedScenario : 'developed',
  messages: [],
  draft: savedDraft,
  sending: false,
  reviewNotice: false,
  summaryUpdated: false,
}

const root = document.querySelector('#app')
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]))

function loadScenario(key) {
  state.scenario = key
  state.messages = structuredClone(scenarios[key].messages)
  state.sending = false
  state.reviewNotice = false
  state.summaryUpdated = false
}

function shell() {
  return `<header class="topbar">
    <a class="brand" href="/ideas" aria-label="Groundwork, return to your ideas">${icons.mark}<span>Groundwork</span></a>
    <nav aria-label="Account">
      <button class="credits" type="button" aria-label="18 credits, open credits">${icons.credit}<span><strong>18</strong> credits</span></button>
      <button class="profile" type="button" aria-label="Open profile menu">${icons.profile}</button>
    </nav>
  </header>`
}

function previewBar() {
  return `<aside class="preview-bar" aria-label="Prototype controls">
    <label for="scenario">Prototype state</label>
    <select id="scenario" data-action="scenario">
      ${availableScenarios.map((key) => `<option value="${key}" ${state.scenario === key ? 'selected' : ''}>${escapeHtml(scenarios[key].label)}</option>`).join('')}
    </select>
    <span>Development only</span>
  </aside>`
}

function summaryField(field) {
  return `<div class="summary-field summary-field--${field.provenance} ${state.summaryUpdated && field.label === 'Target user' ? 'summary-field--updated' : ''}">
    <div class="summary-field__label">
      <dt>${escapeHtml(field.label)}</dt>
      <span>${escapeHtml(provenanceCopy[field.provenance])}</span>
    </div>
    <dd>${escapeHtml(field.value)}</dd>
  </div>`
}

function summaryContent(scenario, compact = false) {
  return `<div class="summary-heading">
      <div><p>Working brief</p><h2>Current idea</h2></div>
      <span class="summary-status"><i aria-hidden="true"></i>${scenario.frozen ? 'Frozen' : 'Live'}</span>
    </div>
    <p class="summary-context">${scenario.frozen ? 'This is the brief used for Investigation.' : 'Updated when the conversation meaningfully changes.'}</p>
    <dl class="summary-list ${compact ? 'summary-list--compact' : ''}">${scenario.summary.map(summaryField).join('')}</dl>
    ${scenario.frozen ? '' : `<div class="summary-key"><span><i class="key-confirmed"></i>Yours</span><span><i class="key-groundwork"></i>Groundwork</span><span><i class="key-open"></i>Open</span></div>`}`
}

function desktopSummary(scenario) {
  return `<aside class="idea-summary" aria-label="Current idea summary">${summaryContent(scenario)}</aside>`
}

function mobileSummary(scenario) {
  const known = scenario.summary.filter((field) => field.provenance === 'confirmed').length
  return `<details class="mobile-summary">
    <summary><span><small>Current idea</small>${scenario.frozen ? 'Frozen brief' : `${known} confirmed details`}</span>${icons.chevron}</summary>
    <div>${summaryContent(scenario, true)}</div>
  </details>`
}

function messageMarkup(message) {
  if (message.failed) {
    return `<article class="response-error" role="alert">
      <span>${icons.warning}</span>
      <div><strong>Response interrupted</strong><p>${escapeHtml(message.body)}</p></div>
      <button type="button" class="retry-button" data-action="retry">Retry response</button>
    </article>`
  }

  const speaker = message.role === 'assistant' ? 'Groundwork' : 'You'
  return `<article class="message message--${message.role}">
    <header><span class="speaker-mark" aria-hidden="true">${message.role === 'assistant' ? icons.mark : ''}</span><strong>${speaker}</strong></header>
    <div class="message__body"><p>${escapeHtml(message.body)}</p>
      ${message.note ? `<aside class="research-note">${icons.info}<span><strong>Research question saved</strong>${escapeHtml(message.note)}</span></aside>` : ''}
    </div>
  </article>`
}

function pendingMessage() {
  return `<article class="message message--assistant message--pending" aria-label="Groundwork is responding" aria-busy="true">
    <header><span class="speaker-mark" aria-hidden="true">${icons.mark}</span><strong>Groundwork</strong><span class="thinking-label">Thinking through your answer</span></header>
    <div class="pending-lines"><i></i><i></i><i></i></div>
  </article>`
}

function frozenNotice() {
  return `<aside class="frozen-notice">${icons.check}<div><strong>This Idea was frozen when Investigation began.</strong><span>You can read the conversation, but material changes start a new Idea.</span></div><button type="button" data-action="investigation">Open investigation</button></aside>`
}

function reviewNotice() {
  return `<aside class="review-notice" role="status">${icons.check}<div><strong>Your working brief is ready to review.</strong><span>You can still return to this conversation before starting Investigation.</span></div><button type="button" data-action="dismiss-review" aria-label="Dismiss review preview">Keep shaping</button></aside>`
}

function composer() {
  return `<footer class="composer-wrap">
    <form class="composer" data-form="message">
      <label class="sr-only" for="message-input">Message Groundwork</label>
      <textarea id="message-input" name="message" rows="2" placeholder="Add a detail, question an assumption, or correct the brief…" ${state.sending ? 'disabled' : ''}>${escapeHtml(state.draft)}</textarea>
      <div class="composer-actions">
        <span>${state.sending ? 'Your message is saved in the conversation.' : 'Shape does not search the internet.'}</span>
        <button type="submit" class="send-button" ${state.sending ? 'disabled' : ''}>${state.sending ? '<i class="button-spinner" aria-hidden="true"></i> Responding' : `Send ${icons.send}`}</button>
      </div>
    </form>
    <button type="button" class="review-button" data-action="review">Review idea</button>
  </footer>`
}

function loadingView() {
  return `<main class="shape-page shape-page--loading" aria-busy="true" aria-label="Loading Shape conversation">
    <div class="loading-header"><i></i><b></b><span></span></div>
    <div class="shape-layout">
      <section class="conversation-paper"><div class="loading-messages">${[1, 2, 3].map((item) => `<article class="loading-message loading-message--${item % 2 ? 'left' : 'right'}"><i></i><span></span><span></span></article>`).join('')}</div></section>
      <aside class="idea-summary loading-summary"><i></i>${[1, 2, 3, 4].map(() => '<span></span>').join('')}</aside>
    </div>
  </main>`
}

function appMarkup() {
  const scenario = scenarios[state.scenario]
  if (state.scenario === 'loading') return `${shell()}${previewBar()}${loadingView()}`

  return `${shell()}${previewBar()}
    <main class="shape-page">
      <header class="page-header">
        <a href="/ideas" class="back-link">${icons.back} Your ideas</a>
        <div class="page-heading">
          <div><div class="stage-line"><span>Shape</span><i></i><span>${escapeHtml(scenario.readiness)}</span></div><h1>${escapeHtml(scenario.title)}</h1></div>
          ${scenario.frozen ? '<span class="frozen-badge">Read-only transcript</span>' : ''}
        </div>
      </header>
      ${scenario.frozen ? frozenNotice() : state.reviewNotice ? reviewNotice() : ''}
      ${mobileSummary(scenario)}
      <div class="shape-layout">
        <section class="conversation-paper" aria-label="Shape conversation">
          <div class="conversation-intro"><span>${icons.mark}</span><div><strong>Your cofounder workspace</strong><p>Think out loud. I will help sharpen the idea and keep the working brief current.</p></div></div>
          <div class="thread">${state.messages.map(messageMarkup).join('')}${state.sending ? pendingMessage() : ''}</div>
          ${scenario.frozen ? '' : composer()}
        </section>
        ${desktopSummary(scenario)}
      </div>
      <p class="sr-only" aria-live="polite">${state.sending ? 'Groundwork is preparing a response.' : ''}</p>
    </main>`
}

function render({ focusComposer = false } = {}) {
  root.innerHTML = appMarkup()
  if (focusComposer) document.querySelector('#message-input')?.focus()
}

function completeResponse() {
  state.sending = false
  state.messages.push({
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    body: 'That narrows the first version well. Routing and visible ownership solve a concrete operational problem without asking clinics to trust an automated clinical judgment. I would keep urgency suggestions in the Investigation questions. What is the smallest request type you could support first to prove the workflow?',
  })
  state.summaryUpdated = true
  render()
  document.querySelector('.thread')?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

root.addEventListener('change', (event) => {
  if (event.target.matches('[data-action="scenario"]')) {
    const key = event.target.value
    const url = new URL(window.location.href)
    url.searchParams.set('state', key)
    window.history.replaceState({}, '', url)
    loadScenario(key)
    render()
  }
})

root.addEventListener('input', (event) => {
  if (event.target.id === 'message-input') {
    state.draft = event.target.value
    window.sessionStorage.setItem('groundwork-shape-draft', state.draft)
  }
})

root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]')
  if (!target) return
  if (target.dataset.action === 'retry') {
    state.messages = state.messages.filter((message) => !message.failed)
    state.sending = true
    render()
    window.setTimeout(completeResponse, 900)
  }
  if (target.dataset.action === 'review') {
    state.reviewNotice = true
    render()
    document.querySelector('.review-notice')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  if (target.dataset.action === 'dismiss-review') {
    state.reviewNotice = false
    render({ focusComposer: true })
  }
  if (target.dataset.action === 'investigation') {
    target.textContent = 'Investigation would open'
  }
})

root.addEventListener('submit', (event) => {
  event.preventDefault()
  if (event.target.dataset.form !== 'message' || state.sending) return
  const body = new FormData(event.target).get('message').trim()
  if (!body) {
    document.querySelector('#message-input')?.focus()
    return
  }
  state.messages.push({ id: `user-${Date.now()}`, role: 'user', body })
  state.draft = ''
  window.sessionStorage.removeItem('groundwork-shape-draft')
  state.sending = true
  render()
  window.setTimeout(completeResponse, 1100)
})

loadScenario(state.scenario)
render()
