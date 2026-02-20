'use client'

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Home, MessageCircle, User } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [pathname])

  const isDashboard = currentPath === '/dashboard' || pathname === '/dashboard'
  const isChat = currentPath.startsWith('/dashboard/chat') || pathname.startsWith('/dashboard/chat')
  const isProfile = currentPath === '/dashboard/profile' || pathname === '/dashboard/profile'
  const shouldHideHeader = isChat || isProfile

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white w-full">
        <Sidebar className="w-64 border-r border-gray-200">
          <SidebarContent className="md:bg-none bg-white">
            <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                <Image
                  src="/favicon.png"
                  alt="AgroGen Logo"
                  width={40}
                  height={40}
                  className="object-contain filter"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                <span className="text-green-600">Agro</span>Gen
              </h1>
            </div>
            <SidebarGroup className="md:bg-none bg-white">
              <SidebarGroupContent>
                <SidebarMenu className="mt-4">
                  <SidebarMenuItem>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className={`w-full cursor-pointer flex items-center p-2 text-lg rounded-lg transition-colors duration-200 ${
                        isDashboard
                          ? 'bg-green-100 text-green-700 hover:bg-green-50'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      <Home className="w-6 h-6 mr-4" />
                      Dashboard
                    </button>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <button
                      onClick={() => router.push('/dashboard/chat')}
                      className={`w-full cursor-pointer flex items-center p-2 text-lg rounded-lg transition-colors duration-200 ${
                        isChat
                          ? 'bg-green-100 text-green-700 hover:bg-green-50'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      <MessageCircle className="w-6 h-6 mr-4" />
                      Chat
                    </button>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <button
                      onClick={() => router.push('/dashboard/profile')}
                      className={`w-full cursor-pointer flex items-center p-2 text-lg rounded-lg transition-colors duration-200 ${
                        isProfile
                          ? 'bg-green-100 text-green-700 hover:bg-green-50'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-6 h-6 mr-4" />
                      Profile
                    </button>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="md:bg-none bg-white">
            {user && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.imageUrl}
                    alt="User profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-black">{user.fullName || 'User'}</p>
                    <p className="text-xs text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          {!shouldHideHeader && (
            <header className="border-b border-gray-200 bg-white">
              <div className="max-w-6xl mx-auto py-3.5 px-6 flex items-center">
                <SidebarTrigger className="p-2 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 mr-4" />
                <div className="ml-auto pr-4">
                  <UserButton />
                </div>
              </div>
            </header>
          )}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
