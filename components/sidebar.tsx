"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import {
  Award,
  BarChart,
  CalendarDays,
  Camera,
  ChevronDown,
  ClipboardList,
  Cog,
  Home,
  Map,
  Printer,
  Settings,
  Shirt,
  Utensils,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "./auth-provider"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive?: boolean
  isOpen?: boolean
  children?: React.ReactNode
  adminOnly?: boolean
}

function SidebarItem({ href, icon, title, isActive, isOpen, children, adminOnly = false }: SidebarItemProps) {
  const [open, setOpen] = useState(isOpen)
  const { isAdmin } = useAuth()

  // אם הפריט מיועד למנהלים בלבד והמשתמש אינו מנהל, אל תציג אותו
  if (adminOnly && !isAdmin) {
    return null
  }

  return (
    <div>
      {children ? (
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground",
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      ) : (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground",
          )}
        >
          {icon}
          <span>{title}</span>
        </Link>
      )}
      {children && open && <div className="mr-4 mt-1 border-r pr-2">{children}</div>}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  return (
    <aside className="w-64 border-l bg-muted/40 py-6">
      <div className="flex flex-col gap-1 px-3">
        <SidebarItem href="/" icon={<Home className="h-4 w-4" />} title="דף הבית" isActive={pathname === "/"} />

        {isAdmin && (
          <SidebarItem
            href="/admin"
            icon={<Settings className="h-4 w-4" />}
            title="לוח בקרה למנהל"
            isActive={pathname.startsWith("/admin")}
            adminOnly
          />
        )}

        {isAdmin && (
          <SidebarItem
            href="/statistics"
            icon={<BarChart className="h-4 w-4" />}
            title="סטטיסטיקות"
            isActive={pathname.startsWith("/statistics")}
            adminOnly
          />
        )}

        <SidebarItem
          href="/hackathons"
          icon={<CalendarDays className="h-4 w-4" />}
          title="האקתונים"
          isActive={pathname.startsWith("/hackathons")}
          isOpen={pathname.startsWith("/hackathons")}
        >
          {isAdmin && (
            <SidebarItem
              href="/hackathons/new"
              icon={<CalendarDays className="h-4 w-4" />}
              title="האקתון חדש"
              isActive={pathname === "/hackathons/new"}
              adminOnly
            />
          )}
        </SidebarItem>

        <SidebarItem
          href="/mentors"
          icon={<ClipboardList className="h-4 w-4" />}
          title="מנטורים"
          isActive={pathname.startsWith("/mentors")}
          adminOnly
        />

        {isAdmin && (
          <SidebarItem
            href="/event-operations"
            icon={<Cog className="h-4 w-4" />}
            title="תפעול אירוע"
            isActive={
              pathname.startsWith("/food") ||
              pathname.startsWith("/shirts") ||
              pathname.startsWith("/prizes") ||
              pathname.startsWith("/photography") ||
              pathname.startsWith("/printing")
            }
            isOpen={
              pathname.startsWith("/food") ||
              pathname.startsWith("/shirts") ||
              pathname.startsWith("/prizes") ||
              pathname.startsWith("/photography") ||
              pathname.startsWith("/printing")
            }
            adminOnly
          >
            <SidebarItem
              href="/food"
              icon={<Utensils className="h-4 w-4" />}
              title="מזון"
              isActive={pathname.startsWith("/food")}
              isOpen={pathname.startsWith("/food")}
              adminOnly
            >
              <SidebarItem
                href="/food/suppliers"
                icon={<Utensils className="h-4 w-4" />}
                title="ספקי מזון"
                isActive={pathname === "/food/suppliers"}
                adminOnly
              />
              <SidebarItem
                href="/food/orders"
                icon={<Utensils className="h-4 w-4" />}
                title="הזמנות מזון"
                isActive={pathname === "/food/orders"}
                adminOnly
              />
            </SidebarItem>

            <SidebarItem
              href="/shirts"
              icon={<Shirt className="h-4 w-4" />}
              title="חולצות"
              isActive={pathname.startsWith("/shirts")}
              isOpen={pathname.startsWith("/shirts")}
              adminOnly
            >
              <SidebarItem
                href="/shirts/suppliers"
                icon={<Shirt className="h-4 w-4" />}
                title="ספקי חולצות"
                isActive={pathname === "/shirts/suppliers"}
                adminOnly
              />
              <SidebarItem
                href="/shirts/orders"
                icon={<Shirt className="h-4 w-4" />}
                title="הזמנות חולצות"
                isActive={pathname === "/shirts/orders"}
                adminOnly
              />
            </SidebarItem>

            <SidebarItem
              href="/photography"
              icon={<Camera className="h-4 w-4" />}
              title="צילום"
              isActive={pathname.startsWith("/photography")}
              isOpen={pathname.startsWith("/photography")}
              adminOnly
            >
              <SidebarItem
                href="/photography/suppliers"
                icon={<Camera className="h-4 w-4" />}
                title="ספקי צילום"
                isActive={pathname === "/photography/suppliers"}
                adminOnly
              />
              <SidebarItem
                href="/photography/orders"
                icon={<Camera className="h-4 w-4" />}
                title="הזמנות צילום"
                isActive={pathname === "/photography/orders"}
                adminOnly
              />
            </SidebarItem>

            <SidebarItem
              href="/printing"
              icon={<Printer className="h-4 w-4" />}
              title="דפוס"
              isActive={pathname.startsWith("/printing")}
              isOpen={pathname.startsWith("/printing")}
              adminOnly
            >
              <SidebarItem
                href="/printing/suppliers"
                icon={<Printer className="h-4 w-4" />}
                title="ספקי דפוס"
                isActive={pathname === "/printing/suppliers"}
                adminOnly
              />
              <SidebarItem
                href="/printing/orders"
                icon={<Printer className="h-4 w-4" />}
                title="הזמנות דפוס"
                isActive={pathname === "/printing/orders"}
                adminOnly
              />
            </SidebarItem>

            <SidebarItem
              href="/prizes"
              icon={<Award className="h-4 w-4" />}
              title="פרסים"
              isActive={pathname.startsWith("/prizes")}
              isOpen={pathname.startsWith("/prizes")}
              adminOnly
            >
              <SidebarItem
                href="/prizes/suppliers"
                icon={<Award className="h-4 w-4" />}
                title="ספקי פרסים"
                isActive={pathname === "/prizes/suppliers"}
                adminOnly
              />
              <SidebarItem
                href="/prizes/list"
                icon={<Award className="h-4 w-4" />}
                title="רשימת פרסים"
                isActive={pathname === "/prizes/list"}
                adminOnly
              />
            </SidebarItem>
          </SidebarItem>
        )}

        <SidebarItem
          href="/sponsors"
          icon={<Award className="h-4 w-4" />}
          title="ספונסרים"
          isActive={pathname.startsWith("/sponsors")}
          isOpen={pathname.startsWith("/sponsors")}
          adminOnly
        />

        <SidebarItem
          href="/teams"
          icon={<Users className="h-4 w-4" />}
          title="צוותים"
          isActive={pathname.startsWith("/teams")}
          isOpen={pathname.startsWith("/teams")}
          adminOnly
        />

        <SidebarItem
          href="/map"
          icon={<Map className="h-4 w-4" />}
          title="מפת מיקומים"
          isActive={pathname.startsWith("/map")}
        />
      </div>
    </aside>
  )
}
