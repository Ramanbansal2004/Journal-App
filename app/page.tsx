// app/page.tsx
// This is now a Server Component, so no 'use client'

import { AI } from './actions'       // Import the AI provider
import { JournalChat } from './chat' // Import our new client component

export default function Home() {
  return (
    // 1. Render the AI provider at the top level
    <AI>
      {/* 2. Render the chat component *inside* the provider */}
      <JournalChat />
    </AI>
  )
}