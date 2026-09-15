import { mountIdeasPage } from './ideas-page.js'
import { mountShapePage } from './shape-page.js'

const root = document.querySelector('#root')
let routeVersion = 0

function routeFromLocation() {
  const shapeMatch = window.location.pathname.match(/^\/ideas\/([^/]+)\/shape\/?$/)
  if (shapeMatch) return { name: 'shape', ideaId: decodeURIComponent(shapeMatch[1]) }
  return { name: 'ideas' }
}

function navigate(path) {
  window.history.pushState({}, '', path)
  renderRoute()
  window.scrollTo({ top: 0, behavior: 'auto' })
}

function renderRoute() {
  const version = ++routeVersion
  const isActive = () => version === routeVersion
  const route = routeFromLocation()
  if (route.name === 'shape') {
    mountShapePage(root, { ideaId: route.ideaId, navigate, isActive })
    return
  }
  mountIdeasPage(root, { navigate, isActive })
}

window.addEventListener('popstate', renderRoute)
renderRoute()
