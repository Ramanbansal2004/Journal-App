// app/actions.tsx
'use server'

import { createAI, getMutableAIState, streamUI } from '@ai-sdk/rsc'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { ReactNode } from 'react'

const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// === This is our "database" ===
const journalEntries: string[] = []

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  display: ReactNode
}

async function addJournalEntry(entry: string) {
  journalEntries.push(entry)
  console.log('Current Journal:', journalEntries)
  return `Added "${entry}" to your journal.`
}

 const getShoppingList = async () => {
  const shoppingList = journalEntries.filter(entry =>
    entry.toLowerCase().includes('buy') ||
    entry.toLowerCase().includes('shopping') ||
    entry.toLowerCase().includes('supermarket')
  )

  if (shoppingList.length === 0) {
    return 'Your shopping list is currently empty.'
  }
  return { items: shoppingList }
}

// === BONUS: The Safeguarding Prompt ===
const systemPrompt = `
  You are a helpful journaling assistant. 
  You can ONLY do two things:
  1. Add a new log or reminder to the user's journal.
  2. Retrieve the user's shopping list from their journal.

  If the user asks for *anything* else (like math, facts, or code), 
  politely decline and remind them you are *only* a journal app.
`

export async function submitUserMessage(prompt: string): Promise<ChatMessage> {
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: prompt,
    },
  ]);

  const { value } = await streamUI({
    model: openaiClient.chat(process.env.OPENAI_MODEL ?? 'gpt-4o'),
    system: systemPrompt,
    messages: aiState.get(),
    
    text: ({ content }) => {
      return (
        <p className="whitespace-pre-line leading-relaxed text-slate-800">
          {content}
        </p>
      )
    },
    tools: {
      addJournalEntry: {
        description: 'Add a new log, note, or reminder to the journal.',
        inputSchema: z.object({
          entry: z.string().describe('The content of the journal entry.'),
        }),
        generate: async function* ({ entry }) {
          yield (
            <p className="text-sm text-slate-400">Saving your note…</p>
          )
          const result = await addJournalEntry(entry)
          return (
            <p className="whitespace-pre-line leading-relaxed text-slate-900">
              {result}
            </p>
          )
        },
      },
      getShoppingList: {
        description: 'Get all items from the journal related to a shopping list or supermarket.',
        inputSchema: z.object({}),
        generate: async function* () {
          yield (
            <p className="text-sm text-slate-400">Checking your list…</p>
          )
          const result = await getShoppingList()
          
          if (typeof result === 'string') {
            return (
              <p className="leading-relaxed text-slate-800">
                {result}
              </p>
            )
          }
          
          return <ShoppingListComponent items={result.items} />
        },
      },
    },
  })

  return {
    id: `${Date.now()}`,
    role: 'assistant',
    display: value,
  }
}

export const AI = createAI({
  actions: {
    submitUserMessage
  },
  initialUIState: [] as ChatMessage[],
  initialAIState: [],
})

// === Shopping List Component ===
function ShoppingListComponent({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40 backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
        Shopping List
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 shadow shadow-slate-950/30"
          >
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}