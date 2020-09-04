import React from 'react'

export default ({ input }) => {
  const processedOutput = input.split('\n')
  return (
    <article className="h-full flex-grow w-full md:w-1/2 px-6">
      <h2 className="font-sans font-bold text-2xl my-4">Output:</h2>
      <div className="prose md:prose-lg">
        {processedOutput.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </article>
  )
}
