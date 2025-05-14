"use client"

import { MoonIcon, SunIcon, LogOut, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "./auth-provider"

export function Header() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const { isAuthenticated, isAdmin, username, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="OYA HACKATHON Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-lg font-bold">OYA HACKATHON</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && <span className="text-sm text-muted-foreground">שלום, {username}</span>}
          {isAdmin && <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">מנהל</span>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">החלף ערכת נושא</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>בהיר</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>כהה</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>מערכת</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">התנתק</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
              <LogIn className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">התחבר</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
