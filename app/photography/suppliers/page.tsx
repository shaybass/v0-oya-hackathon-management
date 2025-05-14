import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Camera, Plus } from "lucide-react"
import Link from "next/link"

async function getPhotographySuppliers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("photography_suppliers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching photography suppliers:", error)
    return []
  }

  return data
}

export default async function PhotographySuppliersPage() {
  const suppliers = await getPhotographySuppliers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ספקי צילום</h1>
        <Link href="/photography/suppliers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            ספק צילום חדש
          </Button>
        </Link>
      </div>

      {suppliers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Link key={supplier.id} href={`/photography/suppliers/${supplier.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{supplier.name}</CardTitle>
                  <Camera className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {supplier.contact_person && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">איש קשר:</span> {supplier.contact_person}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">טלפון:</span> {supplier.phone}
                    </p>
                    {supplier.email && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">דוא"ל:</span> {supplier.email}
                      </p>
                    )}
                    {supplier.address && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">כתובת:</span> {supplier.address}
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
            <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין ספקי צילום</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו ספקי צילום למערכת</p>
            <Link href="/photography/suppliers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                הוסף ספק צילום חדש
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
