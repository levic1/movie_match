'use client'

import { X, Calendar, Film, Users, Star } from 'lucide-react'

// 1. THE TRANSLATION DICTIONARY (TMDB IDs -> Names)
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
}

interface MovieDetails {
  title: string
  overview: string
  poster_path: string
  genres: any[] | string // Can be numbers (IDs) or strings
  release_date?: string  // Optional now
  vote_average: number   // Added this
  cast_members: string[] | string 
}

export default function InfoModal({ movie, onClose }: { movie: MovieDetails, onClose: () => void }) {
  
  // Helper: safely extract arrays
  const parseArray = (data: any): any[] => {
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
        try { return JSON.parse(data) } catch(e) { return [] }
    }
    return []
  }

  // 2. LOGIC: Convert IDs to Names
  const rawGenres = parseArray(movie.genres)
  const genreNames = rawGenres.map(g => {
    // If it's already a name, keep it. If it's an ID, translate it.
    return typeof g === 'number' ? GENRE_MAP[g] : g
  }).filter(Boolean) // Remove any undefined translations

  const cast = parseArray(movie.cast_members)

  // Helper: Format Date
  const getFormattedDate = () => {
    if (!movie.release_date) return null
    return new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
  }
  const displayDate = getFormattedDate()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Layout Container */}
      <div className="w-full max-w-5xl bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white/70 hover:text-white transition-colors hover:bg-red-500/20"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left: Poster (Fixed Width on Desktop) */}
        <div className="w-full md:w-[40%] h-64 md:h-auto relative shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Right: Content (Scrollable) */}
        <div className="w-full md:w-[60%] p-6 md:p-10 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {movie.title}
          </h2>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
            {/* Genres */}
            {genreNames.slice(0, 3).map((g, i) => (
               <span key={i} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/20">
                 {g}
               </span>
            ))}

            {/* Rating */}
            {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20">
                    <Star className="h-3 w-3 fill-yellow-500" />
                    {movie.vote_average.toFixed(1)}
                </span>
            )}

            {/* Date (Only shows if exists) */}
            {displayDate && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                    <Calendar className="h-3 w-3" />
                    {displayDate}
                </span>
            )}
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-2 opacity-70">Synopsis</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
                {movie.overview || "No synopsis available for this movie."}
            </p>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white uppercase mb-3 tracking-wider opacity-70">
                <Users className="h-4 w-4" /> Starring
              </h3>
              <div className="flex flex-wrap gap-2">
                {cast.slice(0, 5).map((actor: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-[#1a1a1a] border border-white/5 rounded-lg text-sm text-gray-200">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}