import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Plus, Printer } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

async function getPrintingOrders() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("printing_orders")
    .select(`
      *,
      hackathon:hackathons(name),
      supplier:printing_suppliers(name)
    `)
    .order("delivery_date", { ascending: false })

  if (error) {
    console.error("Error fetching printing orders:", error)
    return []
  }

  return data
}

export default async function PrintingOrdersPage() {
  const orders = await getPrintingOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות דפוס</h1>
        <AdminOnly>
          <Link href="/printing/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הזמנת דפוס חדשה
            </Button>
          </Link>
        </AdminOnly>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/printing/orders/${order.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{order.hackathon?.name || "ללא האקתון"}</CardTitle>
                  <Printer className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">סוג פריט:</span> {order.item_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">ספק:</span> {order.supplier?.name || "לא צוין"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">כמות:</span> {order.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">תאריך אספקה:</span>{" "}
                      {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("he-IL") : "לא צוין"}
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
            <Printer className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">אין הזמנות דפוס</p>
            <p className="mb-4 text-sm text-muted-foreground">עדיין לא נוספו הזמנות דפוס למערכת</p>
            <AdminOnly>
              <Link href="/printing/orders/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  הוסף הזמנת דפוס חדשה
                </Button>
              </Link>
            </AdminOnly>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
