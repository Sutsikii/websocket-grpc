'use client'

import { useEffect, useState, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off('chat message')
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message)
      setMessage('')
    }
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="text-black p-4 h-64 overflow-y-scroll mb-4 bg-gray-100 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 p-2">{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Écris ton message..."
        />
        <button 
          onClick={sendMessage} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}
