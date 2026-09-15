import { idea, variants } from './data.js'

const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5.5 23.5c4.2-6.2 7.7-9.8 10.5-10.8 3.3-1.2 6.8.3 10.5 4.5"/><path d="M5.5 17.7c3.7-4.5 6.9-7.2 9.6-8 3.8-1.1 7.6.4 11.4 4.5"/><path d="M5.5 11.8c3-2.8 5.9-4.4 8.7-4.8 4-.6 8.1 1 12.3 4.8"/></svg>`,
  more: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1.25"/><circle cx="10" cy="10" r="1.25"/><circle cx="16" cy="10" r="1.25"/></svg>`,
  arrow: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4"/></svg>`,
  check: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.8"/></svg>`,
  spark: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8 11.6 8l5.2 1.6-5.2 1.6-1.6 5.2-1.6-5.2-5.2-1.6L8.4 8 10 2.8Z"/></svg>`,
}

const app = document.querySelector('#app')

function stageIcon(stage) {
  return stage.state === 'complete' ? icons.check : icons.arrow
}

function menu() {
  return `
    <div class="menu-wrap">
      <button class="icon-button menu-trigger" type="button" aria-label="More actions for ${idea.title}" aria-expanded="false">${icons.more}</button>
      <div class="card-menu" role="menu" hidden>
        <button type="button" role="menuitem" data-menu-action="Rename">Rename</button>
        <button type="button" role="menuitem" data-menu-action="Delete idea" class="danger">Delete idea</button>
      </div>
    </div>`
}

function signal() {
  return `<span class="signal"><span aria-hidden="true"></span>${idea.signal}</span>`
}

function verdict(compact = false) {
  return `
    <div class="verdict${compact ? ' verdict--compact' : ''}">
      <span class="verdict__icon">${icons.check}</span>
      <span><strong>${idea.verdict.label}</strong><small>${idea.verdict.confidence}</small></span>
    </div>`
}

function stageButton(stage, index, mode = '') {
  return `
    <button type="button" class="stage stage--${stage.state} ${mode}" data-stage-action="${stage.action}">
      <span class="stage__marker">${stage.state === 'complete' ? icons.check : index + 1}</span>
      <span class="stage__copy"><strong>${stage.label}</strong><small>${stage.note}</small></span>
      <span class="stage__action">${stage.action}${stageIcon(stage)}</span>
    </button>`
}

function commonHeading(extra = '') {
  return `
    <div class="card-heading ${extra}">
      <div>${signal()}<h3>${idea.title}</h3></div>
      ${menu()}
    </div>`
}

function miniStage(stage, index, extra = '') {
  return `
    <button type="button" class="mini-stage mini-stage--${stage.state} ${extra}" data-stage-action="${stage.action}" aria-label="${stage.action}: ${stage.label}">
      <span class="mini-stage__marker">${stage.state === 'complete' ? icons.check : index + 1}</span>
      <span><strong>${stage.label}</strong><small>${stage.action}</small></span>
    </button>`
}

function railCard() {
  return `
    <article class="prototype-card rail-card">
      <div class="rail-card__body">
        <div class="meta-line"><span>Updated ${idea.updated}</span></div>
        ${commonHeading()}
        <p class="brief">${idea.brief}</p>
        ${verdict()}
      </div>
      <div class="rail-card__stages" aria-label="Idea stages">
        ${idea.stages.map((stage, index) => stageButton(stage, index)).join('')}
      </div>
    </article>`
}

function focusCard() {
  const current = idea.stages[1]
  return `
    <article class="prototype-card focus-card">
      <div class="focus-card__main">
        <div class="meta-row">${signal()}<span>Updated ${idea.updated}</span>${menu()}</div>
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
        ${verdict(true)}
      </div>
      <button type="button" class="focus-action" data-stage-action="${current.action}">
        <span class="focus-action__meta">Investigation complete</span>
        <strong>${current.action}</strong>
        <span>See the evidence, risks, and recommended refinement.</span>
        <span class="focus-action__icon">${icons.arrow}</span>
      </button>
      <div class="focus-card__stages" aria-label="Idea stages">
        ${idea.stages.filter((stage) => stage.key !== 'investigate').map((stage, index) => stageButton(stage, index === 0 ? 0 : 2, 'stage--slim')).join('')}
      </div>
    </article>`
}

function spineCard() {
  return `
    <article class="prototype-card spine-card">
      <div class="spine-card__stages" aria-label="Idea stages">
        <span class="spine-line" aria-hidden="true"></span>
        ${idea.stages.map((stage, index) => stageButton(stage, index, 'stage--spine')).join('')}
      </div>
      <div class="spine-card__body">
        <div class="meta-row">${signal()}<span>Updated ${idea.updated}</span>${menu()}</div>
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
        ${verdict()}
      </div>
    </article>`
}

