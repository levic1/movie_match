'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Heart, Film, Activity, User, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

export default function Sidebar({ userId }: { userId: string }) {
  const supabase = createClient()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalSwipes: 0,
    likedCount: 0,
    topGenre: 'N/A',
    likedMovies: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    const { data: history } = await supabase
      .from('swipes')
      .select('is_like, movies(title, genres, poster_path, vote_average)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!history) {
      setLoading(false)
      return
    }

    const likedSwipes = history.filter(h => h.is_like)
    const likedMovies = likedSwipes.map(h => h.movies)

    const genreCounts: Record<string, number> = {}
    likedMovies.forEach((movie: any) => {
        let genres: any[] = []
        if (Array.isArray(movie.genres)) genres = movie.genres
        else if (typeof movie.genres === 'string') {
            try { genres = JSON.parse(movie.genres) } catch(e) {}
        }

        genres.forEach((g: any) => {
            const name = typeof g === 'number' ? GENRE_MAP[g] : g
            if(name) genreCounts[name] = (genreCounts[name] || 0) + 1
        })
    })

    const topGenre = Object.keys(genreCounts).reduce((a, b) => 
      genreCounts[a] > genreCounts[b] ? a : b, 'N/A'
    )

    setStats({
      totalSwipes: history.length,
      likedCount: likedSwipes.length,
      topGenre,
      likedMovies
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-full md:w-[400px] flex-shrink-0 border-l border-white/10 bg-[#0a0a0a] flex flex-col h-[50vh] md:h-screen relative z-20 shadow-xl">
        
        {/* Header Profile */}
        <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <User className="text-white h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">My Collection</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-purple-300 font-mono">
                                {stats.topGenre} Fan
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={handleSignOut} className="text-gray-500 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{stats.totalSwipes}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Swipes</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-pink-500">{stats.likedCount}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Matches</span>
                </div>
            </div>
        </div>

        {/* Liked Movies Grid */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#080808]">
            <div className="flex items-center justify-between px-6 py-4">
                <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-600 fill-pink-600" /> Your Matches
                </h3>
                <button onClick={fetchStats} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Refresh
                </button>
            </div>
            
            {/* FIX: ADDED CLASSES TO HIDE SCROLLBAR */}
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {stats.likedMovies.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-4 opacity-50">
                        <Film className="h-12 w-12 mb-2" />
                        <p className="text-sm">No matches yet.<br/>Start swiping right!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stats.likedMovies.map((movie: any, i) => (
                            <div key={i} className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 cursor-pointer border border-white/5 hover:border-purple-500/50 transition-all">
                                {movie.poster_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                                        alt={movie.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-600">No Image</div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                    <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{movie.title}</p>
                                    <p className="text-[10px] text-yellow-400">★ {movie.vote_average?.toFixed(1)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </aside>
  )
}