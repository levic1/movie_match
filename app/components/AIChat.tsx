'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Movie Concierge. Can't decide what to watch? Tell me what you're in the mood for!" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    // 1. Add User Message locally
    const userMsg = { role: 'user' as const, content: input }
    const newHistory = [...messages, userMsg]
    
    setMessages(newHistory)
    setInput('')
    setIsTyping(true)

    try {
      // 2. Call the Gemini API Route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      })
      
      const data = await response.json()
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        console.log("V2 IS LIVE")
      } else {
        throw new Error("No reply from AI")
      }

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, my brain froze! Try asking again." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* FLOATING TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Bot className="h-7 w-7 text-white" />
      </button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="font-bold text-white">Movie AI</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            m.role === 'user' 
                            ? 'bg-purple-600 text-white rounded-tr-none' 
                            : 'bg-white/10 text-gray-200 rounded-tl-none'
                        }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#1a1a1a] border-t border-white/10">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for a recommendation..."
                        className="flex-1 bg-white/5 border-none rounded-full px-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                    <button 
                        onClick={handleSend}
                        className="p-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
                    >
                        <Send className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}