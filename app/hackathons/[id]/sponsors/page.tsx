import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Award, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminOnly } from "@/components/admin-only"

interface HackathonSponsorsPageProps {
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

async function getHackathonSponsors(hackathonId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("hackathon_sponsors")
    .select(`
      *,
      sponsor:sponsors(id, name, logo_url, sponsorship_level)
    `)
    .eq("hackathon_id", hackathonId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching hackathon sponsors:", error)
    return []
  }

  return data
}

export default async function HackathonSponsorsPage({ params }: HackathonSponsorsPageProps) {
  const hackathon = await getHackathon(params.id)

  if (!hackathon) {
    notFound()
  }

  const sponsors = await getHackathonSponsors(hackathon.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ספונסרים - {hackathon.name}</h1>
        <AdminOnly>
          <Link href={`/hackathons/${hackathon.id}/sponsors/add`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הוסף ספונסר
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {sponsors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsorship) => (
            <Link key={sponsorship.id} href={`/sponsors/${sponsorship.sponsor.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{sponsorship.sponsor.name}</CardTitle>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sponsorship.sponsor.logo_url && (
                      <div className="flex justify-center">
                        <img
                          src={sponsorship.sponsor.logo_url || "/placeholder.svg"}
                          alt={`${sponsorship.sponsor.name} Logo`}
                          className="max-h-20 max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      {sponsorship.sponsor.sponsorship_level && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">רמת חסות:</span>{" "}
                          {sponsorship.sponsor.sponsorship_level === "platinum"
                            ? "פלטינום"
                            : sponsorship.sponsor.sponsorship_level === "gold"
                              ? "זהב"
                              : sponsorship.sponsor.sponsorship_level === "silver"
                                ? "כסף"
                                : sponsorship.sponsor.sponsorship_level === "bronze"
                                  ? "ארד"
                                  : sponsorship.sponsor.sponsorship_level === "partner"
                                    ? "שותף"
                                    : sponsorship.sponsor.sponsorship_level}
                        </p>
                      )}
                      {sponsorship.sponsorship_type && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">סוג חסות:</span>{" "}
                          {sponsorship.sponsorship_type === "financial"
                            ? "כספית"
                            : sponsorship.sponsorship_type === "in-kind"
                              ? "שווה כסף"
                              : sponsorship.sponsorship_type === "services"
                                ? "שירותים"
                                : sponsorship.sponsorship_type === "products"
                                  ? "מוצרים"
                                  : sponsorship.sponsorship_type === "media"
                                    ? "מדיה"
                                    : sponsorship.sponsorship_type}
                        </p>
                      )}
                      {sponsorship.amount && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">סכום:</span> ₪{sponsorship.amount}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">סטטוס:</span>{" "}
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${
                            sponsorship.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : sponsorship.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : sponsorship.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : sponsorship.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {sponsorship.status === "completed"
                            ? "הושלם"
                            : sponsorship.status === "confirmed"
                              ? "מאושר"
                              : sponsorship.status === "pending"
                                ? "ממתין"
                                : sponsorship.status === "cancelled"
                                  ? "בוטל"
                                  : sponsorship.status}
                        </span>
                      </p>
                    </div>
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
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו ספונסרים להאקתון זה</p>
            <AdminOnly>
              <Link href={`/hackathons/${hackathon.id}/sponsors/add`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף ספונסר
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
