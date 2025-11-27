'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion' 
import { 
  Film, Zap, Github, ArrowRight, LogOut, BarChart3, 
  Database, Server, Code2, Globe, Cpu, ExternalLink,
  Smartphone, Lock, PlayCircle, Smile, Compass
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DemoCardStack from './DemoCardStack'
import CardStack from './CardStack'
import StatsModal from './StatsModal'
import InfoModal from './InfoModal'
import MoodSelector from './MoodSelector'
import AIChat from './AIChat'

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* --- MOVING BACKGROUND ANIMATION --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
                x: [0, 100, -50, 0],
                y: [0, -50, 100, 0],
                scale: [1, 1.2, 0.9, 1],
                rotate: [0, 45, -45, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] rounded-full bg-gradient-to-r from-purple-800/30 to-pink-800/30 blur-[120px] opacity-50" 
          />
          <motion.div 
            animate={{ 
                x: [0, -70, 30, 0],
                y: [0, 80, -60, 0],
                scale: [1, 1.1, 0.8, 1],
                rotate: [0, -90, 90, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-r from-blue-800/20 to-indigo-800/20 blur-[100px] opacity-40" 
          />
      </div>

      {/* --- NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                MovieMatch
            </span>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-white/10 rounded" />
            ) : user ? (
              <div className="flex items-center gap-3">
                
                {/* NEW: DISCOVER BUTTON */}
                <Link 
                    href="/discover"
                    className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-full transition-all text-sm font-bold shadow-lg hover:shadow-purple-500/20"
                >
                    <Compass className="h-4 w-4 text-white" />
                    <span className="hidden sm:inline">Discover</span>
                </Link>

                <button 
                    onClick={() => setShowStats(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 text-sm font-medium backdrop-blur-md"
                >
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span className="hidden sm:inline">My Stats</span>
                </button>

                <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                </div>

                <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/login" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-md shadow-lg shadow-purple-900/20">
                <Zap className="mr-2 h-3 w-3 fill-purple-400" />
                <span>Powered by AI & TMDB</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mb-6 text-5xl font-extrabold tracking-tight md:text-8xl leading-tight">
                Stop Scrolling. <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm animate-gradient-x">
                    Start Watching.
                </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="mb-10 max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
                Tired of arguing about what to watch? Swipe through movies, build your taste profile, and let our Vector Database find your perfect match tonight.
            </motion.p>

            {!user && (
                <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row justify-center mb-16 relative z-20">
                    <Link 
                        href="/login" 
                        className="group flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:scale-105"
                    >
                        Find My Movie
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a 
                        href="https://github.com/levymarcelo" 
                        target="_blank"
                        className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
                    >
                        <Github className="mr-2 h-5 w-5" />
                        View on GitHub
                    </a>
                </motion.div>
            )}
        </motion.div>

        {/* --- CARD STACK --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative w-full flex flex-col items-center justify-center perspective-1000 mt-8 z-30"
        >
           {loading ? (
             <div className="text-gray-500 animate-pulse">Loading App...</div>
           ) : user ? (
             <div className="relative z-10 scale-110">
                <CardStack userId={user.id} onInfoClick={setSelectedMovie} />
                <p className="mt-8 text-sm text-center text-gray-500 animate-pulse">
                    Swipe Right to Like • Left to Pass
                </p>
             </div>
           ) : (
             <DemoCardStack />
           )}
        </motion.div>
      </section>

      {/* --- SECTION: MOOD MATCHER --- */}
      <section className="relative py-20 border-t border-white/5 bg-[#0a0a0a]/30 z-20 backdrop-blur-sm">
          <MoodSelector />
      </section>

     {/* --- NEW SECTION: WHY USE MOVIETINDER (With Animation) --- */}
      <section className="relative py-24 border-t border-white/5 bg-[#080808] z-20">
        <div className="container mx-auto px-6 text-center">
            {/* Title Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8">
                    <Smile className="h-4 w-4" />
                    <span>Better than scrolling</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white">Why use MovieMatch</h2>
            </motion.div>
            
            {/* Grid Animation (Staggered) */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }} // Triggers when 100px into view
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Feature 1 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><Zap className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Smart AI Matching</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Automatically finds movies mathematically similar to your specific taste profile using vector embeddings.</p>
                </motion.div>
                {/* Feature 2 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform"><BarChart3 className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Built-in Analytics</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Track your swipes, likes, and top genres in real-time with your personal dashboard.</p>
                </motion.div>
                {/* Feature 3 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform"><PlayCircle className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Instant Trailers</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Watch high-quality trailers immediately based on your mood without leaving the app.</p>
                </motion.div>
                {/* Feature 4 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform"><Smartphone className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Mobile Optimized</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Designed to feel like a native app on your phone with smooth, intuitive touch gestures.</p>
                </motion.div>
                {/* Feature 5 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform"><Database className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">TMDB Powered</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Access metadata from the world's largest and most accurate movie database.</p>
                </motion.div>
                {/* Feature 6 */}
                <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gray-500/50 transition-colors flex flex-col items-center text-center group hover:bg-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-gray-500/10 flex items-center justify-center text-gray-400 mb-6 group-hover:scale-110 transition-transform"><Lock className="h-7 w-7" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Privacy First</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">No tracking cookies. Open source code you can inspect yourself on GitHub.</p>
                </motion.div>
            </motion.div>
        </div>
      </section>
      

      {/* --- DEVELOPER & SKILLS SECTION --- */}
      <section className="relative py-24 border-t border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-6">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Built by <span className="text-purple-400">Levy Marcelo</span></h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    Full Stack Developer specializing in high-performance web applications and algorithmic backends.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-200">Next.js 15</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-200">Supabase (PostgreSQL)</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-200">Python (AI)</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-200">Tailwind CSS</span>
                </div>
            </motion.div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-left">
                        <div className="inline-block px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-xs font-bold mb-4">
                            FEATURED PROJECT
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">GoAgriTrading.org</h3>
                        <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                            A digital platform revolutionizing agricultural trading. Connecting farmers directly with markets using efficient algorithms and real-time data.
                        </p>
                        <div className="mb-8">
                            <p className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Powered by MERN Stack:</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-green-500/10 hover:border-green-500/30 transition-colors">
                                    <Database className="h-4 w-4 text-green-400" /> <span className="text-sm">MongoDB</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gray-500/10 hover:border-gray-500/30 transition-colors">
                                    <Server className="h-4 w-4 text-gray-300" /> <span className="text-sm">Express</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors">
                                    <Code2 className="h-4 w-4 text-blue-400" /> <span className="text-sm">React</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-green-600/10 hover:border-green-600/30 transition-colors">
                                    <Cpu className="h-4 w-4 text-green-600" /> <span className="text-sm">Node.js</span>
                                </div>
                            </div>
                        </div>
                        <a href="https://goagritrading.org" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg hover:shadow-green-500/20">
                            Visit Platform <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="flex-1 w-full max-w-sm hidden md:block">
                        <div className="aspect-video rounded-xl bg-gray-800/50 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl backdrop-blur-md">
                             <Globe className="h-24 w-24 text-gray-600 group-hover:text-green-500 transition-colors duration-500" />
                             <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* --- STATS MODAL --- */}
      {showStats && user && (
        <StatsModal userId={user.id} onClose={() => setShowStats(false)} />
      )}
      
      {/* --- INFO MODAL --- */}
      {selectedMovie && (
        <InfoModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
      <AIChat />
    </div>
  )
}