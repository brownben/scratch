import { inlineParser } from './inlineParser'

export interface Tag {
  tag: string
  body: string | Tag[]
}

export class Parser {
  lines: string[]
  tags: Tag[] = []

  currentWrapper: Tag | null = null
  remainingBody: string = ''

  constructor(input: string) {
    this.lines = input.split('\n')
  }

  addTag(tagName: string, body: string): Tag {
    this.tags.push({
      tag: tagName,
      body: inlineParser(body),
    })
  }

  addHeading(isHeading: RegExpMatchArray) {
    const level = isHeading[1].length
    if (level <= 6) this.addTag(`h${level}`, isHeading[2])
    else this.addTag('p', isHeading[2])
  }
  addBlockquote(isBlockquote: RegExpMatchArray) {
    this.addTag('blockquote', isBlockquote[1])
  }
  addHorizontalRule() {
    this.addTag('hr', '')
  }
  addList(type: string, firstItem: string) {
    this.currentWrapper = {
      tag: type,
      body: [{ tag: 'li', body: firstItem }],
    }
  }
  addListItem(item: string) {
    if (this.currentWrapper && Array.isArray(this.currentWrapper?.body))
      this.currentWrapper.body.push({ tag: 'li', body: inlineParser(item) })
    else if (this.currentWrapper)
      this.currentWrapper.body = [{ tag: 'li', body: inlineParser(item) }]
  }
  openCodeBlock() {
    this.currentWrapper = { tag: 'pre', body: [] }
  }
  addCodeBlockLine(line: Line) {
    if (line.isCodeBlock()) this.closeCodeBlock()
    else this.remainingBody += `${line}\n`
  }
  closeCodeBlock() {
    if (this.currentWrapper) {
      this.currentWrapper.body = [
        {
          tag: 'code',
          body: this.remainingBody.trim(),
        },
      ]
      this.remainingBody = ''
      this.flushCurrentWrapper()
    }
  }

  flushCurrentWrapper() {
    if (this.currentWrapper) this.tags.push(this.currentWrapper)
    this.currentWrapper = null
  }
  flushRemainingBody() {
    if (this.remainingBody) this.addTag('p', this.remainingBody)
    this.remainingBody = ''
  }

  inBlock(tag: string) {
    return this.currentWrapper?.tag === tag
  }

  getTags() {
    for (const rawLine of this.lines) {
      const line = new Line(rawLine)
      const {
        isHeading,
        isBlockquote,
        isHorizontalRule,
        isUnorderedListItem,
        isOrderedListItem,
        isCodeBlock,
      } = line.getLineSummary()

      if (
        (!isOrderedListItem && this.inBlock('ol')) ||
        (!isUnorderedListItem && this.inBlock('ul'))
      )
        this.flushCurrentWrapper()
      else if (line.isNewElement() && !this.inBlock('pre'))
        this.flushRemainingBody()

      if (this.inBlock('pre')) this.addCodeBlockLine(line)
      else if (isHeading) this.addHeading(isHeading)
      else if (isBlockquote) this.addBlockquote(isBlockquote)
      else if (isHorizontalRule) this.addHorizontalRule()
      else if (this.inBlock('ol') && isOrderedListItem)
        this.addListItem(isOrderedListItem[1])
      else if (this.inBlock('ul') && isUnorderedListItem)
        this.addList('ul', isUnorderedListItem[1])
      else if (isOrderedListItem) this.addList('ol', isOrderedListItem[1])
      else if (isUnorderedListItem) this.addList('ul', isUnorderedListItem[1])
      else if (isCodeBlock) this.openCodeBlock()
      else this.remainingBody += line.getRaw()
    }

    if (this.inBlock('pre')) this.closeCodeBlock()
    else if (this.currentWrapper) this.flushCurrentWrapper()

    if (this.remainingBody) this.flushRemainingBody()

    return this.tags
  }
}

class Line {
  line: string

  constructor(line: string) {
    this.line = line
  }

  isHeading() {
    return this.line.match(/^(#+)\s+(.*)$/)
  }
  isBlockquote() {
    return this.line.match(/^>\s+(.*)$/)
  }
  isHorizontalRule() {
    return this.line.match(/^---$/)
  }
  isOrderedListItem() {
    return this.line.match(/^[0-9]+\.\s+(.*)$/)
  }
  isUnorderedListItem() {
    return this.line.match(/^-\s+(.*)$/)
  }
  isCodeBlock() {
    return this.line.match(/^```(.*)\s*$/)
  }
  isBlank() {
    return this.line.match(/^\s*$/)
  }

  isNewElement() {
    return (
      this.isHeading() ||
      this.isBlockquote() ||
      this.isHorizontalRule() ||
      this.isOrderedListItem() ||
      this.isUnorderedListItem() ||
      this.isCodeBlock() ||
      this.isBlank()
    )
  }

  getRaw() {
    return this.line
  }

  getLineSummary() {
    return {
      isHeading: this.isHeading(),
      isBlockquote: this.isBlockquote(),
      isHorizontalRule: this.isHorizontalRule(),
      isOrderedListItem: this.isOrderedListItem(),
      isUnorderedListItem: this.isUnorderedListItem(),
      isCodeBlock: this.isCodeBlock(),
      isBlank: this.isBlank(),
    } as LineSummary
  }
}

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
