import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Award, CalendarDays, Shirt, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getStats() {
  const supabase = createServerSupabaseClient()

  const [hackathonsCount, participantsCount, mentorsCount, foodOrdersCount, shirtOrdersCount, prizesCount] =
    await Promise.all([
      supabase.from("hackathons").select("id", { count: "exact", head: true }),
      supabase.from("participants").select("id", { count: "exact", head: true }),
      supabase.from("mentors").select("id", { count: "exact", head: true }),
      supabase.from("food_orders").select("id", { count: "exact", head: true }),
      supabase.from("shirt_orders").select("id", { count: "exact", head: true }),
      supabase.from("prizes").select("id", { count: "exact", head: true }),
    ])

  return {
    hackathons: hackathonsCount.count || 0,
    participants: participantsCount.count || 0,
    mentors: mentorsCount.count || 0,
    foodOrders: foodOrdersCount.count || 0,
    shirtOrders: shirtOrdersCount.count || 0,
    prizes: prizesCount.count || 0,
  }
}

async function getUpcomingHackathons() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(5)

  if (error) {
    console.error("Error fetching upcoming hackathons:", error)
    return []
  }

  return data
}

export default async function Home() {
  const stats = await getStats()
  const upcomingHackathons = await getUpcomingHackathons()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ברוכים הבאים למערכת ניהול האקתונים</h1>

      <AdminOnly>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </AdminOnly>

      <Card>
        <CardHeader>
          <CardTitle>האקתונים קרובים</CardTitle>
          <CardDescription>האקתונים שיתקיימו בקרוב</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingHackathons.length > 0 ? (
            <div className="space-y-4">
              {upcomingHackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{hackathon.name}</p>
                    <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{new Date(hackathon.start_date).toLocaleDateString("he-IL")}</p>
                    <Link href={`/hackathons/${hackathon.id}`} className="text-sm text-primary hover:underline">
                      צפה בפרטים
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">אין האקתונים קרובים</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
