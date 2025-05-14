import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Award, Plus } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getPrizes() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("prizes")
    .select(`
      *,
      hackathon:hackathons(name),
      supplier:prize_suppliers(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching prizes:", error)
    return []
  }

  return data
}

export default async function PrizesListPage() {
  const prizes = await getPrizes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">רשימת פרסים</h1>
        <AdminOnly>
          <Link href="/prizes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              פרס חדש
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {prizes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prizes.map((prize) => (
            <Link key={prize.id} href={`/prizes/${prize.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{prize.name}</CardTitle>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">האקתון:</span> {prize.hackathon?.name || "לא צוין"}
                    </p>
                    {prize.supplier && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">ספק:</span> {prize.supplier.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">סוג:</span> {prize.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">ערך:</span> {prize.value ? `₪${prize.value}` : "לא צוין"}
                    </p>
                    {prize.sponsor && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">נותן חסות:</span> {prize.sponsor}
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
            <p className="mb-2 text-lg font-medium">אין פרסים</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו פרסים למערכת</p>
            <AdminOnly>
              <Link href="/prizes/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף פרס חדש
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
