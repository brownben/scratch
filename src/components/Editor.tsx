import React, { useState } from 'react'

interface props {
  initialValue: string
  onChange: (value: string) => void
}

export default ({ initialValue, onChange }: props) => {
  const [input, setInput] = useState(initialValue)

  const valueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    onChange(event.target.value)
  }

  return (
    <form className="flex flex-col w-full h-1/2 md:h-1/3">
      <h2 className="my-4 font-sans text-2xl font-bold">Input:</h2>
      <label htmlFor="input" className="sr-only">
        Markdown Input
      </label>
      <textarea
        name="input"
        id="input"
        value={input}
        className="flex-grow w-full h-full px-3 py-2 font-sans text-base transition duration-300 ease-in-out bg-white border border-blue-300 rounded outline-none appearance-none focus:border-blue-500 focus:shadow-outline"
        onChange={valueChange}
      />
    </form>
  )
}
