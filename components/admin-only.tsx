"use client"

import type React from "react"
import { useAuth } from "./auth-provider"

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
