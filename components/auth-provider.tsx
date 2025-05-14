"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, createContext, useContext } from "react"

// יצירת קונטקסט לאימות
interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  username: string | null
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  username: null,
  login: () => {},
  logout: () => {},
})

// הוק לשימוש בקונטקסט האימות
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean
    isAdmin: boolean
    username: string | null
  }>({
    isAuthenticated: false,
    isAdmin: false,
    username: null,
  })

  // פונקציה להתחברות
  const login = (username: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify({ username }))
    setAuthState({
      isAuthenticated: true,
      isAdmin: true,
      username,
    })
  }

  // פונקציה להתנתקות
  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      username: null,
    })
    router.push("/")
  }

  useEffect(() => {
    // בדיקה אם המשתמש מחובר
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    let username = null

    if (isAuthenticated) {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        username = userData.username || null
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    setAuthState({
      isAuthenticated,
      isAdmin: isAuthenticated, // אם מחובר, אז מנהל
      username,
    })

    // אם המשתמש מנסה לגשת לדף ניהול ואינו מחובר, הפנה לדף התחברות
    const isAdminRoute =
      pathname.includes("/new") ||
      pathname.includes("/edit") ||
      pathname.endsWith("/suppliers") ||
      pathname.endsWith("/orders") ||
      pathname === "/mentors"

    if (isAdminRoute && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [pathname, router])

  // הצג מסך טעינה בזמן בדיקת ההתחברות
  if (isLoading && pathname !== "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>טוען...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isAdmin: authState.isAdmin,
        username: authState.username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
