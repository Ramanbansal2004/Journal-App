import { AI } from './actions'       // Import the AI provider
import { JournalChat } from './chat' // Import our new client component

export default function Home() {
  return (
    <AI>
      <JournalChat />
    </AI>
  )
}