import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Camera, Plus } from "lucide-react"
import Link from "next/link"

async function getPhotographyOrders() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("photography_orders")
    .select(`
      *,
      hackathon:hackathons(name),
      supplier:photography_suppliers(name)
    `)
    .order("event_date", { ascending: false })

  if (error) {
    console.error("Error fetching photography orders:", error)
    return []
  }

  return data
}

export default async function PhotographyOrdersPage() {
  const orders = await getPhotographyOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות צילום</h1>
        <Link href="/photography/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            הזמנת צילום חדשה
          </Button>
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/photography/orders/${order.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{order.hackathon.name}</CardTitle>
                  <Camera className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">ספק:</span> {order.supplier.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">תאריך אירוע:</span>{" "}
                      {order.event_date ? new Date(order.event_date).toLocaleDateString("he-IL") : "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">עלות:</span> {order.cost ? `₪${order.cost}` : "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">סטטוס:</span>{" "}
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "completed" ? "הושלם" : order.status === "pending" ? "ממתין" : order.status}
                      </span>
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
            <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין הזמנות צילום</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו הזמנות צילום למערכת</p>
            <Link href="/photography/orders/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                הוסף הזמנת צילום חדשה
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
