export interface Tag {
  tag: string
  body: string | Tag[]
}

export const parser = (input: string): Tag[] => {
  const tags: Tag[] = []
  const lines: string[] = input.split('\n')

  let remainingBody = ''
  let currentWrapper: Tag | null = null

  for (const line of lines) {
    const {
      isHeading,
      isBlockquote,
      isHorizontalRule,
      isOrderedListItem,
      isUnorderedListItem,
      isCodeBlock,
      flushPrevious,
    } = checkLine(line)

    if (
      (currentWrapper && !isOrderedListItem && currentWrapper.tag === 'ol') ||
      (currentWrapper && !isUnorderedListItem && currentWrapper.tag === 'ul')
    ) {
      tags.push(currentWrapper)
      currentWrapper = null
    }

    if (flushPrevious && remainingBody && currentWrapper?.tag !== 'pre') {
      tags.push({ tag: 'p', body: remainingBody })
      remainingBody = ''
    }

    if (currentWrapper?.tag === 'pre' && !isCodeBlock)
      remainingBody += line + '\n'
    else if (isHeading)
      tags.push({ tag: `h${isHeading[1].length}`, body: isHeading[2] })
    else if (isBlockquote)
      tags.push({ tag: `blockquote`, body: isBlockquote[1] })
    else if (isHorizontalRule) tags.push({ tag: `hr`, body: '' })
    else if (
      isOrderedListItem &&
      currentWrapper?.tag === 'ol' &&
      Array.isArray(currentWrapper.body)
    )
      currentWrapper.body.push({
        tag: 'li',
        body: isOrderedListItem[1],
      })
    else if (
      isUnorderedListItem &&
      currentWrapper?.tag === 'ul' &&
      Array.isArray(currentWrapper.body)
    )
      currentWrapper.body.push({
        tag: 'li',
        body: isUnorderedListItem[1],
      })
    else if (isUnorderedListItem)
      currentWrapper = {
        tag: 'ul',
        body: [{ tag: 'li', body: isUnorderedListItem[1] }],
      }
    else if (isOrderedListItem)
      currentWrapper = {
        tag: 'ol',
        body: [{ tag: 'li', body: isOrderedListItem[1] }],
      }
    else if (
      currentWrapper &&
      isCodeBlock &&
      currentWrapper?.tag === 'pre' &&
      Array.isArray(currentWrapper.body)
    ) {
      currentWrapper.body.push({ tag: 'code', body: remainingBody.trim() })
      remainingBody = ''
      tags.push(currentWrapper)
      currentWrapper = null
    } else if (isCodeBlock)
      currentWrapper = {
        tag: 'pre',
        body: [],
      }
    else remainingBody += line
  }

  if (currentWrapper?.tag === 'pre' && Array.isArray(currentWrapper.body)) {
    currentWrapper.body.push({ tag: 'code', body: remainingBody.trim() })
    remainingBody = ''
    tags.push(currentWrapper)
  } else if (currentWrapper) tags.push(currentWrapper)
  if (remainingBody) tags.push({ tag: 'p', body: remainingBody })

  return tags
}

const matchesHeading = (line: string) => line.match(/^(#+)\s+(.*)$/)
const matchesBlockquote = (line: string) => line.match(/^>\s+(.*)$/)
const matchesHorizontalRule = (line: string) => line.match(/^---$/)
const matchesOrderedListItem = (line: string) => line.match(/^[0-9]+\.\s+(.*)$/)
const matchesUnorderedListItem = (line: string) => line.match(/^-\s+(.*)$/)
const matchesCodeBlock = (line: string) => line.match(/^```(.*)\s*$/)
const matchesBlank = (line: string) => line.match(/^\s*$/)

interface LineSummary {
  isHeading: RegExpMatchArray | null
  isBlockquote: RegExpMatchArray | null
  isHorizontalRule: RegExpMatchArray | null
  isOrderedListItem: RegExpMatchArray | null
  isUnorderedListItem: RegExpMatchArray | null
  isCodeBlock: RegExpMatchArray | null
  isBlank: RegExpMatchArray | null
  flushPrevious?: RegExpMatchArray | null
}
const checkLine = (line: string) => {
  const data = {
    isHeading: matchesHeading(line),
    isBlockquote: matchesBlockquote(line),
    isHorizontalRule: matchesHorizontalRule(line),
    isOrderedListItem: matchesOrderedListItem(line),
    isUnorderedListItem: matchesUnorderedListItem(line),
    isCodeBlock: matchesCodeBlock(line),
    isBlank: matchesBlank(line),
  } as LineSummary

  data.flushPrevious =
    data.isHeading ||
    data.isBlockquote ||
    data.isHorizontalRule ||
    data.isOrderedListItem ||
    data.isUnorderedListItem ||
    data.isBlank

  return data
}
