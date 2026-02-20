'use client'

import { useRouter } from 'next/navigation'
import { Sprout, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-green-100 rounded-full animate-pulse">
            <Sprout className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Oops! Lost in the Fields?
        </h1>
        <p className="text-lg text-green-600 mb-8 leading-relaxed">
          Looks like this page is off the map! Don’t worry, AgroGen Assistant is here to guide you back to fertile ground.
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="group bg-green-600 hover:bg-green-700 text-white px-6 py-6 cursor-pointer rounded-xl shadow-md transition-all duration-300 flex items-center mx-auto"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}