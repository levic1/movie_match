'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Film, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

// 1. VERIFIED POSTER LIST (High Quality)
const MOVIE_POSTERS = [
  "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // Shawshank
  "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // Godfather
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // Dark Knight
  "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", // Pulp Fiction
  "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", // Fight Club
  "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", // Forrest Gump
  "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", // Matrix
  "https://image.tmdb.org/t/p/w500/6oom5QZlA9JanD89h1bd9W3E60q.jpg", // LOTR
  "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUKGnSxQbUgZ.jpg", // Spirited Away
  "https://image.tmdb.org/t/p/w500/gEU2QniL6E8AHtMY4kRFW8154L.jpg", // Interstellar
  "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", // Parasite
  "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTmeOfRWmbZVgU6V.jpg"  // Whiplash
]

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/discover')
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/discover')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  if (!isMounted) return null

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white overflow-hidden">
      
      {/* --- LEFT SIDE: LOGIN FORM --- */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-8 sm:px-16 lg:px-24 relative z-20 bg-[#050505]">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="font-medium">Back to Home</span>
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md mx-auto"
        >
            {/* Logo Section */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-6">
                    <Sparkles className="h-3 w-3" />
                    <span>Join 10,000+ Movie Buffs</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back</h1>
                <p className="text-gray-400 text-lg">Sign in to continue your watch streak.</p>
            </div>

            {/* --- SUPABASE AUTH WIDGET --- */}
            <div className="bg-[#0a0a0a] border border-white/10 p-1 rounded-2xl">
                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#7c3aed', // Violet
                                    brandAccent: '#6d28d9',
                                    inputText: 'white',
                                    inputBackground: '#121212',
                                    inputBorder: '#333',
                                    inputPlaceholder: '#555',
                                },
                                radii: {
                                    borderRadiusButton: '12px',
                                    inputBorderRadius: '12px',
                                },
                                space: {
                                    inputPadding: '14px',
                                    buttonPadding: '14px',
                                }
                            }
                        },
                        className: {
                            button: '!bg-white/10 !border-white/10 !text-white hover:!bg-white/20 !font-bold !transition-all !shadow-none hover:!scale-[1.02]',
                            input: '!bg-[#121212] !border-white/10 focus:!border-purple-500 focus:!ring-1 focus:!ring-purple-500/50 !transition-all',
                            label: '!text-gray-400 !text-xs !uppercase !tracking-wider !font-bold !mb-1.5',
                            loader: '!text-purple-500',
                            anchor: '!text-purple-400 hover:!text-purple-300 !transition-colors',
                            divider: '!bg-white/10'
                        }
                    }}
                    theme="dark"
                    providers={[]} // FIX: Empty array removes Google/Github buttons
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                />
            </div>
        </motion.div>

        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      </div>

      {/* --- RIGHT SIDE: ANIMATED POSTER WALL (FIXED) --- */}
      <div className="hidden md:flex w-1/2 bg-[#020202] relative overflow-hidden items-center justify-center border-l border-white/5">
        
        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Poster Grid */}
        <div className="grid grid-cols-3 gap-6 rotate-12 scale-110 opacity-60 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all duration-1000 ease-out">
            {[...MOVIE_POSTERS, ...MOVIE_POSTERS].map((src, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="w-36 h-56 rounded-xl overflow-hidden relative shadow-2xl border border-white/10 group"
                >
                    <img 
                        src={src} 
                        alt="Movie Poster" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        // FIX: Hide broken images automatically
                        onError={(e) => e.currentTarget.style.display = 'none'} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            ))}
        </div>
      </div>

    </div>
  )
}