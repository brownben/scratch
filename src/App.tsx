import React, { useState } from 'react'

import Header from './components/Header'
import Editor from './components/Editor'
import Output from './components/Output'

import './tailwind.css'

export default () => {
  const initialValue = 'Hello World!'
  const [input, setInput] = useState(initialValue)

  return (
    <>
      <Header />
      <main className="flex flex-col flex-grow min-h-full pt-2">
        <div className="flex flex-col flex-grow w-full max-w-screen-lg mx-auto">
          <Editor
            initialValue={initialValue}
            onChange={(value: string) => setInput(value)}
          />
          <Output input={input} />
        </div>
      </main>
    </>
  )
}
