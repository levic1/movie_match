'use client'

import { useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import CardStack from '@/app/components/CardStack'
import InfoModal from '@/app/components/InfoModal'
import Link from 'next/link' // Import Link
import { ArrowLeft } from 'lucide-react' // Import Icon

export default function DiscoverClient({ userId }: { userId: string }) {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* --- LEFT: The Main Swipe Area (Cards) --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-[60vh] md:h-screen order-1 md:order-1">
        
        {/* --- UPDATED HEADER WITH BACK BUTTON --- */}
        <header className="absolute top-0 left-0 w-full h-20 flex items-center justify-between px-6 md:px-8 z-50 bg-gradient-to-b from-[#050505] to-transparent">
          <div className="flex items-center gap-4">
            {/* Return Button */}
            <Link 
                href="/" 
                className="group flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/5 transition-all hover:scale-105"
            >
                <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors hidden sm:inline">Home</span>
            </Link>

            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Discover
            </h1>
          </div>
        </header>

        {/* Card Stack Center */}
        <div className="flex-1 flex items-center justify-center">
            <div className="relative z-10 scale-90 md:scale-100">
                <CardStack userId={userId} onInfoClick={setSelectedMovie} />
            </div>
        </div>
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      </main>

      {/* --- RIGHT: The Sidebar (Liked Movies) --- */}
      <div className="order-2 md:order-2 h-[40vh] md:h-auto border-t md:border-t-0 md:border-l border-white/10 shadow-2xl z-30">
        <Sidebar userId={userId} />
      </div>

      {/* --- MODAL --- */}
      {selectedMovie && (
        <InfoModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

    </div>
  )
}