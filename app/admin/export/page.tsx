"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Download } from "lucide-react"
import { useState } from "react"
import { AdminOnly } from "@/components/admin-only"

export default function ExportDataPage() {
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [isExporting, setIsExporting] = useState(false)
  const supabase = createClientSupabaseClient()

  const tables = [
    { value: "hackathons", label: "האקתונים" },
    { value: "mentors", label: "מנטורים" },
    { value: "participants", label: "משתתפים" },
    { value: "event_managers", label: "מנהלי אירוע" },
    { value: "food_suppliers", label: "ספקי מזון" },
    { value: "food_orders", label: "הזמנות מזון" },
    { value: "shirt_suppliers", label: "ספקי חולצות" },
    { value: "shirt_orders", label: "הזמנות חולצות" },
    { value: "shirt_sizes", label: "מידות חולצות" },
    { value: "photography_suppliers", label: "ספקי צילום" },
    { value: "photography_orders", label: "הזמנות צילום" },
    { value: "printing_suppliers", label: "ספקי דפוס" },
    { value: "printing_orders", label: "הזמנות דפוס" },
    { value: "prize_suppliers", label: "ספקי פרסים" },
    { value: "prizes", label: "פרסים" },
    { value: "branding_materials", label: "חומרי מיתוג" },
  ]

  const exportData = async () => {
    if (!selectedTable) return

    setIsExporting(true)

    try {
      const { data, error } = await supabase.from(selectedTable).select("*")

      if (error) throw error

      // המרת הנתונים ל-CSV
      const headers = Object.keys(data[0] || {}).join(",")
      const rows = data.map((row) => Object.values(row).map(formatCsvValue).join(","))
      const csv = [headers, ...rows].join("\n")

      // יצירת קובץ להורדה
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${selectedTable}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("אירעה שגיאה בייצוא הנתונים")
    } finally {
      setIsExporting(false)
    }
  }

  // פונקציה להמרת ערך לפורמט CSV תקין
  const formatCsvValue = (value: any) => {
    if (value === null || value === undefined) return ""
    if (typeof value === "object") value = JSON.stringify(value)
    value = String(value)
    // אם הערך מכיל פסיק או גרש, עטוף אותו במרכאות כפולות
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ייצוא נתונים</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ייצוא נתונים לקובץ CSV</CardTitle>
            <CardDescription>בחר טבלה לייצוא הנתונים ממנה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">בחר טבלה</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר טבלה לייצוא" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.value} value={table.value}>
                        {table.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={exportData} disabled={!selectedTable || isExporting} className="w-full">
                {isExporting ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    מייצא...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    ייצוא נתונים
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  )
}
