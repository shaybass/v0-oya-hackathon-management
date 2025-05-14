import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Plus, Users } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getTeams() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("teams")
    .select(`
      *,
      hackathon:hackathons(name),
      participants:participants(id)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching teams:", error)
    return []
  }

  // Count participants for each team
  return data.map((team) => ({
    ...team,
    participants_count: team.participants ? team.participants.length : 0,
  }))
}

export default async function TeamsPage() {
  const teams = await getTeams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">צוותים</h1>
        <AdminOnly>
          <Link href="/teams/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              צוות חדש
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {teams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">האקתון:</span> {team.hackathon?.name || "לא צוין"}
                    </p>
                    {team.project_name && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">שם פרויקט:</span> {team.project_name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">מספר משתתפים:</span> {team.participants_count}
                    </p>
                    {team.registration_link && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">קישור הרשמה:</span>{" "}
                        <a
                          href={`/register/${team.registration_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          קישור
                        </a>
                      </p>
                    )}
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
            <p className="mb-2 text-lg font-medium">אין צוותים</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו צוותים למערכת</p>
            <AdminOnly>
              <Link href="/teams/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף צוות חדש
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
