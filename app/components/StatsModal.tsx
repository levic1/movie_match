'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Activity, Film, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StatsModal({ userId, onClose }: { userId: string, onClose: () => void }) {
  const supabase = createClient()
  const [stats, setStats] = useState({ swipes: 0, likes: 0, topGenre: 'Analyzing...' })
  
  useEffect(() => {
    async function fetchStats() {
      const { data: history } = await supabase
        .from('swipes')
        .select('is_like, movies(genres)')
        .eq('user_id', userId)

      if (!history) return

      const totalSwipes = history.length
      const likes = history.filter(h => h.is_like).length
      
      const genreCounts: Record<string, number> = {}
      history.filter(h => h.is_like).forEach((h: any) => {
        let gList = h.movies?.genres
        if (typeof gList === 'string') {
            try { gList = JSON.parse(gList) } catch(e) { gList = [] }
        }
        if (Array.isArray(gList)) {
            gList.forEach((g: string) => genreCounts[g] = (genreCounts[g] || 0) + 1)
        }
      })
      
      const topGenre = Object.keys(genreCounts).reduce((a, b) => 
        genreCounts[a] > genreCounts[b] ? a : b, 'None yet')

      setStats({ swipes: totalSwipes, likes, topGenre })
    }
    fetchStats()
  }, [userId])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* CHANGE 1: Increased max-width for horizontal layout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-3xl bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl relative bg-gradient-to-br from-gray-900 to-black"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Your Movie DNA
            </h2>
            <p className="text-gray-400">A snapshot of your taste profile.</p>
        </div>

        {/* CHANGE 2 & 4: Horizontal grid (3 columns) on medium screens and up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat 1: Activity */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-all">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Activity className="h-6 w-6" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stats.swipes}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Swipes</div>
            </div>

            {/* Stat 2: Likes */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center group hover:border-pink-500/30 transition-all">
                <div className="p-3 bg-pink-500/10 text-pink-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6" />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stats.likes}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Liked Movies</div>
            </div>

            {/* Stat 3: Top Genre (CHANGE 3: Removed col-span-2) */}
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 flex flex-col items-center justify-center text-center group hover:border-purple-500/40 transition-all">
                <div className="p-3 bg-white/10 text-white rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Film className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-white mb-1 capitalize">{stats.topGenre}</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Top Genre</div>
            </div>
        </div>
      </motion.div>
    </div>
  )
}