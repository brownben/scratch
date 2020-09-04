import React, { useState } from 'react'

export default ({ initialValue, onChange }) => {
  const [input, setInput] = useState(initialValue)

  const valueChange = (event) => {
    setInput(event.target.value)
    onChange(event.target.value)
  }

  return (
    <form className="min-h-1/2 flex flex-col w-full md:w-1/2 px-6">
      <h2 className="font-sans font-bold text-2xl my-4">Input:</h2>
      <label htmlFor="input" className="sr-only">
        Markdown Input
      </label>
      <textarea
        name="input"
        id="input"
        value={input}
        className="w-full bg-white border border-blue-300 rounded py-2 px-3 text-base font-sans outline-none focus:border-blue-500 flex-grow focus:shadow-outline appearance-none h-full md:mb-4"
        onChange={valueChange}
      />
    </form>
  )
}
