const symbols = ['>', '-']

const getTrimHeader = (line: string) => {
    for (let i = 0; i < line.length; i++) {
        if (line[i] !== ' ') {
            return {
                char: line[i],
                idx: i
            }
        }
    }
}

export const getLineScope = (content: string, pos: number) => {
    let l = pos
    let r = pos
    while (l > 0 && content[l - 1] !== '\n') {
        l -= 1
    }
    while (r < content.length && content[r] !== '\n') {
        r += 1
    }
    return { l, r }
}

export const getLineContext = (curLine: string, pos: number) => {
    const len = curLine.length
    if (!len || !curLine.trim().length) {
        return curLine + '\n'
    }
    const { char, idx } = getTrimHeader(curLine)!
    if (symbols.includes(char) && curLine[idx + 1] === ' ') {
        if (curLine[idx + 2] !== undefined) {
            return (
                curLine.slice(0, pos) +
                '\n' +
                ' '.repeat(idx) +
                curLine[idx] +
                ' ' +
                curLine.slice(pos)
            )
        } else {
            return '\n' + ''
        }
    }
    return curLine.slice(0, pos) + '\n' + curLine.slice(pos)
}
export const getTabContext = (lastLine: string, curLine: string) => {
    if (!lastLine.trim().length || !curLine.trim().length) {
        return curLine
    }
    const { char: lastChar, idx: lastIdx } = getTrimHeader(lastLine)!
    const { char: curChar, idx: curIdx } = getTrimHeader(curLine)!
    if (
        lastChar !== symbols[1] ||
        curChar !== symbols[1] ||
        lastLine[lastIdx + 1] !== ' ' ||
        curLine[curIdx + 1] !== ' '
    ) {
        return curLine
    }
    return ' '.repeat(curIdx + 2) + curLine
}
