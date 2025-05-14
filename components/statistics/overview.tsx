"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CalendarDays, Shirt, Users, Utensils } from "lucide-react"
import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase-client"

interface Stats {
  hackathons: number
  participants: number
  teams: number
  mentors: number
  foodOrders: number
  shirtOrders: number
  prizes: number
  sponsors: number
}

export function StatisticsOverview() {
  const [stats, setStats] = useState<Stats>({
    hackathons: 0,
    participants: 0,
    teams: 0,
    mentors: 0,
    foodOrders: 0,
    shirtOrders: 0,
    prizes: 0,
    sponsors: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClientSupabaseClient()

      const [
        hackathonsCount,
        participantsCount,
        teamsCount,
        mentorsCount,
        foodOrdersCount,
        shirtOrdersCount,
        prizesCount,
        sponsorsCount,
      ] = await Promise.all([
        supabase.from("hackathons").select("id", { count: "exact", head: true }),
        supabase.from("participants").select("id", { count: "exact", head: true }),
        supabase.from("teams").select("id", { count: "exact", head: true }),
        supabase.from("mentors").select("id", { count: "exact", head: true }),
        supabase.from("food_orders").select("id", { count: "exact", head: true }),
        supabase.from("shirt_orders").select("id", { count: "exact", head: true }),
        supabase.from("prizes").select("id", { count: "exact", head: true }),
        supabase.from("sponsors").select("id", { count: "exact", head: true }),
      ])

      setStats({
        hackathons: hackathonsCount.count || 0,
        participants: participantsCount.count || 0,
        teams: teamsCount.count || 0,
        mentors: mentorsCount.count || 0,
        foodOrders: foodOrdersCount.count || 0,
        shirtOrders: shirtOrdersCount.count || 0,
        prizes: prizesCount.count || 0,
        sponsors: sponsorsCount.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div>טוען נתונים...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">האקתונים</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hackathons}</div>
          <p className="text-xs text-muted-foreground">סה"כ האקתונים במערכת</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">משתתפים</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.participants}</div>
          <p className="text-xs text-muted-foreground">סה"כ משתתפים רשומים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">צוותים</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.teams}</div>
          <p className="text-xs text-muted-foreground">סה"כ צוותים רשומים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">מנטורים</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mentors}</div>
          <p className="text-xs text-muted-foreground">סה"כ מנטורים רשומים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">הזמנות מזון</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.foodOrders}</div>
          <p className="text-xs text-muted-foreground">סה"כ הזמנות מזון</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">הזמנות חולצות</CardTitle>
          <Shirt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.shirtOrders}</div>
          <p className="text-xs text-muted-foreground">סה"כ הזמנות חולצות</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">פרסים</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.prizes}</div>
          <p className="text-xs text-muted-foreground">סה"כ פרסים רשומים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ספונסרים</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sponsors}</div>
          <p className="text-xs text-muted-foreground">סה"כ ספונסרים רשומים</p>
        </CardContent>
      </Card>
    </div>
  )
}