function tableCard() {
  return `
    <article class="prototype-card table-card">
      <div class="table-card__body">
        <div class="meta-row">${signal()}<span>Updated ${idea.updated}</span>${menu()}</div>
        <div class="table-card__copy"><div><h3>${idea.title}</h3><p class="brief">${idea.brief}</p></div>${verdict(true)}</div>
      </div>
      <div class="table-card__stages" aria-label="Idea stages">
        ${idea.stages.map((stage, index) => stageButton(stage, index, 'stage--column')).join('')}
      </div>
    </article>`
}

function compactCard() {
  return `
    <article class="prototype-card compact-card">
      <div class="compact-card__signal">${signal()}<span>Updated ${idea.updated}</span></div>
      <div class="compact-card__copy">
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
      </div>
      <div class="compact-card__verdict">${verdict(true)}</div>
      <div class="compact-card__actions" aria-label="Idea stages">
        ${idea.stages.map((stage, index) => stageButton(stage, index, 'stage--compact')).join('')}
      </div>
      ${menu()}
    </article>`
}

function verdictCard() {
  return `
    <article class="prototype-card verdict-card">
      <div class="verdict-card__header">
        <div>${signal()}<span class="updated">Updated ${idea.updated}</span></div>
        ${menu()}
      </div>
      <div class="verdict-card__body">
        <div><h3>${idea.title}</h3><p class="brief">${idea.brief}</p></div>
        <div class="verdict-panel">
          <span class="verdict-panel__icon">${icons.spark}</span>
          <span>Groundwork recommends</span>
          <strong>${idea.verdict.label}</strong>
          <small>${idea.verdict.confidence}</small>
        </div>
      </div>
      <div class="verdict-card__footer" aria-label="Idea stages">
        <div class="stage-history">
          ${idea.stages.slice(0, 2).map((stage, index) => stageButton(stage, index, 'stage--history')).join('')}
        </div>
        ${stageButton(idea.stages[2], 2, 'stage--roadmap')}
      </div>
    </article>`
}

function lineCard() {
  return `
    <article class="prototype-card line-card">
      <div class="line-card__copy">
        <div class="line-card__meta">
          ${signal()}
          <span class="line-card__verdict" title="${idea.verdict.label}">${icons.check}<strong>Test critical assumption</strong></span>
          <span>Updated ${idea.updated}</span>
        </div>
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
      </div>
      <div class="line-card__stages" aria-label="Idea stages">
        ${idea.stages.map((stage, index) => miniStage(stage, index)).join('')}
      </div>
      ${menu()}
    </article>`
}

function glanceCard() {
  const report = idea.stages[1]
  return `
    <article class="prototype-card glance-card">
      <div class="glance-card__body">
        <div class="glance-card__meta">${signal()}</div>
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
        <div class="glance-card__verdict">${icons.check}<strong>${idea.verdict.label}</strong><span>${idea.verdict.confidence}</span></div>
      </div>
      <div class="glance-card__history" aria-label="Other idea stages">
        ${miniStage(idea.stages[0], 0, 'mini-stage--quiet')}
        ${miniStage(idea.stages[2], 2, 'mini-stage--quiet')}
      </div>
      <button type="button" class="glance-action" data-stage-action="${report.action}">
        <span>${report.note}</span><strong>${report.action}</strong>${icons.arrow}
      </button>
      ${menu()}
    </article>`
}

function ledgerCard() {
  return `
    <article class="ledger-card">
      <div class="ledger-card__state">${signal()}<span>Updated ${idea.updated}</span></div>
      <div class="ledger-card__copy"><h3>${idea.title}</h3><p class="brief">${idea.brief}</p></div>
      <div class="ledger-card__verdict"><strong>${idea.verdict.label}</strong><span>${idea.verdict.confidence}</span></div>
      <div class="ledger-card__stages" aria-label="Idea stages">${idea.stages.map((stage, index) => miniStage(stage, index, 'mini-stage--text')).join('')}</div>
      ${menu()}
    </article>`
}

function indexCard() {
  const report = idea.stages[1]
  return `
    <article class="prototype-card index-card">
      <div class="index-card__number" aria-hidden="true"><span>2</span><small>of 3</small></div>
      <div class="index-card__copy">
        <div>${signal()}<span class="updated">Updated ${idea.updated}</span></div>
        <h3>${idea.title}</h3>
        <p class="brief">${idea.brief}</p>
      </div>
      <div class="index-card__decision">
        <span>${report.label} complete</span>
        <button type="button" data-stage-action="${report.action}">${report.action}${icons.arrow}</button>
        <div aria-label="Other idea stages">
          ${miniStage(idea.stages[0], 0, 'mini-stage--dot')}
          ${miniStage(idea.stages[2], 2, 'mini-stage--dot')}
        </div>
      </div>
      ${menu()}
    </article>`
}

