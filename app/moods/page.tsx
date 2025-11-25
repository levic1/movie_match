'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, ArrowLeft, RefreshCw, Play, Star, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'

// The list of available moods to display
const MOODS = [
    { id: 'cheerful', label: '🥰 Cheerful', color: 'from-yellow-400 to-orange-500' },
    { id: 'reflective', label: '🤔 Reflective', color: 'from-blue-400 to-indigo-500' },
    { id: 'gloomy', label: '☁️ Gloomy', color: 'from-gray-400 to-gray-600' },
    { id: 'humorous', label: '😂 Humorous', color: 'from-green-400 to-emerald-500' },
    { id: 'melancholy', label: '🥺 Melancholy', color: 'from-indigo-400 to-purple-500' },
    { id: 'idyllic', label: '🏞️ Idyllic', color: 'from-teal-400 to-cyan-500' },
    { id: 'chill', label: '😎 Chill', color: 'from-blue-300 to-blue-500' },
    { id: 'romantic', label: '😍 Romantic', color: 'from-pink-400 to-rose-500' },
    { id: 'weird', label: '🥴 Weird', color: 'from-purple-400 to-fuchsia-500' },
    { id: 'tense', label: '😬 Tense', color: 'from-red-400 to-orange-500' },
    { id: 'sleepy', label: '😴 Sleepy', color: 'from-indigo-300 to-blue-400' },
    { id: 'angry', label: '😡 Angry', color: 'from-red-500 to-rose-600' },
    { id: 'fearful', label: '😱 Fearful', color: 'from-gray-600 to-black' },
    { id: 'lonely', label: '🚶 Lonely', color: 'from-blue-600 to-gray-700' },
    { id: 'thoughtful', label: '🧐 Thoughtful', color: 'from-sky-400 to-indigo-500' },
    { id: 'thrill-seeking', label: '🎢 Thrill-Seeking', color: 'from-orange-500 to-red-500' },
    { id: 'playful', label: '🥳 Playful', color: 'from-yellow-300 to-green-400' },
];

export default function MoodsPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [movie, setMovie] = useState<any>(null)

  const fetchMovieForMood = async (moodId: string) => {
    setLoading(true);
    setSelectedMood(moodId);
    setMovie(null); // Clear previous movie immediately

    try {
        const res = await fetch('/api/moods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: moodId })
        });
        const data = await res.json();
        if (res.ok) {
            setMovie(data);
        } else {
            console.error("Error fetching movie:", data.error);
            // Optional: handle error state in UI
        }
    } catch (error) {
        console.error("Failed to fetch:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleBack = () => {
      setSelectedMood(null);
      setMovie(null);
  }

  const handleNext = () => {
      if (selectedMood) {
          fetchMovieForMood(selectedMood);
      }
  }

  // Extract year from release date string (YYYY-MM-DD)
  const getYear = (dateStr: string) => dateStr?.split('-')[0] || 'N/A';

  // Format runtime from minutes to Xh Ym
  const formatRuntime = (mins: number) => {
      if (!mins) return 'N/A';
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* --- NAVBAR (Simplified) --- */}
      <nav className="w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                MoodMatcher
            </span>
          </div>
          <div className="w-24"></div> {/* Spacer to balance navbar */}
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-6 z-10">
        
        <AnimatePresence mode="wait">
            {/* VIEW 1: MOOD GRID SELECTION */}
            {!selectedMood && !loading ? (
                <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Discover movies based on your mood</h1>
                    <p className="text-xl text-gray-400 mb-12">How are you feeling right now?</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MOODS.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => fetchMovieForMood(mood.id)}
                                className="group relative overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                {/* Gradient Border Effect */}
                                <span className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-30 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></span>
                                {/* Button Content */}
                                <span className="relative flex items-center justify-center h-full w-full bg-[#1a1a1a] hover:bg-[#222] transition-colors rounded-xl px-6 py-4 text-lg font-bold">
                                    {mood.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : null}

            {/* VIEW 2: LOADING STATE */}
            {loading ? (
                 <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center"
                >
                    <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                    <p className="text-xl text-purple-300 font-medium animate-pulse">Finding the perfect movie...</p>
                </motion.div>
            ) : null}

            {/* VIEW 3: MOVIE RESULT */}
            {movie && !loading ? (
                <motion.div 
                    key="movie"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Trailer Embed Header */}
                    <div className="aspect-video w-full bg-black relative">
                        {movie.trailer_key ? (
                            <iframe 
                                src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <div 
                                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})` }}
                                className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
                            >
                                <div className="absolute inset-0 bg-black/50" />
                                <div className="flex flex-col items-center z-10 relative">
                                    <Play className="h-16 w-16 text-white/70 mb-2" />
                                    <p className="text-white/90 font-bold">No Trailer Available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Movie Info Section */}
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Calendar className="h-3 w-3" /> {getYear(movie.release_date)}</span>
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Clock className="h-3 w-3" /> {formatRuntime(movie.runtime)}</span>
                                    <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-bold"><Star className="h-3 w-3 fill-yellow-500" /> {movie.vote_average.toFixed(1)}/10</span>
                                    {movie.certification && <span className="border border-white/20 px-2 py-1 rounded text-xs">{movie.certification}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.slice(0, 4).map((genre: string, index: number) => (
                                <span key={index} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 line-clamp-4 hover:line-clamp-none transition-all">
                            {movie.overview}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleBack}
                                className="flex-1 px-6 py-3 rounded-full font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" /> BACK
                            </button>
                            <button 
                                onClick={handleNext}
                                className="flex-1 px-6 py-3 rounded-full font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white transition-opacity flex items-center justify-center gap-2"
                            >
                                NEXT MOVIE <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}