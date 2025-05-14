import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Plus, Users } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getEventManagers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("event_managers")
    .select(`
      *,
      hackathon:hackathons(name)
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching event managers:", error)
    return []
  }

  return data
}

export default async function EventManagersPage() {
  const managers = await getEventManagers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">מנהלי אירוע</h1>
        <AdminOnly>
          <Link href="/event-managers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              מנהל אירוע חדש
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {managers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {managers.map((manager) => (
            <Link key={manager.id} href={`/event-managers/${manager.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{manager.name}</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">האקתון:</span> {manager.hackathon?.name || "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">טלפון:</span> {manager.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">דוא"ל:</span> {manager.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין מנהלי אירוע</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו מנהלי אירוע למערכת</p>
            <AdminOnly>
              <Link href="/event-managers/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף מנהל אירוע חדש
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
