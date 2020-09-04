import React from 'react'
import { parser, Tag } from '../parser'

interface props {
  input: string
}

const processTags = (tags: Tag[], level: string) =>
  tags.map((tag, index) => outputTag(tag, index, level))

const outputTag = (tag: Tag, index: number, level: string) => {
  const TagName = tag.tag as keyof JSX.IntrinsicElements
  const key = `${level}-${index}`
  if (!tag.body) return <TagName key={key} />
  else if (typeof tag.body === 'string')
    return <TagName key={key}>{tag.body}</TagName>
  else
    return (
      <TagName key={key}>
        {processTags(tag.body, `${level}-${index}-${tag.tag}`)}
      </TagName>
    )
}

export default ({ input }: props) => {
  const abstractSyntaxTree = parser(input)

  return (
    <article className="flex-grow w-full h-full md:mt-6">
      <h2 className="my-4 font-sans text-2xl font-bold">Output:</h2>
      <hr className="mb-4" />
      <div className="mx-auto prose max-w-none md:prose-lg">
        {processTags(abstractSyntaxTree, 'root')}
      </div>
    </article>
  )
}
