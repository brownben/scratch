export interface Tag {
  tag: string
  body: string
}

export const parser = (input: string): Tag[] => {
  const tags: Tag[] = []
  const lines: string[] = input.split('\n')

  let remainingBody = ''
  for (const line of lines) {
    const isHeading = matchesHeading(line)
    const isBlockquote = matchesBlockquote(line)
    const isBlank = matchesBlank(line)

    if ((isHeading || isBlockquote || isBlank) && remainingBody) {
      tags.push({ tag: 'p', body: remainingBody })
      remainingBody = ''
    }

    if (isHeading)
      tags.push({ tag: `h${isHeading[1].length}`, body: isHeading[2] })
    else if (isBlockquote)
      tags.push({ tag: `blockquote`, body: isBlockquote[1] })
    else remainingBody += line
  }

  if (remainingBody) tags.push({ tag: 'p', body: remainingBody })

  return tags
}

const matchesHeading = (line: string) => line.match(/^(#+)\s+(.*)$/)
const matchesBlockquote = (line: string) => line.match(/^>\s+(.*)$/)
const matchesBlank = (line: string) => line.match(/^\s*$/)
