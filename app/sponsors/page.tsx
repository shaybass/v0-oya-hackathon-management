import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Plus, Award } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getSponsors() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("sponsors").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching sponsors:", error)
    return []
  }

  return data
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ספונסרים</h1>
        <AdminOnly>
          <Link href="/sponsors/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              ספונסר חדש
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {sponsors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <Link key={sponsor.id} href={`/sponsors/${sponsor.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{sponsor.name}</CardTitle>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sponsor.contact_person && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">איש קשר:</span> {sponsor.contact_person}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">טלפון:</span> {sponsor.phone}
                    </p>
                    {sponsor.email && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">דוא"ל:</span> {sponsor.email}
                      </p>
                    )}
                    {sponsor.sponsorship_level && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">רמת חסות:</span> {sponsor.sponsorship_level}
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
            <Award className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין ספונסרים</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו ספונסרים למערכת</p>
            <AdminOnly>
              <Link href="/sponsors/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף ספונסר חדש
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
