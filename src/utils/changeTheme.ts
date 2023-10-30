import type { CodeTheme } from '../types/CodeTheme'

export const changeTheme = (theme: CodeTheme) => {
    const head = document.head
    const oldLink = head.querySelector('link[rel="stylesheet"][href*="themes"]')
    if (oldLink) {
        head.removeChild(oldLink)
    }
    const newLink = document.createElement('link')
    newLink.setAttribute('type', 'text/css')
    newLink.setAttribute('rel', 'stylesheet')
    newLink.setAttribute('href', `themes/${theme}.css`)
    head.appendChild(newLink)
}
