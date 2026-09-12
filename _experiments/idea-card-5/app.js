import { getIdeas } from './data.js'

const ideas = getIdeas()
const ideasRoot = document.querySelector('#ideas')
const cardTemplate = document.querySelector('#idea-card-template')
const composer = document.querySelector('#idea-composer')
const newIdeaButton = document.querySelector('[data-action="new-idea"]')
const newIdeaForm = document.querySelector('#new-idea-form')
const ideaInput = document.querySelector('#idea-input')
const ideaMessage = document.querySelector('#idea-message')
const profileButton = document.querySelector('[data-action="profile"]')
const profileMenu = document.querySelector('.profile-menu')
const toast = document.querySelector('.toast')
const toastText = toast.querySelector('span')

const stageIcons = {
  current: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><circle cx="9" cy="9" r="2" /></svg>',
  complete: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6.25" /><path d="m5.8 9.1 2.1 2.1 4.5-4.5" /></svg>',
  running: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="M9 3a6 6 0 0 1 6 6" /></svg>',
  ready: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6.25" /><path d="M9 5.4v7.2M5.4 9h7.2" /></svg>',
  available: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6.25" /><path d="M6.1 9h5.8M9.8 6.1 12.7 9l-2.9 2.9" /></svg>',
  locked: '<svg viewBox="0 0 18 18" aria-hidden="true"><rect x="4.4" y="7.7" width="9.2" height="6.5" rx="1.2" /><path d="M6.5 7.7V6.2a2.5 2.5 0 0 1 5 0v1.5" /></svg>',
  failed: '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6.25" /><path d="M9 5.3v4M9 12.1v.1" /></svg>',
}

function closeMenus(except = null) {
  document.querySelectorAll('.idea-menu').forEach((menu) => {
    if (menu !== except) {
      menu.hidden = true
      menu.previousElementSibling.setAttribute('aria-expanded', 'false')
    }
  })
}

function renderStage(stage, ideaTitle) {
  const locked = stage.state === 'locked'
  const item = document.createElement('li')
  item.className = `stage stage--${stage.state}`
  const button = document.createElement('button')
  button.type = 'button'
  button.disabled = locked
  button.innerHTML = `${stageIcons[stage.state]}<span class="stage-copy"><span class="stage-name">${stage.name}</span><strong>${stage.action}</strong><small>${stage.detail}</small></span>`
  if (!locked) {
    button.addEventListener('click', () => {
      const destination = stage.state === 'current' ? 'Shape' : stage.name
      showToast(`${destination} would open for “${ideaTitle}”.`)
    })
  }
  item.append(button)
  return item
}

function renderIdeas() {
  ideasRoot.replaceChildren()
  ideas.forEach((idea) => {
    const fragment = cardTemplate.content.cloneNode(true)
    const card = fragment.querySelector('.idea-card')
    card.dataset.ideaId = idea.id
    fragment.querySelector('.updated').textContent = idea.updated
    fragment.querySelector('h3').textContent = idea.title
    fragment.querySelector('.summary').textContent = idea.summary

    if (idea.verdict) {
      const verdict = fragment.querySelector('.verdict')
      verdict.hidden = false
      verdict.querySelector('strong').textContent = idea.verdict.label
      verdict.querySelector('em').textContent = idea.verdict.confidence
    }

    const stagePath = fragment.querySelector('.stage-path')
    idea.stages.forEach((stage) => stagePath.append(renderStage(stage, idea.title)))

    const menuButton = fragment.querySelector('.menu-button')
    const menu = fragment.querySelector('.idea-menu')
    menuButton.setAttribute('aria-label', `Actions for ${idea.title}`)
    menuButton.addEventListener('click', () => {
      const shouldOpen = menu.hidden
      closeMenus(menu)
      menu.hidden = !shouldOpen
      menuButton.setAttribute('aria-expanded', String(shouldOpen))
    })
    menu.querySelector('[data-menu-action="rename"]').addEventListener('click', () => showToast(`Rename is available for “${idea.title}”.`))
    menu.querySelector('[data-menu-action="delete"]').addEventListener('click', () => showToast(`Delete confirmation would open for “${idea.title}”.`))
    ideasRoot.append(fragment)
  })
}

function showToast(message) {
  toastText.textContent = message
  toast.hidden = false
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => { toast.hidden = true }, 3200)
}

function setComposerOpen(open) {
  composer.hidden = !open
  newIdeaButton.setAttribute('aria-expanded', String(open))
  if (open) {
    ideaInput.focus()
    composer.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

newIdeaButton.addEventListener('click', () => setComposerOpen(composer.hidden))
document.querySelector('[data-action="cancel-new"]').addEventListener('click', () => {
  newIdeaForm.reset()
  ideaMessage.textContent = ''
  setComposerOpen(false)
})

document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    ideaInput.value = button.dataset.example
    ideaInput.focus()
  })
})

newIdeaForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const draft = ideaInput.value.trim()
  if (!draft) {
    ideaMessage.textContent = 'Add a starting thought before continuing.'
    ideaInput.focus()
    return
  }
  ideaMessage.textContent = ''
  setComposerOpen(false)
  newIdeaForm.reset()
  showToast('Your new idea would open in Shape with this first thought.')
})

profileButton.addEventListener('click', () => {
  const isOpen = profileMenu.hidden
  profileMenu.hidden = !isOpen
  profileButton.setAttribute('aria-expanded', String(isOpen))
})

document.querySelector('[data-action="credits"]').addEventListener('click', () => showToast('Credits would open general purchase mode.'))
document.querySelector('[data-action="account"]').addEventListener('click', () => showToast('Account settings are outside this experiment.'))
document.querySelector('[data-action="sign-out"]').addEventListener('click', () => showToast('Sign out is outside this experiment.'))
document.addEventListener('click', (event) => {
  if (!event.target.closest('.idea-menu-shell')) closeMenus()
  if (!event.target.closest('.profile-shell')) {
    profileMenu.hidden = true
    profileButton.setAttribute('aria-expanded', 'false')
  }
})

renderIdeas()
