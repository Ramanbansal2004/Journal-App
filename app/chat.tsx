// app/chat.tsx
'use client'

import { useUIState, useActions } from '@ai-sdk/rsc'
import { 
  useState, 
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from 'react'
import { type AI } from './actions'

type Message = {
  id: string
  display: ReactNode
}

export function JournalChat() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions<typeof AI>()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const currentInput = inputValue.trim()
    if (!currentInput) return
    
    setInputValue('')
    
    setMessages((currentMessages: Message[]) => [
      ...currentMessages,
      { id: `${Date.now()}-user`, display: <p>{currentInput}</p> }
    ])

    const aiResponse = await submitUserMessage(currentInput)
    
    setMessages((currentMessages: Message[]) => [
      ...currentMessages,
      aiResponse
    ])
  }

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <div className="flex-grow space-y-4 mb-4">
        {messages.map((message: Message) => (
          <div key={message.id}>
            {message.display}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask your journal..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </form>
    </div>
  )
}