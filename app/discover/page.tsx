import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/app/components/Sidebar' // Adjust path if needed (../components/...)
import CardStack from '@/app/components/cardstack' // Adjust path if needed
import { redirect } from 'next/navigation'

export default async function DiscoverPage() {
  const supabase = await createClient()

  // 1. Check Authentication
  const { data: { session } } = await supabase.auth.getSession()

  // 2. Security Gate: If not logged in, kick them to Login
  if (!session) {
    redirect('/login')
  }

  // 3. Render the Dashboard
  return (
    <div className="flex h-screen bg-[#111] text-white overflow-hidden">
      <Sidebar userId={session.user.id} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-[#111]/50 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Discover
          </h1>
        </header>

        <div className="flex-1 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-[#111] to-[#111]">
            <CardStack userId={session.user.id} />
        </div>
      </main>
    </div>
  )
}