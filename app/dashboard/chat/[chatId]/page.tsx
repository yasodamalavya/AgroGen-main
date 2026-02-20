'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/SupabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Sprout, MessageCircle, Globe, Mic, Square, Volume2, Pause } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const ChatIdPage = () => {
  const { user } = useUser()
  const params = useParams()
  const chatId = params.chatId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('English')
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const getPlaceholderText = () => {
    switch (language) {
      case 'Hindi':
        return 'अपना संदेश यहाँ टाइप करें...';
      case 'Telugu':
        return 'మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...';
      case 'Oriya':
        return 'ଆପଣଙ୍କ ବାର୍ତ୍ତା ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ...';
      case 'English':
      default:
        return 'Type your message...';
    }
  }

  const formatMessageContent = (content: string) => {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-green-700">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-green-600">$1</em>');
    formatted = formatted.replace(/^\* /gm, '• ');
    formatted = formatted.replace(/\n\n/g, '<br/><br/>');
    formatted = formatted.replace(/\n/g, '<br/>');
    
    return formatted;
  };

  useEffect(() => {
    if (user) {
      fetchChat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chatId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((result: any) => result[0].transcript)
            .join('');
          setInput(transcript);
        };
        recognitionRef.current.onend = () => {
          if (isRecording) {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('SpeechRecognition restart error:', error);
              setIsRecording(false);
            }
          }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error('SpeechRecognition error:', event.error);
          setIsRecording(false);
        };
      }
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isRecording]);

  useEffect(() => {
    const langMap: { [key: string]: string } = {
      English: 'en-US',
      Hindi: 'hi-IN',
      Telugu: 'te-IN',
      Oriya: 'or-IN',
    };
    if (recognitionRef.current) {
      recognitionRef.current.lang = langMap[language] || 'en-US';
    }
  }, [language]);

  const fetchChat = async () => {
    try {
      const { data, error } = await supabase
        .from('Data')
        .select('Chat')
        .eq('Chat_Id', chatId)
        .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
        .single()

      if (error || !data) throw error
      setMessages(data.Chat || [])
    } catch (error) {
      console.error('Error fetching chat:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    const userMessage = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: input, language }),
      })
      
      if (!response.ok) throw new Error('Failed to send message')
      const { content } = await response.json()
      setMessages((prev) => [...prev, { role: 'bot', content }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = () => {
    setInput('');
    try {
      recognitionRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      console.error('SpeechRecognition start error:', error);
    }
  }

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    if (input.trim()) {
      handleSend();
    }
  }

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const toggleTTS = async (message: string, index: number) => {
    if (playingAudioId === index) {
      // Stop playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setPlayingAudioId(null);
      }
      return;
    }

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, language }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const { audioContent } = await response.json();
      audioRef.current = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current.play();
      setPlayingAudioId(index);
      audioRef.current.onended = () => {
        setPlayingAudioId(null);
        audioRef.current = null;
      };
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }

  if (fetchLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-green-800">Loading your conversation...</p>
          <p className="text-green-600 mt-2">Preparing AgroGen Assistant</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-green-200 shadow-sm px-6 py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AgroGen Assistant</h1>
              <p className="text-green-600 font-medium">Your Smart Farming Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
            <Globe className="w-4 h-4 text-green-600" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px] border-0 bg-transparent shadow-none focus:ring-0 text-green-700 font-semibold">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="border-green-200">
                <SelectItem value="English" className="focus:bg-green-50 focus:text-green-700">🇺🇸 English</SelectItem>
                <SelectItem value="Hindi" className="focus:bg-green-50 focus:text-green-700">🇮🇳 Hindi</SelectItem>
                <SelectItem value="Telugu" className="focus:bg-green-50 focus:text-green-700">🇮🇳 Telugu</SelectItem>
                <SelectItem value="Oriya" className="focus:bg-green-50 focus:text-green-700">🇮🇳 Oriya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-4">
            <div className="max-w-6xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-6 bg-green-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <MessageCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to AgroGen Chat!</h3>
                  <p className="text-green-600 text-lg max-w-md mx-auto leading-relaxed">
                    Ask me anything about crop yields, farming techniques, weather patterns, or agricultural best practices.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'user' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-white border-2 border-green-200 text-green-600'
                        }`}>
                          {msg.role === 'user' ? (
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            </div>
                          ) : (
                            <Sprout className="w-5 h-5" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-2xl shadow-sm relative ${
                            msg.role === 'user'
                              ? 'bg-green-600 text-white rounded-br-md'
                              : 'bg-white border border-green-100 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <div className={`text-sm font-medium mb-2 ${msg.role === 'user' ? 'text-green-100' : 'text-green-600'}`}>
                            {msg.role === 'user' ? 'You' : 'AgroGen Assistant'}
                          </div>
                          <div className="text-sm leading-relaxed">
                            {msg.role === 'bot' ? (
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: formatMessageContent(msg.content) 
                                }}
                              />
                            ) : (
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                          </div>
                          {msg.role === 'bot' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute bottom-2 right-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => toggleTTS(msg.content, idx)}
                            >
                              {playingAudioId === idx ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-[75%]">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-green-200 text-green-600 flex items-center justify-center flex-shrink-0">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <div className="p-4 bg-white border border-green-100 rounded-2xl rounded-bl-md shadow-sm">
                          <div className="text-sm font-medium text-green-600 mb-2">AgroGen Assistant</div>
                          <div className="flex items-center space-x-2 text-green-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="bg-white border-t border-green-200 px-6 py-6 shadow-lg flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getPlaceholderText()}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="w-full h-14 pl-4 pr-20 py-4 text-base border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-800 placeholder-green-400 transition-all duration-200"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Button 
                  size="sm"
                  variant="ghost"
                  className={`text-green-600 cursor-pointer hover:text-green-700 hover:bg-green-50 rounded-lg p-2 transition-all duration-200 ${isRecording ? 'animate-pulse' : ''}`}
                  disabled={isLoading}
                  onClick={handleVoiceToggle}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-lg px-3 py-2 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatIdPage
