'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/services/SupabaseClient'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react'

interface ChatItem {
  Chat_Id: string
  Title: string
}

const ChatPage = () => {
  const { user } = useUser()
  const [chats, setChats] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchChats()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('Data')
        .select('Chat_Id, Title')
        .eq('userEmail', user?.primaryEmailAddress?.emailAddress)

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const GreenLoader = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your chats...</h3>
        <p className="text-gray-600">Please wait while we fetch your crop analysis history</p>
      </div>

      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <GreenLoader />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Your Crop Analysis History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Access your previous crop analysis sessions and continue where you left off
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No chats found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your first crop analysis from the dashboard to see your chat history here.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start New Analysis
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat, index) => (
              <Link key={chat.Chat_Id} href={`/dashboard/chat/${chat.Chat_Id}`}>
                <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Image 
                            src="/favicon.png" 
                            alt="Favicon" 
                            width={24} 
                            height={24} 
                            className="filter brightness-0 invert"
                          />
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Chat #{index + 1}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 group-hover:text-green-700 transition-colors duration-300">
                        {chat.Title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Crop analysis session
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Recent
                      </div>
                      <div className="text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors duration-300">
                        View Analysis →
                      </div>
                    </div>
                  </CardContent>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-all duration-300"></div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {chats.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start New Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
