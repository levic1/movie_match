'use client'

import React, { useState, useEffect, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { X, Heart, Info, Star, RefreshCw } from 'lucide-react'

// FIX: Add onInfoClick to props so we can open the modal in the parent
export default function CardStack({ userId, onInfoClick }: { userId: string, onInfoClick: (movie: any) => void }) {
  const [movies, setMovies] = useState<any[]>([])
  const [lastDirection, setLastDirection] = useState<string>()
  const cardRefs = useRef<any[]>([])
  const isFetching = useRef(false) 

  useEffect(() => {
    loadMoreMovies()
  }, [])

  const loadMoreMovies = async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' }
        })
        const newMovies = await response.json()
        
        if (newMovies && newMovies.length > 0) {
            setMovies(prev => {
                const existingIds = new Set(prev.map(m => m.id))
                const uniqueNewMovies = newMovies.filter((m: any) => !existingIds.has(m.id))
                return [...prev, ...uniqueNewMovies]
            })
        }
    } catch (error) {
        console.error("Error:", error)
    } finally {
        isFetching.current = false
    }
  }

  const swiped = async (direction: string, movie: any, index: number) => {
    setLastDirection(direction)
    const isLike = direction === 'right'
    fetch('/api/swipe', {
        method: 'POST',
        body: JSON.stringify({ userId, movieId: movie.id, isLike })
    })

    if (movies.length <= 4) loadMoreMovies()

    setTimeout(() => {
        setMovies(prev => prev.filter(m => m.id !== movie.id))
    }, 200) 
  }

  const outOfFrame = (name: string) => {}

  const swipe = async (dir: string, index: number) => {
    if (cardRefs.current[index]) await cardRefs.current[index].swipe(dir) 
  }

  if (movies.length === 0 && isFetching.current) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="animate-pulse text-purple-400 font-bold mb-4">Finding matches...</div>
        </div>
    )
  }

  if (movies.length === 0 && !isFetching.current) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-gray-500 mb-4">You've seen everything!</div>
            <button onClick={loadMoreMovies} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <RefreshCw className="h-4 w-4" /> Check for New Movies
            </button>
        </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="relative w-[300px] h-[450px] md:w-[350px] md:h-[550px]">
        {movies.map((movie, index) => (
          <TinderCard
            ref={(el: any) => { cardRefs.current[index] = el }}
            key={`${movie.id}-${index}`} 
            onSwipe={(dir: any) => swiped(dir, movie, index)}
            onCardLeftScreen={() => outOfFrame(movie.title)}
            className="absolute w-full h-full"
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
            swipeThreshold={100}
          >
            <div 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}
                className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl border border-white/10 select-none cursor-grab active:cursor-grabbing"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent rounded-3xl" />

                <div className="absolute bottom-0 p-6 w-full text-left">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {movie.vote_average?.toFixed(1)}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1 shadow-black drop-shadow-lg leading-none">
                        {movie.title}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 mb-4 opacity-90">
                        {movie.overview}
                    </p>
                    
                    <div className="flex justify-between items-center px-4 relative z-50">
                        <button
                            onMouseDown={(e) => e.stopPropagation()} 
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={() => swipe('left', index)}
                            className="h-14 w-14 rounded-full border-2 border-red-500/50 flex items-center justify-center bg-red-500/10 text-red-500 hover:scale-110 hover:bg-red-500/20 transition-all active:scale-95"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        
                        {/* FIX: Call the parent function instead of setting local state */}
                        <button 
                            onMouseDown={(e) => e.stopPropagation()} 
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={() => onInfoClick(movie)}
                            className="text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95"
                        >
                            <Info className="h-8 w-8" />
                        </button>

                        <button
                            onMouseDown={(e) => e.stopPropagation()} 
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={() => swipe('right', index)}
                            className="h-14 w-14 rounded-full border-2 border-green-500/50 flex items-center justify-center bg-green-500/10 text-green-500 hover:scale-110 hover:bg-green-500/20 transition-all active:scale-95"
                        >
                            <Heart className="h-8 w-8 fill-green-500/20" />
                        </button>
                    </div>
                </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  )
}