import { prototypeService } from './mock-service.js'
import { provenanceCopy } from './shape-data.js'
import { escapeHtml, icons, shellMarkup } from './shared.js'

const currentFactPattern = /\b(competitors?|pricing|prices?|market size|revenue|regulations?|laws?|current alternatives?)\b/i

function messageId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function assistantReply(message) {
  if (currentFactPattern.test(message)) {
    return {
      body: 'That needs current market research, so I will not guess from memory. I have added it to your Investigation questions. For shaping this version now, which alternative do you most expect your customer to keep using if they do not choose you?',
      note: `Saved for Investigation: ${message}`,
      researchQuestion: message,
    }
  }

  return {
    body: 'That makes the first version more specific. The next useful pressure test is the moment someone decides the current workaround is no longer good enough. What happens immediately before they start looking for another option?',
    updatedField: {
      label: 'Primary uncertainty',
      value: 'What triggers the customer to replace the current workaround.',
      provenance: 'suggested',
    },
  }
}

export function mountShapePage(root, { ideaId, navigate, isActive }) {
  const query = new URLSearchParams(window.location.search)
  const state = {
    idea: prototypeService.getIdea(ideaId),
    shape: prototypeService.getShape(ideaId),
    draft: prototypeService.getDraft(ideaId),
    profile: false,
    sending: false,
    reviewNotice: false,
    toast: '',
    updatedField: '',
    previewFailure: query.get('preview') === 'response-failure',
    loading: query.get('preview') === 'loading',
    loadError: query.get('preview') === 'load-error',
  }

  document.title = state.idea ? `${state.idea.title} | Groundwork` : 'Idea not found | Groundwork'

  function summaryField(field) {
    return `<div class="shape-summary-field shape-summary-field--${field.provenance} ${state.updatedField === field.label ? 'shape-summary-field--updated' : ''}">
      <div class="shape-summary-field__label">
        <dt>${escapeHtml(field.label)}</dt>
        <span>${escapeHtml(provenanceCopy[field.provenance])}</span>
      </div>
      <dd>${escapeHtml(field.value)}</dd>
    </div>`
  }

  function summaryContent(compact = false) {
    return `<div class="shape-summary-heading">
        <div><p>Working brief</p><h2>Current idea</h2></div>
        <span class="shape-summary-status"><i aria-hidden="true"></i>${state.shape.frozen ? 'Frozen' : 'Live'}</span>
      </div>
      <p class="shape-summary-context">${state.shape.frozen ? 'This is the brief used for Investigation.' : 'Updated when the conversation meaningfully changes.'}</p>
      <dl class="shape-summary-list ${compact ? 'shape-summary-list--compact' : ''}">${state.shape.summary.map(summaryField).join('')}</dl>
      ${state.shape.frozen ? '' : `<div class="shape-summary-key"><span><i class="key-confirmed"></i>Yours</span><span><i class="key-groundwork"></i>Groundwork</span><span><i class="key-open"></i>Open</span></div>`}`
  }

  function mobileSummary() {
    const known = state.shape.summary.filter((field) => field.provenance === 'confirmed').length
    return `<details class="shape-mobile-summary">
      <summary><span><small>Current idea</small>${state.shape.frozen ? 'Frozen brief' : `${known} confirmed detail${known === 1 ? '' : 's'}`}</span>${icons.chevron}</summary>
      <div>${summaryContent(true)}</div>
    </details>`
  }

  function messageMarkup(message) {
    if (message.failed) {
      return `<article class="shape-response-error" role="alert">
        <span>${icons.warning}</span>
        <div><strong>Response interrupted</strong><p>${escapeHtml(message.body)}</p></div>
        <button type="button" class="shape-retry-button" data-action="retry-response">Retry response</button>
      </article>`
    }

    const speaker = message.role === 'assistant' ? 'Groundwork' : 'You'
    return `<article class="shape-message shape-message--${message.role}">
      <header><span class="shape-speaker-mark" aria-hidden="true">${message.role === 'assistant' ? icons.mark : ''}</span><strong>${speaker}</strong></header>
      <div class="shape-message__body"><p>${escapeHtml(message.body)}</p>
        ${message.note ? `<aside class="shape-research-note">${icons.info}<span><strong>Research question saved</strong>${escapeHtml(message.note)}</span></aside>` : ''}
      </div>
    </article>`
  }

  function pendingMessage() {
    return `<article class="shape-message shape-message--assistant shape-message--pending" aria-label="Groundwork is responding" aria-busy="true">
      <header><span class="shape-speaker-mark" aria-hidden="true">${icons.mark}</span><strong>Groundwork</strong><span class="shape-thinking-label">Thinking through your answer</span></header>
      <div class="shape-pending-lines"><i></i><i></i><i></i></div>
    </article>`
  }

  function frozenNotice() {
    return `<aside class="shape-frozen-notice">${icons.check}<div><strong>This Idea was frozen when Investigation began.</strong><span>You can read the conversation, but material changes start a new Idea.</span></div><button type="button" data-action="investigation">Open investigation</button></aside>`
  }

  function reviewNotice() {
    return `<aside class="shape-review-notice" role="status">${icons.check}<div><strong>Your working brief is ready to review.</strong><span>You can still return to this conversation before starting Investigation.</span></div><button type="button" data-action="dismiss-review">Keep shaping</button></aside>`
  }

  function composer() {
    return `<footer class="shape-composer-wrap">
      <form class="shape-composer" data-form="shape-message">
        <label class="sr-only" for="shape-message-input">Message Groundwork</label>
        <textarea id="shape-message-input" name="message" rows="2" placeholder="Add a detail, question an assumption, or correct the brief…" ${state.sending ? 'disabled' : ''}>${escapeHtml(state.draft)}</textarea>
        <div class="shape-composer-actions">
          <span>${state.sending ? 'Your message is saved in the conversation.' : 'Shape does not search the internet.'}</span>
          <button type="submit" class="shape-send-button" ${state.sending ? 'disabled' : ''}>${state.sending ? '<i class="shape-button-spinner" aria-hidden="true"></i> Responding' : `Send ${icons.send}`}</button>
        </div>
      </form>
      <button type="button" class="shape-review-button" data-action="review">Review idea</button>
    </footer>`
  }

  function loadingView() {
    return `<main class="shape-page shape-page--loading" aria-busy="true" aria-label="Loading Shape conversation">
      <div class="shape-loading-header"><i></i><b></b><span></span></div>
      <div class="shape-layout">
        <section class="shape-conversation-paper"><div class="shape-loading-messages">${[1, 2, 3].map((item) => `<article class="shape-loading-message shape-loading-message--${item % 2 ? 'left' : 'right'}"><i></i><span></span><span></span></article>`).join('')}</div></section>
        <aside class="shape-idea-summary shape-loading-summary"><i></i>${[1, 2, 3, 4].map(() => '<span></span>').join('')}</aside>
      </div>
    </main>`
  }

  function errorView() {
    return `<main class="shape-page"><section class="shape-page-error" role="alert">${icons.warning}<div><h1>The conversation could not load.</h1><p>Your saved messages have not changed. Try loading the conversation again.</p></div><button type="button" data-action="retry-load">Try again</button><a href="/ideas" data-link>Return to Your ideas</a></section></main>`
  }

  function notFoundView() {
    return `<main class="shape-page"><section class="shape-page-error">${icons.warning}<div><h1>That Idea is not available.</h1><p>It may have been removed, or this link may be incomplete.</p></div><a href="/ideas" data-link>Return to Your ideas</a></section></main>`
  }

  function render() {
    if (!state.idea || !state.shape) {
      root.innerHTML = `<div class="app-shell">${shellMarkup(state.profile)}${notFoundView()}</div>`
      return
    }
    if (state.loading) {
      root.innerHTML = `<div class="app-shell">${shellMarkup(state.profile)}${loadingView()}</div>`
      return
    }
    if (state.loadError) {
      root.innerHTML = `<div class="app-shell">${shellMarkup(state.profile)}${errorView()}</div>`
      return
    }

    root.innerHTML = `<div class="app-shell">${shellMarkup(state.profile)}
      <main class="shape-page">
        <header class="shape-page-header">
          <a href="/ideas" data-link class="shape-back-link">${icons.back} Your ideas</a>
          <div class="shape-page-heading">
            <div><div class="shape-stage-line"><span>Shape</span><i></i><span>${escapeHtml(state.shape.readiness)}</span></div><h1>${escapeHtml(state.idea.title)}</h1></div>
            ${state.shape.frozen ? '<span class="shape-frozen-badge">Read-only transcript</span>' : ''}
          </div>
        </header>
        ${state.shape.frozen ? frozenNotice() : state.reviewNotice ? reviewNotice() : ''}
        ${mobileSummary()}
        <div class="shape-layout">
          <section class="shape-conversation-paper" aria-label="Shape conversation">
            <div class="shape-conversation-intro"><span>${icons.mark}</span><div><strong>Your cofounder workspace</strong><p>Think out loud. I will help sharpen the idea and keep the working brief current.</p></div></div>
            <div class="shape-thread">${state.shape.messages.map(messageMarkup).join('')}${state.sending ? pendingMessage() : ''}</div>
            ${state.shape.frozen ? '' : composer()}
          </section>
          <aside class="shape-idea-summary" aria-label="Current idea summary">${summaryContent()}</aside>
        </div>
        <p class="sr-only" aria-live="polite">${state.sending ? 'Groundwork is preparing a response.' : ''}</p>
      </main>
      ${state.toast ? `<div class="toast" role="status" aria-live="polite">${escapeHtml(state.toast)}</div>` : ''}
    </div>`
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

  function completeResponse(sourceMessage, replacingFailure = false) {
    const reply = assistantReply(sourceMessage)
    if (reply.researchQuestion) prototypeService.addResearchQuestion(ideaId, reply.researchQuestion)
    if (reply.updatedField) prototypeService.updateSummaryField(ideaId, reply.updatedField)
    const response = { id: messageId('assistant'), role: 'assistant', body: reply.body, note: reply.note }
    state.shape = replacingFailure
      ? prototypeService.replaceFailedMessage(ideaId, response)
      : prototypeService.appendMessage(ideaId, response)
    state.sending = false
    state.updatedField = reply.updatedField?.label || ''
    if (isActive()) {
      render()
      document.querySelector('.shape-thread')?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  root.onclick = (event) => {
    const link = event.target.closest('[data-link]')
    if (link) {
      event.preventDefault()
      navigate(link.getAttribute('href'))
      return
    }
    const target = event.target.closest('[data-action]')
    if (!target) return
    const action = target.dataset.action
    if (action === 'profile') { state.profile = !state.profile; render() }
    if (action === 'credits') notify('Credits would open general purchase mode')
    if (action === 'profile-settings') notify('Account settings are outside this prototype')
    if (action === 'sign-out') notify('Signed out in a complete product')
    if (action === 'retry-load') { state.loadError = false; render() }
    if (action === 'retry-response') {
      const failed = state.shape.messages.find((message) => message.failed)
      const sourceMessage = [...state.shape.messages].reverse().find((message) => message.role === 'user')?.body || ''
      if (!failed) return
      state.sending = true
      render()
      window.setTimeout(() => completeResponse(sourceMessage, true), 800)
    }
    if (action === 'review') { state.reviewNotice = true; render(); document.querySelector('.shape-review-notice')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    if (action === 'dismiss-review') { state.reviewNotice = false; render(); document.querySelector('#shape-message-input')?.focus() }
    if (action === 'investigation') notify('Investigation opens in a later prototype phase')
  }

  root.oninput = (event) => {
    if (event.target.id !== 'shape-message-input') return
    state.draft = event.target.value
    prototypeService.saveDraft(ideaId, state.draft)
  }

  root.onsubmit = (event) => {
    event.preventDefault()
    if (event.target.dataset.form !== 'shape-message' || state.sending) return
    const message = new FormData(event.target).get('message').trim()
    if (!message) {
      document.querySelector('#shape-message-input')?.focus()
      return
    }
    state.shape = prototypeService.appendMessage(ideaId, { id: messageId('user'), role: 'user', body: message })
    state.draft = ''
    state.updatedField = ''
    state.sending = true
    render()

    window.setTimeout(() => {
      if (state.previewFailure) {
        state.previewFailure = false
        state.sending = false
        state.shape = prototypeService.appendMessage(ideaId, {
          id: messageId('failure'),
          role: 'assistant',
          body: 'Groundwork could not respond. Your message is still in the conversation.',
          failed: true,
        })
        if (isActive()) render()
        return
      }
      completeResponse(message)
    }, 900)
  }

  root.onchange = null
  render()

  if (state.loading) {
    window.setTimeout(() => {
      if (!isActive()) return
      state.loading = false
      render()
    }, 650)
  }
}
