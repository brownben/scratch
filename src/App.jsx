import React, { useState } from 'react'

import Header from './components/Header'
import Editor from './components/Editor'
import Output from './components/Output'
import Footer from './components/Footer'

import './tailwind.css'

export default () => {
  const initialValue = 'Hello World!'
  const [input, setInput] = useState(initialValue)

  return (
    <>
      <Header />
      <main className="pt-2 min-h-full flex flex-col flex-grow">
        <div className="max-w-screen-lg w-full flex-grow mx-auto flex flex-col md:flex-row">
          <Editor
            initialValue={initialValue}
            onChange={(value) => setInput(value)}
          />
          <Output input={input} />
        </div>
      </main>
      <Footer />
    </>
  )
}
