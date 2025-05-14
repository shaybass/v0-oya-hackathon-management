import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Award, CalendarDays, ClipboardList, Edit, Printer, Shirt, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminOnly } from "@/components/admin-only"

interface HackathonPageProps {
  params: {
    id: string
  }
}

async function getHackathon(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("hackathons").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching hackathon:", error)
    return null
  }

  return data
}

async function getHackathonManagers(hackathonId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("event_managers").select("*").eq("hackathon_id", hackathonId)

  if (error) {
    console.error("Error fetching hackathon managers:", error)
    return []
  }

  return data
}

async function getEventManagerMentors() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("mentors").select("id, name, email, phone").eq("is_event_manager", true)

  if (error) {
    console.error("Error fetching event manager mentors:", error)
    return []
  }

  return data
}

async function getHackathonParticipantsCount(hackathonId: string) {
  const supabase = createServerSupabaseClient()

  const { count, error } = await supabase
    .from("participants")
    .select("*", { count: "exact", head: true })
    .eq("hackathon_id", hackathonId)

  if (error) {
    console.error("Error fetching participants count:", error)
    return 0
  }

  return count || 0
}

async function getHackathonMentorsCount(hackathonId: string) {
  const supabase = createServerSupabaseClient()

  const { count, error } = await supabase
    .from("hackathon_mentors")
    .select("*", { count: "exact", head: true })
    .eq("hackathon_id", hackathonId)

  if (error) {
    console.error("Error fetching mentors count:", error)
    return 0
  }

  return count || 0
}

export default async function HackathonPage({ params }: HackathonPageProps) {
  const hackathon = await getHackathon(params.id)

  if (!hackathon) {
    notFound()
  }

  const managers = await getHackathonManagers(hackathon.id)
  const eventManagerMentors = await getEventManagerMentors()
  const participantsCount = await getHackathonParticipantsCount(hackathon.id)
  const mentorsCount = await getHackathonMentorsCount(hackathon.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{hackathon.name}</h1>
        <AdminOnly>
          <Link href={`/hackathons/${hackathon.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              ערוך
            </Button>
          </Link>
        </AdminOnly>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">תאריכים</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">התחלה:</span>{" "}
                {new Date(hackathon.start_date).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">סיום:</span>{" "}
                {new Date(hackathon.end_date).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מיקום</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>{hackathon.location}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">קישור הרשמה</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {hackathon.registration_link ? (
              <a
                href={hackathon.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                קישור להרשמה
              </a>
            ) : (
              <p className="text-muted-foreground">לא הוגדר קישור הרשמה</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">משתתפים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participantsCount}</div>
            <AdminOnly>
              <Link href={`/hackathons/${hackathon.id}/participants`} className="text-sm text-primary hover:underline">
                צפה במשתתפים
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מנטורים</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorsCount}</div>
            <AdminOnly>
              <Link href={`/hackathons/${hackathon.id}/mentors`} className="text-sm text-primary hover:underline">
                צפה במנטורים
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מנהלי אירוע</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {managers.length > 0 ? (
              <div className="space-y-2">
                {managers.map((manager) => (
                  <div key={manager.id}>
                    <p className="font-medium">{manager.name}</p>
                    <p className="text-sm text-muted-foreground">{manager.email}</p>
                    <p className="text-sm text-muted-foreground">{manager.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <p className="text-muted-foreground">לא הוגדרו מנהלי אירוע</p>
                <AdminOnly>
                  <Link href={`/hackathons/${hackathon.id}/managers/new`}>
                    <Button variant="outline" size="sm">
                      הוסף מנהל אירוע
                    </Button>
                  </Link>
                </AdminOnly>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="details">פרטים</TabsTrigger>
          <TabsTrigger value="resources">משאבים</TabsTrigger>
          <TabsTrigger value="food">מזון</TabsTrigger>
          <TabsTrigger value="shirts">חולצות</TabsTrigger>
          <TabsTrigger value="printing">דפוס</TabsTrigger>
          <TabsTrigger value="prizes">פרסים</TabsTrigger>
          <TabsTrigger value="sponsors">ספונסרים</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>תיאור האקתון</CardTitle>
            </CardHeader>
            <CardContent>
              {hackathon.description ? (
                <p className="whitespace-pre-line">{hackathon.description}</p>
              ) : (
                <p className="text-muted-foreground">לא הוגדר תיאור</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>אתגר</CardTitle>
            </CardHeader>
            <CardContent>
              {hackathon.challenge ? (
                <p className="whitespace-pre-line">{hackathon.challenge}</p>
              ) : (
                <p className="text-muted-foreground">לא הוגדר אתגר</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>חומרי מיתוג</CardTitle>
                <CardDescription>פליירים, רול-אפים, שלטים ומצגות</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/branding/new`}>
                  <Button variant="outline" size="sm">
                    הוסף חומר מיתוג
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לא נמצאו חומרי מיתוג</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="food" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>הזמנות מזון</CardTitle>
                <CardDescription>הזמנות מזון לאירוע</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/food/new`}>
                  <Button variant="outline" size="sm">
                    <Utensils className="mr-2 h-4 w-4" />
                    הוסף הזמנת מזון
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לא נמצאו הזמנות מזון</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shirts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>הזמנות חולצות</CardTitle>
                <CardDescription>הזמנות חולצות לאירוע</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/shirts/new`}>
                  <Button variant="outline" size="sm">
                    <Shirt className="mr-2 h-4 w-4" />
                    הוסף הזמנת חולצות
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לא נמצאו הזמנות חולצות</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printing" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>הזמנות דפוס</CardTitle>
                <CardDescription>הזמנות דפוס לאירוע (פליירים, רול-אפים, שלטים)</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/printing/new`}>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    הוסף הזמנת דפוס
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לא נמצאו הזמנות דפוס</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prizes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>פרסים</CardTitle>
                <CardDescription>פרסים לזוכים באירוע</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/prizes/new`}>
                  <Button variant="outline" size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    הוסף פרס
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לא נמצאו פרסים</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>ספונסרים</CardTitle>
                <CardDescription>ספונסרים ונותני חסות לאירוע</CardDescription>
              </div>
              <AdminOnly>
                <Link href={`/hackathons/${hackathon.id}/sponsors/add`}>
                  <Button variant="outline" size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    הוסף ספונסר
                  </Button>
                </Link>
              </AdminOnly>
            </CardHeader>
            <CardContent>
              <Link href={`/hackathons/${hackathon.id}/sponsors`} className="text-primary hover:underline">
                צפה בכל הספונסרים
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