function microCard() {
  return `
    <article class="prototype-card micro-card">
      <div class="micro-card__heading">
        <div>${signal()}<h3>${idea.title}</h3></div>
        <div class="micro-card__verdict"><strong>${idea.verdict.label}</strong><span>${idea.verdict.confidence}</span></div>
        ${menu()}
      </div>
      <p class="brief">${idea.brief}</p>
      <div class="micro-track" aria-label="Idea stages">
        <span class="micro-track__line" aria-hidden="true"></span>
        ${idea.stages.map((stage, index) => miniStage(stage, index, 'mini-stage--micro')).join('')}
      </div>
    </article>`
}

function disclosureCard() {
  return `
    <article class="prototype-card disclosure-card">
      <div class="disclosure-card__summary">
        <div>${signal()}<h3>${idea.title}</h3></div>
        <span class="disclosure-verdict">${idea.verdict.label}</span>
        <button type="button" class="disclosure-action" data-stage-action="Read report">Read report${icons.arrow}</button>
        <button type="button" class="details-toggle" data-toggle-details aria-expanded="false">Details <span aria-hidden="true">＋</span></button>
        ${menu()}
      </div>
      <div class="disclosure-card__details" hidden>
        <p class="brief">${idea.brief}</p>
        <div aria-label="Other idea stages">${idea.stages.filter((stage) => stage.key !== 'investigate').map((stage, index) => miniStage(stage, index === 0 ? 0 : 2)).join('')}</div>
      </div>
    </article>`
}

const renderers = {
  rail: railCard,
  focus: focusCard,
  spine: spineCard,
  table: tableCard,
  compact: compactCard,
  verdict: verdictCard,
  line: lineCard,
  glance: glanceCard,
  ledger: ledgerCard,
  index: indexCard,
  micro: microCard,
  disclosure: disclosureCard,
}

function render() {
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="../idea-card-7/" aria-label="Groundwork card prototypes">${icons.mark}<span>Groundwork</span></a>
      <span>Component study</span>
    </header>
    <main>
      <header class="page-header">
        <div><h1>Idea card prototypes</h1><p>Twelve structures, one idea. The second set explores a lighter, more compact direction.</p></div>
        <div class="page-header__count"><strong>${variants.length}</strong><span>directions</span></div>
      </header>
      <div class="prototype-list">
        ${variants.map((variant, index) => `${index === 6 ? '<div class="collection-break"><span>Compact studies</span><p>Less container, less repetition, faster scanning.</p></div>' : ''}
          <section class="prototype" aria-labelledby="variant-${variant.id}">
            <header class="prototype__label">
              <span>${variant.number}</span>
              <div><h2 id="variant-${variant.id}">${variant.name}</h2><p>${variant.description}</p></div>
            </header>
            ${renderers[variant.id]()}
          </section>`).join('')}
      </div>
    </main>
    <div class="toast" role="status" aria-live="polite" hidden></div>`
  bindEvents()
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.hidden = false
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => { toast.hidden = true }, 2200)
}

function closeMenus(except) {
  document.querySelectorAll('.card-menu').forEach((menuElement) => {
    if (menuElement === except) return
    menuElement.hidden = true
    menuElement.previousElementSibling?.setAttribute('aria-expanded', 'false')
  })
}

function bindEvents() {
  document.querySelectorAll('[data-stage-action]').forEach((button) => button.addEventListener('click', () => {
    showToast(`${button.dataset.stageAction} selected.`)
  }))
  document.querySelectorAll('.menu-trigger').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation()
    const cardMenu = button.nextElementSibling
    const opening = cardMenu.hidden
    closeMenus(cardMenu)
    cardMenu.hidden = !opening
    button.setAttribute('aria-expanded', String(opening))
  }))
  document.querySelectorAll('[data-menu-action]').forEach((button) => button.addEventListener('click', () => {
    showToast(`${button.dataset.menuAction} selected.`)
    closeMenus()
  }))
  document.querySelectorAll('[data-toggle-details]').forEach((button) => button.addEventListener('click', () => {
    const details = button.closest('.disclosure-card').querySelector('.disclosure-card__details')
    const opening = details.hidden
    details.hidden = !opening
    button.setAttribute('aria-expanded', String(opening))
    button.innerHTML = `${opening ? 'Hide details' : 'Details'} <span aria-hidden="true">${opening ? '−' : '＋'}</span>`
  }))
  document.onclick = () => closeMenus()
  document.onkeydown = (event) => { if (event.key === 'Escape') closeMenus() }
}

render()
