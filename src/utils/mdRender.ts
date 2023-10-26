import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import cpp from 'highlight.js/lib/languages/cpp'
import c from 'highlight.js/lib/languages/c'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import less from 'highlight.js/lib/languages/less'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import { emit } from '@tauri-apps/api/event'
import { BusEvent } from '../types/BusEvent'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', c)
hljs.registerLanguage('java', java)
hljs.registerLanguage('python', python)
hljs.registerLanguage('less', less)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('sql', sql)

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
    .use(anchor, {
        permalink: false,
        permalinkBefore: false
    })
    .use(markdownItTocDoneRight, {
        containerClass: 'toc',
        listType: 'ul',
        listClass: 'toc-list',
        linkClass: 'toc-link',
        callback: html => {
            emit(BusEvent.GetToc, html)
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
