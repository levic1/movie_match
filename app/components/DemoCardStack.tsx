'use client'

import React, { useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { X, Heart, Star } from 'lucide-react'

const DEMO_MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole...",
    poster_path: "/gEU2QniL6E8AHtMY4kRFW8154L.jpg",
    vote_average: 8.4,
  },
  {
    id: 2,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon...",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
  },
  {
    id: 3,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious...",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    vote_average: 8.3,
  }
]

export default function DemoCardStack() {
  const cardRefs = useRef<any[]>([])

  const swiped = (direction: any, nameToDelete: string) => {
    console.log('Demo swipe:', direction)
  }

  // Helper to trigger swipe from buttons
  const swipe = (dir: string, index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].swipe(dir)
    }
  }

  return (
    <div className="relative w-[280px] h-[420px] sm:w-[320px] sm:h-[480px]">
      {DEMO_MOVIES.map((movie, index) => (
        <TinderCard
          ref={(el: any) => { cardRefs.current[index] = el }}
          key={movie.id}
          onSwipe={(dir: any) => swiped(dir, movie.title)}
          className="absolute w-full h-full"
          preventSwipe={['up', 'down']}
        >
          <div 
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}
            className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
          >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent rounded-3xl" />

            {/* Content */}
            <div className="absolute bottom-0 p-6 w-full text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded text-yellow-400 text-xs font-bold uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {movie.vote_average}
                </div>
              </div>
              
              <h3 className="text-3xl font-extrabold text-white mb-1 drop-shadow-md leading-none">
                {movie.title}
              </h3>
              
              <p className="text-xs text-gray-300 line-clamp-2 mb-6 opacity-90">
                {movie.overview}
              </p>
              
              {/* REAL BUTTONS NOW */}
              <div className="flex justify-between items-center px-2 relative z-50">
                <button
                    onMouseDown={(e) => e.stopPropagation()} // Stop drag conflict
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => swipe('left', index)} // Trigger Left Swipe
                    className="h-12 w-12 rounded-full border-2 border-red-500/50 flex items-center justify-center bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-110 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                    <X className="h-6 w-6" />
                </button>

                <button
                    onMouseDown={(e) => e.stopPropagation()} // Stop drag conflict
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => swipe('right', index)} // Trigger Right Swipe
                    className="h-12 w-12 rounded-full border-2 border-green-500/50 flex items-center justify-center bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-110 hover:bg-green-500/20 transition-all cursor-pointer"
                >
                    <Heart className="h-6 w-6 fill-green-500/20" />
                </button>
              </div>
            </div>
          </div>
        </TinderCard>
      ))}
      
      {/* Background hint cards */}
      <div className="absolute top-0 w-full h-full bg-gray-800 rounded-3xl -z-10 rotate-6 opacity-40 scale-95" />
      <div className="absolute top-0 w-full h-full bg-gray-700 rounded-3xl -z-20 -rotate-6 opacity-20 scale-90" />
    </div>
  )
}