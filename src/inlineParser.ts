import { Tag } from './parser'

const isEmphasis = (text: string) =>
  text.match(/^(.*?)_(.*)_(.*?)$/) || text.match(/^(.*?)\*(.*)\*(.*?)$/)
const isBold = (text: string) =>
  text.match(/^(.*?)__(.*)__(.*?)$/) || text.match(/^(.*?)\*\*(.*)\*\*(.*?)$/)
const isStrikethrough = (text: string) => text.match(/^(.*?)~~(.*)~~(.*?)$/)
const isCode = (text: string) => text.match(/^(.*?)`(.*)`(.*?)$/)

const generateTags = (tag: string, match: RegExpMatchArray): Tag[] => [
  { tag: '', body: inlineParser(match[1]) },
  { tag, body: inlineParser(match[2]) },
  { tag: '', body: inlineParser(match[3]) },
]

const getSummary = (text: string) => ({
  emphasis: isEmphasis(text),
  bold: isBold(text),
  strikethrough: isStrikethrough(text),
  code: isCode(text),
})

export const inlineParser = (text: string): string | Tag[] => {
  const summary = getSummary(text)

  if (summary.bold) return generateTags('bold', summary.bold)
  else if (summary.emphasis) return generateTags('em', summary.emphasis)
  else if (summary.strikethrough)
    return generateTags('del', summary.strikethrough)
  else if (summary.code) return generateTags('code', summary.code)
  return text
}
