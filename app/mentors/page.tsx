import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ClipboardList, Plus } from "lucide-react"
import Link from "next/link"

async function getMentors() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("mentors").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching mentors:", error)
    return []
  }

  return data
}

export default async function MentorsPage() {
  const mentors = await getMentors()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">מנטורים</h1>
        <Link href="/mentors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            מנטור חדש
          </Button>
        </Link>
      </div>

      {mentors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <Link key={mentor.id} href={`/mentors/${mentor.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{mentor.name}</CardTitle>
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">תפקיד:</span> {mentor.occupation || "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">ארגון:</span> {mentor.organization || "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">טלפון:</span> {mentor.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">דוא"ל:</span> {mentor.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">סטטוס:</span>{" "}
                      {mentor.is_potential ? "מנטור פוטנציאלי" : "מנטור פעיל"}
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
            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין מנטורים</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו מנטורים למערכת</p>
            <Link href="/mentors/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                הוסף מנטור חדש
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
