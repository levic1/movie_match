'use client'

import React, { useState, useEffect, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { X, Heart, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CardStack({ userId }: { userId: string }) {
  const supabase = createClient()
  const [movies, setMovies] = useState<any[]>([])
  const [lastDirection, setLastDirection] = useState<string>()
  const cardRefs = useRef<any[]>([])

  // 1. Fetch Movies on Mount
  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
        // CALL YOUR NEW RECOMMENDATION API
        const response = await fetch('/api/recommend', {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' }
        })
        
        const newMovies = await response.json()

        if (newMovies && newMovies.length > 0) {
            setMovies(newMovies)
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error)
    }
  }

  // 2. Handle Swipe
  const swiped = async (direction: string, movie: any) => {
    setLastDirection(direction)
    
    // API Call to save swipe
    const isLike = direction === 'right'
    await fetch('/api/swipe', {
        method: 'POST',
        body: JSON.stringify({ userId, movieId: movie.id, isLike })
    })

    // Remove card from local state (optional, but good for memory)
    // setMovies(prev => prev.filter(m => m.id !== movie.id))
  }

  const outOfFrame = (name: string) => {
    console.log(name + ' left the screen!')
  }

  if (movies.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="animate-pulse text-gray-500">Loading movies...</div>
            <p className="text-xs text-gray-600 mt-2">(If this stays loading, run the Python seed script!)</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="relative w-[300px] h-[450px] md:w-[350px] md:h-[550px]">
        {movies.map((movie, index) => (
         <TinderCard
            // CHANGE 1: Add curly braces { } to force it to return "void"
            ref={(el: any) => { cardRefs.current[index] = el }}
            
            key={movie.id}
            
            // CHANGE 2: Add ': any' so it stops asking what "dir" is
            onSwipe={(dir: any) => swiped(dir, movie)}
            
            onCardLeftScreen={() => outOfFrame(movie.title)}
            className="absolute w-full h-full"
            preventSwipe={['up', 'down']}
            >
            <div 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}
                className="relative w-full h-full bg-cover bg-center rounded-2xl shadow-2xl border border-white/10 select-none cursor-grab active:cursor-grabbing"
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent rounded-2xl" />

                {/* Movie Info */}
                <div className="absolute bottom-0 p-6 w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded uppercase tracking-wider">
                            IMDB {movie.vote_average.toFixed(1)}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1 shadow-black drop-shadow-lg leading-tight">
                        {movie.title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                        {movie.overview}
                    </p>
                    
                    {/* Action Hints */}
                    <div className="flex justify-between items-center px-4">
                        <X className="text-red-500 h-8 w-8 opacity-50" />
                        <Info className="text-white/50 h-6 w-6" />
                        <Heart className="text-green-500 h-8 w-8 opacity-50" />
                    </div>
                </div>
            </div>
          </TinderCard>
        ))}
      </div>
      
      {/* Swipe Feedback */}
      {lastDirection && (
        <div className="absolute bottom-10 text-white/50 text-sm animate-fade-out">
            You swiped {lastDirection}
        </div>
      )}
    </div>
  )
}