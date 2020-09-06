import { Tag } from './parser'

const isEmphasis = (text: string) =>
  text.match(/^(.*?)_(.*)_(.*?)$/) || text.match(/^(.*?)\*(.*)\*(.*?)$/)
const isBold = (text: string) =>
  text.match(/^(.*?)__(.*)__(.*?)$/) || text.match(/^(.*?)\*\*(.*)\*\*(.*?)$/)

const generateEmphasisTags = (match: RegExpMatchArray): Tag[] => [
  { tag: '', body: inlineParser(match[1]) },
  { tag: 'em', body: inlineParser(match[2]) },
  { tag: '', body: inlineParser(match[3]) },
]

const generateBoldTags = (match: RegExpMatchArray): Tag[] => [
  { tag: '', body: inlineParser(match[1]) },
  { tag: 'strong', body: inlineParser(match[2]) },
  { tag: '', body: inlineParser(match[3]) },
]

const getSummary = (text: string) => ({
  emphasis: isEmphasis(text),
  bold: isBold(text),
})

export const inlineParser = (text: string): string | Tag[] => {
  const summary = getSummary(text)

  if (summary.bold) return generateBoldTags(summary.bold)
  else if (summary.emphasis) return generateEmphasisTags(summary.emphasis)

  return text
}
