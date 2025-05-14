import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Award, ArrowLeft, ExternalLink, Edit, Trash, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminOnly } from "@/components/admin-only"

async function getSponsor(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("sponsors").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Error fetching sponsor:", error)
    return null
  }

  return data
}

async function getHackathonSponsors(sponsorId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("hackathon_sponsors")
    .select("*, hackathons(id, name, start_date, end_date)")
    .eq("sponsor_id", sponsorId)

  if (error) {
    console.error("Error fetching hackathon sponsors:", error)
    return []
  }

  return data
}

export default async function SponsorPage({ params }: { params: { id: string } }) {
  const sponsor = await getSponsor(params.id)
  const hackathonSponsors = await getHackathonSponsors(params.id)

  if (!sponsor) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/sponsors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{sponsor.name}</h1>
        </div>
        <AdminOnly>
          <div className="flex gap-2">
            <Link href={`/sponsors/${params.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                ערוך
              </Button>
            </Link>
            <Link href={`/sponsors/${params.id}/delete`}>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                מחק
              </Button>
            </Link>
          </div>
        </AdminOnly>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>פרטי ספונסר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sponsor.contact_person && (
                <div>
                  <p className="font-medium">איש קשר</p>
                  <p>{sponsor.contact_person}</p>
                </div>
              )}
              <div>
                <p className="font-medium">טלפון</p>
                <p>{sponsor.phone}</p>
              </div>
              {sponsor.email && (
                <div>
                  <p className="font-medium">דוא"ל</p>
                  <p>{sponsor.email}</p>
                </div>
              )}
              {sponsor.address && (
                <div>
                  <p className="font-medium">כתובת</p>
                  <p>{sponsor.address}</p>
                </div>
              )}
              {sponsor.website && (
                <div>
                  <p className="font-medium">אתר אינטרנט</p>
                  <p>
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {sponsor.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              )}
              {sponsor.sponsorship_level && (
                <div>
                  <p className="font-medium">רמת חסות</p>
                  <p>{sponsor.sponsorship_level}</p>
                </div>
              )}
              {sponsor.notes && (
                <div>
                  <p className="font-medium">הערות</p>
                  <p className="whitespace-pre-wrap">{sponsor.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>האקתונים</CardTitle>
            <AdminOnly>
              <Link href={`/sponsors/${params.id}/add-hackathon`}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף להאקתון
                </Button>
              </Link>
            </AdminOnly>
          </CardHeader>
          <CardContent>
            {hackathonSponsors.length > 0 ? (
              <div className="space-y-4">
                {hackathonSponsors.map((hs) => (
                  <div key={hs.id} className="rounded-lg border p-4">
                    <Link href={`/hackathons/${hs.hackathon_id}`} className="font-medium hover:underline">
                      {hs.hackathons?.name}
                    </Link>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">סוג חסות</p>
                        <p>{hs.sponsorship_type || "לא צוין"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">סכום</p>
                        <p>{hs.amount ? `₪${hs.amount}` : "לא צוין"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">סטטוס</p>
                        <p>{hs.status}</p>
                      </div>
                    </div>
                    {hs.description && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">תיאור</p>
                        <p className="text-sm">{hs.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Award className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-center text-muted-foreground">הספונסר אינו משויך לאף האקתון</p>
                <AdminOnly>
                  <Link href={`/sponsors/${params.id}/add-hackathon`} className="mt-4">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      הוסף להאקתון
                    </Button>
                  </Link>
                </AdminOnly>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
