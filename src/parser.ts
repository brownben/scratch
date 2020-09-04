export interface Tag {
  tag: string
  body?: string
}

export const parser = (input: string): Tag[] => {
  const tags: Tag[] = []
  const lines: string[] = input.split('\n')

  let remainingBody = ''
  for (const line of lines) {
    const {
      isHeading,
      isBlockquote,
      isHorizontalRule,
      flushPrevious,
    } = checkLine(line)

    if (flushPrevious && remainingBody) {
      tags.push({ tag: 'p', body: remainingBody })
      remainingBody = ''
    }

    if (isHeading)
      tags.push({ tag: `h${isHeading[1].length}`, body: isHeading[2] })
    else if (isBlockquote)
      tags.push({ tag: `blockquote`, body: isBlockquote[1] })
    else if (isHorizontalRule) tags.push({ tag: `hr` })
    else remainingBody += line
  }

  if (remainingBody) tags.push({ tag: 'p', body: remainingBody })

  return tags
}

const matchesHeading = (line: string) => line.match(/^(#+)\s+(.*)$/)
const matchesBlockquote = (line: string) => line.match(/^>\s+(.*)$/)
const matchesBlank = (line: string) => line.match(/^\s*$/)
const matchesHorizontalRule = (line: string) => line.match(/^\s*---\s*$/)

interface LineSummary {
  isHeading: RegExpMatchArray | null
  isBlockquote: RegExpMatchArray | null
  isHorizontalRule: RegExpMatchArray | null
  isBlank: RegExpMatchArray | null
  flushPrevious?: RegExpMatchArray | null
}
const checkLine = (line: string) => {
  const data = {
    isHeading: matchesHeading(line),
    isBlockquote: matchesBlockquote(line),
    isHorizontalRule: matchesHorizontalRule(line),
    isBlank: matchesBlank(line),
  } as LineSummary

  data.flushPrevious =
    data.isHeading || data.isBlockquote || data.isBlank || data.isHorizontalRule

  return data
}
