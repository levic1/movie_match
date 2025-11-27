'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Zap, PlayCircle, Smartphone, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- CONSTANTS (Moved outside so they never cause re-renders) ---
const FEATURES = [
  {
    id: 1,
    title: "AI-Powered Matches",
    desc: "Stop scrolling. Let our vector database find movies that match your exact taste profile.",
    icon: <Zap className="h-6 w-6 text-purple-400" />,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Instant Trailers",
    desc: "Watch high-quality trailers immediately without leaving the app. No more clicking around.",
    icon: <PlayCircle className="h-6 w-6 text-green-400" />,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Mobile Optimized",
    desc: "Swipe, tap, and discover on the go. Designed to feel like a native app on your phone.",
    icon: <Smartphone className="h-6 w-6 text-pink-400" />,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"
  }
]

// FIX: Defined outside component to prevent form reset
const AUTH_APPEARANCE = {
    theme: ThemeSupa,
    variables: {
        default: {
            colors: {
                brand: '#8b5cf6', // Violet-500
                brandAccent: '#7c3aed',
                inputText: '#fff',
                inputBackground: '#0f0f0f',
                inputBorder: '#27272a',
                inputPlaceholder: '#52525b',
            },
            radii: {
                borderRadiusButton: '8px',
                inputBorderRadius: '8px',
            },
            space: {
                inputPadding: '16px',
                buttonPadding: '16px',
            }
        }
    },
    className: {
        button: '!bg-purple-600 hover:!bg-purple-500 !text-white !font-semibold !transition-all !border-0 !shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:!shadow-[0_0_30px_rgba(139,92,246,0.5)]',
        input: '!bg-[#0f0f0f] !border-[#27272a] focus:!border-purple-500 focus:!ring-1 focus:!ring-purple-500/50 !transition-all',
        label: '!text-gray-400 !text-xs !uppercase !font-bold !mb-2',
        anchor: '!text-gray-400 hover:!text-white !transition-colors !underline !underline-offset-4',
        divider: '!bg-white/10'
    }
}

export default function LoginPage() {
  // FIX: Initialize Supabase once
  const [supabase] = useState(() => createClient())
  
  const router = useRouter()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length)
    }, 15000) // <--- CHANGED TO 15 SECONDS
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) router.replace('/discover')
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/discover')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, []) 

  if (!isMounted) return null

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white overflow-hidden">
      
      {/* --- LEFT SIDE: FEATURE SHOWCASE --- */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] overflow-hidden flex-col justify-between p-12 border-r border-white/5">
        
        <AnimatePresence mode="wait">
            <motion.div 
                key={currentFeature}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
                <img 
                    src={FEATURES[currentFeature].image} 
                    alt="Feature Background" 
                    className="w-full h-full object-cover grayscale opacity-50"
                />
            </motion.div>
        </AnimatePresence>

        <div className="relative z-20 flex justify-between items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                MovieTinder
            </div>
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium backdrop-blur-md border border-white/5">
                <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>
        </div>

        <div className="relative z-20 max-w-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                            {FEATURES[currentFeature].icon}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Feature Spotlight</span>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">{FEATURES[currentFeature].title}</h2>
                    <p className="text-lg text-gray-400 leading-relaxed">{FEATURES[currentFeature].desc}</p>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-8">
                {FEATURES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentFeature ? 'w-8 bg-purple-500' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 sm:px-12 relative z-20 bg-[#050505]">
        
        <div className="lg:hidden absolute top-6 left-6">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
            </Link>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
        >
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400">
                    Sign in to continue your cinematic journey.
                </p>
            </div>

            <div className="auth-widget-container">
                <Auth
                    supabaseClient={supabase}
                    appearance={AUTH_APPEARANCE} // Using the external constant
                    theme="dark"
                    providers={[]} 
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                />
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>No Credit Card</span>
                </div>
            </div>

        </motion.div>
      </div>

    </div>
  )
}