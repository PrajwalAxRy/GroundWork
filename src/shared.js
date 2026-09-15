export const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 25 16 6l10 19h-5l-5-10-5 10H6Z"/><path d="M11 25h10"/></svg>`,
  credit: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6.5 19c.8-3 2.6-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="9" rx="2"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>`,
  spinner: `<svg class="spinner" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 3.8 19h16.4L12 4Z"/><path d="M12 9v4M12 16.5v.1"/></svg>`,
  back: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-7-4 14-3-6-7-1Z"/><path d="m12 13 7-8"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>`,
  info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8v.1"/></svg>`,
}

export const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]))

export function shellMarkup(profileOpen = false) {
  const profileMenu = profileOpen
    ? `<div class="profile-menu"><strong>Priya Singh</strong><button data-action="profile-settings">Account settings</button><button data-action="sign-out">Sign out</button></div>`
    : ''

  return `<header class="topbar">
    <a class="brand" href="/ideas" data-link aria-label="Groundwork, return to your ideas">${icons.mark}<span>Groundwork</span></a>
    <nav aria-label="Account">
      <button class="credits" type="button" data-action="credits" aria-label="18 credits, open credits">${icons.credit}<span><strong>18</strong> credits</span></button>
      <div class="profile-wrap"><button class="profile" type="button" data-action="profile" aria-expanded="${profileOpen}" aria-label="Open profile menu">${icons.profile}</button>${profileMenu}</div>
    </nav>
  </header>`
}
