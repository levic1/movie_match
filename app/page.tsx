import { createClient } from '@/lib/supabase/server'
import LandingPage from './components/LandingPage' // We'll move your old code here
import Sidebar from './components/Sidebar'
// import CardStack from './components/CardStack' // We'll build this next!
import CardStack from './components/cardstack'


export default function Home() {
  // No auth checks needed here anymore. 
  // Just show the landing page to everyone.
  return <LandingPage />
}