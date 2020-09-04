import React from 'react'
import { parser, Tag } from '../parser'

interface props {
  input: string
}

const outputTag = (tag: Tag, index: number) => {
  const TagName = tag.tag as keyof JSX.IntrinsicElements
  return <TagName key={index}>{tag.body}</TagName>
}

export default ({ input }: props) => {
  const processedOutput = parser(input)

  return (
    <article className="flex-grow w-full h-full md:mt-6">
      <h2 className="my-4 font-sans text-2xl font-bold">Output:</h2>
      <hr className="mb-4" />
      <div className="prose md:prose-lg">{processedOutput.map(outputTag)}</div>
    </article>
  )
}
