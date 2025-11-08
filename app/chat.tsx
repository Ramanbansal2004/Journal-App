// app/chat.tsx
'use client'

import { useUIState, useActions } from '@ai-sdk/rsc'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { type AI, type ChatMessage } from './actions'

export function JournalChat() {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions<typeof AI>()
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const currentInput = inputValue.trim()
    if (!currentInput) return

    setInputValue('')
    setMessages((currentMessages: ChatMessage[]) => [
      ...currentMessages,
      {
        id: `${Date.now()}-user`,
        role: 'user',
        display: <p className="whitespace-pre-line">{currentInput}</p>,
      },
    ])

    setIsSubmitting(true)
    try {
      const aiResponse = await submitUserMessage(currentInput)
      setMessages((currentMessages: ChatMessage[]) => [
        ...currentMessages,
        aiResponse,
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-100/95 via-white/95 to-slate-50/95 shadow-[0_35px_80px_-45px_rgba(14,116,144,0.55)] ring-1 ring-sky-200/50 backdrop-blur-xl"
        style={{ minHeight: '26rem', maxHeight: '72vh' }}
      >
        <div className="pointer-events-none absolute inset-x-6 top-4 h-24 rounded-full bg-gradient-to-b from-sky-300/40 via-sky-200/15 to-transparent blur-3xl" />
        <div className="flex items-center justify-between border-b border-sky-100/80 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-500">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Journal Companion
              </p>
              <p className="text-xs text-slate-500">
                Always on, always listening
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 shadow-sm">
            Online
          </span>
        </div>

        <div className="chat-scroll flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-sky-100/80 bg-white/85 px-6 py-5 backdrop-blur"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-sky-100/80 bg-white/90 px-4 py-3 shadow-inner shadow-sky-100 focus-within:border-sky-400">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Tell your assistant what's on your mind…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              disabled={isSubmitting || inputValue.trim().length === 0}
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h13" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-3xl border px-5 py-4 text-sm leading-relaxed ${
          isUser
            ? 'border-sky-300 bg-sky-100 text-slate-900 shadow-lg shadow-sky-200/50'
            : 'border-slate-200 bg-white text-slate-800 shadow-lg shadow-slate-200/60'
        }`}
      >
        {message.display}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-white/85 px-8 py-16 text-center text-slate-500 shadow-inner">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/15 text-2xl">
        💡
      </div>
      <h2 className="text-lg font-semibold text-slate-800">
        Start your personal journal
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Share a moment from your day, log a reminder, or ask for your current
        shopping list. I’ll organize everything for you.
      </p>
    </div>
  )
}