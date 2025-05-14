import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { CalendarDays, Plus } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getHackathons() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("hackathons").select("*").order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching hackathons:", error)
    return []
  }

  return data
}

export default async function HackathonsPage() {
  const hackathons = await getHackathons()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">האקתונים</h1>
        <AdminOnly>
          <Link href="/hackathons/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              האקתון חדש
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {hackathons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((hackathon) => (
            <Link key={hackathon.id} href={`/hackathons/${hackathon.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{hackathon.name}</CardTitle>
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">מיקום:</span> {hackathon.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">תאריך התחלה:</span>{" "}
                      {new Date(hackathon.start_date).toLocaleDateString("he-IL")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">תאריך סיום:</span>{" "}
                      {new Date(hackathon.end_date).toLocaleDateString("he-IL")}
                    </p>
                    {hackathon.description && <p className="mt-2 line-clamp-2 text-sm">{hackathon.description}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין האקתונים</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו האקתונים למערכת</p>
            <AdminOnly>
              <Link href="/hackathons/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  צור האקתון חדש
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
