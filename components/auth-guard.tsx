'use client'

import type React from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Desactivado temporalmente para desarrollo de la interfaz
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/auth/signin")
  //   }
  // }, [status, router])

  if (status === 'loading') {
    return (
      <div className="loading-spinner-container">
        <Loader2 className="loading-spinner" />
      </div>
    )
  }

  // if (!session) {
  //   return null
  // }

  return <>{children}</>
}
