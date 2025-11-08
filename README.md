## Vercel Journal App

An AI-assisted journaling experience built with Next.js App Router and the Vercel AI SDK. Users chat with a journaling assistant that can capture notes, surface shopping-list reminders, and render dynamic UI returned by model-defined tools.

---

## Features
- **Generative UI via AI SDK** – uses `streamUI` to let the model return React elements, including a dynamic shopping list component.
- **Tool-augmented prompts** – defines `addJournalEntry` and `getShoppingList` tools with `zod` schemas to constrain model outputs.
- **React Server Components** – `app/page.tsx` wires the server-side `AI` provider to the client-side `JournalChat` experience.
- **Type-safe interactions** – leverages TypeScript and shared types from `@ai-sdk/rsc` to keep server/client communication predictable.

---

## Project Structure
```
app/
  actions.tsx   // Server actions, tool definitions, AI configuration
  chat.tsx      // Client chat UI that streams responses from AI
  page.tsx      // Root page that wraps chat in the AI provider
  layout.tsx    // Global layout and font setup
public/         // Static assets
```

---

## Prerequisites
- Node.js 18.17+ (recommended: the version Vercel deploys with Next.js 16)
- npm 9+ (or pnpm/yarn/bun; adjust commands accordingly)
- OpenAI API access (or compatible provider that the Vercel AI SDK supports)

---

## Environment Variables
Create `.env.local` at the project root and add:
```
OPENAI_API_KEY=sk-your-key
# Optional: override the default chat model
OPENAI_MODEL=gpt-4o
```

The app uses `createOpenAI` from `@ai-sdk/openai`; any provider-specific settings can be added to that configuration.

---

## Setup & Scripts
Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with the journal assistant.

Other useful scripts:
```bash
npm run lint   # ESLint checks
npm run build  # Production build
npm start      # Run the compiled production server
```

---

## Using the Chat
1. Start the dev server.
2. Open the app and type natural-language journal entries.
3. The assistant stores entries in an in-memory array (`journalEntries`) and can render a shopping list whenever entries mention buying items.

Because the data layer is in-memory, refreshing the server restarts the journal. Swap in your own persistence layer to keep notes across sessions.

---

## Extending the Assistant
- Add new tools in `app/actions.tsx` by registering them in the `tools` object passed to `streamUI`.
- Expand the `systemPrompt` to enforce new behavior or guardrails.
- Replace the dummy data store with a database (e.g., Vercel KV, PostgreSQL) by swapping the helper functions.

---

## Deployment
- Configure the same environment variables on Vercel (Project Settings → Environment Variables).
- Run `npm run build` locally to ensure the project builds cleanly.
- Push to a Git repository and connect it to Vercel; automatic deployments will handle the rest.

---

## Tech Stack
- Next.js 16 (App Router, React Server Components)
- React 19
- Vercel AI SDK (`ai`, `@ai-sdk/openai`)
- TypeScript, Zod, ESLint, Tailwind PostCSS config (fonts via `next/font`)

---

## License & Contributions
This project currently has no explicit license. Feel free to fork and adapt; consider opening issues or PRs if you enhance the assistant or add persistence strategies.
