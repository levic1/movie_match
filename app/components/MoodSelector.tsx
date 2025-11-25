'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Play, Star, Clock, Calendar, ArrowLeft, Smile } from 'lucide-react'

// UPDATED LIST: Removed problematic moods (Gloomy, Angry, Weird, Sleepy, Reflective)
const MOODS = [
    { id: 'cheerful', label: '🥰 Cheerful', color: 'from-yellow-400 to-orange-500' },
    { id: 'humorous', label: '😂 Humorous', color: 'from-green-400 to-emerald-500' },
    { id: 'romantic', label: '😍 Romantic', color: 'from-pink-400 to-rose-500' },
    { id: 'chill', label: '😎 Chill', color: 'from-blue-300 to-blue-500' },
    { id: 'thrill-seeking', label: '🎢 Thrill', color: 'from-orange-500 to-red-500' },
    { id: 'fearful', label: '😱 Fearful', color: 'from-gray-600 to-black' },
    { id: 'tense', label: '😬 Tense', color: 'from-red-400 to-orange-500' },
    { id: 'melancholy', label: '🥺 Melancholy', color: 'from-indigo-400 to-purple-500' },
    { id: 'idyllic', label: '🏞️ Idyllic', color: 'from-teal-400 to-cyan-500' },
    { id: 'playful', label: '🥳 Playful', color: 'from-yellow-300 to-green-400' },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [movie, setMovie] = useState<any>(null)

  const fetchMovieForMood = async (moodId: string) => {
    setLoading(true);
    setSelectedMood(moodId);
    setMovie(null);

    try {
        const res = await fetch('/api/moods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: moodId })
        });
        const data = await res.json();
        if (res.ok) setMovie(data);
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

  const getYear = (dateStr: string) => dateStr?.split('-')[0] || 'N/A';
  const formatRuntime = (mins: number) => {
      if (!mins) return 'N/A';
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
            {!selectedMood ? (
                <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                >
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                            <Smile className="h-4 w-4" />
                            <span>Mood Matcher</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">How are you feeling?</h2>
                        <p className="text-xl text-gray-400">Select a mood and we'll pick the perfect movie trailer for you.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {MOODS.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => fetchMovieForMood(mood.id)}
                                className="group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:z-10"
                            >
                                <span className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></span>
                                <span className="relative flex items-center justify-center h-24 w-full bg-[#111] group-hover:bg-[#1a1a1a] transition-colors rounded-2xl px-2 text-lg md:text-xl font-bold text-white">
                                    {mood.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="player"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <button 
                        onClick={handleBack}
                        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white font-bold transition-all border border-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>

                    {loading ? (
                        <div className="aspect-video w-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                             <RefreshCw className="h-10 w-10 text-purple-500 animate-spin mb-4" />
                             <p className="text-purple-300 animate-pulse">Finding a matching movie...</p>
                        </div>
                    ) : movie ? (
                        <div>
                            <div className="aspect-video w-full bg-black relative">
                                {movie.trailer_key ? (
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`} 
                                        title="YouTube player" 
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div 
                                        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                                        className="w-full h-full bg-cover bg-center flex items-center justify-center"
                                    >
                                        <div className="absolute inset-0 bg-black/50" />
                                        <div className="flex flex-col items-center z-10 text-white">
                                            <Play className="h-12 w-12 opacity-80 mb-2" />
                                            <p>No Trailer Available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 md:p-8 bg-[#1a1a1a]">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{movie.title}</h2>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Calendar className="h-3 w-3" /> {getYear(movie.release_date)}</span>
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Clock className="h-3 w-3" /> {formatRuntime(movie.runtime)}</span>
                                            <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-bold"><Star className="h-3 w-3 fill-yellow-500" /> {movie.vote_average.toFixed(1)}</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>
                                    </div>
                                    <button 
                                        onClick={() => fetchMovieForMood(selectedMood!)}
                                        className="px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2 border border-white/5 whitespace-nowrap"
                                    >
                                        Next Recommendation <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center h-64">
                            <p className="text-red-400 mb-4">Failed to load movie.</p>
                            <button 
                                onClick={() => fetchMovieForMood(selectedMood!)}
                                className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  )
}