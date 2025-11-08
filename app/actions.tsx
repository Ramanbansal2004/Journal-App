// app/actions.tsx
'use server'

import { createAI, getMutableAIState, streamUI } from '@ai-sdk/rsc'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { ReactNode } from 'react'

// === This is our "database" ===
const journalEntries: string[] = []

export type Message = {
    id: string
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

export async function submitUserMessage(prompt: string): Promise<{ id: string, display: ReactNode }> {
  
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: prompt,
    },
  ]);

  const { value } = await streamUI({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o'),
    system: systemPrompt,
    messages: aiState.get(),
    
    text: ({ content }) => {
      return <p>{content}</p>
    },
    tools: {
      addJournalEntry: {
        description: 'Add a new log, note, or reminder to the journal.',
        inputSchema: z.object({
          entry: z.string().describe('The content of the journal entry.'),
        }),
        generate: async function* ({ entry }) {
          yield <p>Saving...</p>
          const result = await addJournalEntry(entry)
          return <p>{result}</p>
        },
      },
      getShoppingList: {
        description: 'Get all items from the journal related to a shopping list or supermarket.',
        inputSchema: z.object({}),
        generate: async function* () {
          yield <p>Checking your list...</p>
          const result = await getShoppingList()
          
          if (typeof result === 'string') {
            return <p>{result}</p>
          }
          
          return <ShoppingListComponent items={result.items} />
        },
      },
    },
  })

  return {
    id: `${Date.now()}`,
    display: value,
  }
}

export const AI = createAI({
  actions: {
    submitUserMessage
  },
  initialUIState: [] as Message[],
  initialAIState: [],
})

// === Shopping List Component ===
function ShoppingListComponent({ items }: { items: string[] }) {
  return (
    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
      <h3 className="font-bold text-blue-800">Your Shopping List:</h3>
      <ul className="list-disc pl-5 mt-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-800">{item}</li>
        ))}
      </ul>
    </div>
  )
}