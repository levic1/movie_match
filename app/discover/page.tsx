import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DiscoverClient from './DiscoverClient' // Import the new file

export default async function DiscoverPage() {
  const supabase = await createClient()

  // 1. Check Authentication on the Server
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // 2. Pass the User ID to the Client Component
  return <DiscoverClient userId={session.user.id} />
}