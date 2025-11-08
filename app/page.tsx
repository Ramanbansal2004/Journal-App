import { AI } from './actions'
import { JournalChat } from './chat'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-72 translate-x-1/3 bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.18),_transparent_65%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-8 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
            Vercel Journal
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Capture your day with an AI-native journal companion
          </h1>
        </header>

        <AI>
          <JournalChat />
        </AI>
      </div>
    </main>
  )
}