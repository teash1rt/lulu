import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)

const md: MarkdownIt = new MarkdownIt({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs">\n<code>\n' +
                    hljs.highlight(str, { language: lang }).value +
                    '</code>\n</pre>'
                )
            } catch (error) {}
        }
        return '<pre class="hljs">\n<code>\n' + md.utils.escapeHtml(str) + '</code>\n</pre>'
    }
})

md.inline.ruler.push('lump', (state, silent: boolean) => {
    const src = state.src
    const pos = state.pos

    if (src[pos] !== ':' || src[pos + 1] !== ':' || src[pos + 2] !== ':') {
        return false
    }

    let end = src.indexOf(':::', pos + 3)

    if (end === -1) {
        return false
    }

    if (!silent) {
        const token = state.push('lump', 'div', 0)
        token.markup = ':::'
        token.content = src.slice(pos + 3, end).trim()
        token.info = 'class="pad"'
    }

    state.pos = end + 3
    return true
})

const lumps: string[] = []

md.renderer.rules.lump = (tokens, idx) => {
    const token = tokens[idx]
    lumps.push(token.content)
    return `<div ${token.info}>\n<pre class="hljs">\n<code>${
        hljs.highlight(token.content, { language: 'js' }).value
    }</code>\n</pre>\n</div>`
}

export const render = (code: string) => {
    return {
        html: md.render(code),
        lumps: lumps
    }
}
