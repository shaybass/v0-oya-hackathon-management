"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Upload } from "lucide-react"
import { useState, useRef } from "react"
import { AdminOnly } from "@/components/admin-only"

export default function ImportDataPage() {
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const importData = async () => {
    if (!selectedTable || !fileInputRef.current?.files?.length) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const file = fileInputRef.current.files[0]
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const csv = e.target?.result as string
          const rows = csv.split("\n")
          const headers = rows[0].split(",")

          const data = rows
            .slice(1)
            .filter((row) => row.trim())
            .map((row) => {
              const values = parseCSVRow(row)
              const obj: Record<string, any> = {}

              headers.forEach((header, index) => {
                obj[header] = values[index] === "" ? null : values[index]
              })

              return obj
            })

          // מחיקת שדות שלא צריכים להיות בהכנסה (כמו id, created_at, updated_at)
          data.forEach((item) => {
            delete item.id
            delete item.created_at
            delete item.updated_at
          })

          const { error } = await supabase.from(selectedTable).insert(data)

          if (error) throw error

          setImportResult({
            success: true,
            message: `ייבוא הצליח! ${data.length} רשומות יובאו בהצלחה.`,
          })
        } catch (error) {
          console.error("Error processing CSV:", error)
          setImportResult({
            success: false,
            message: `שגיאה בעיבוד הקובץ: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`,
          })
        } finally {
          setIsImporting(false)
        }
      }

      reader.onerror = () => {
        setImportResult({
          success: false,
          message: "שגיאה בקריאת הקובץ",
        })
        setIsImporting(false)
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error importing data:", error)
      setImportResult({
        success: false,
        message: `שגיאה בייבוא הנתונים: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`,
      })
      setIsImporting(false)
    }
  }

  // פונקציה לפירוק שורת CSV תוך התחשבות במרכאות
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]

      if (char === '"') {
        // אם יש מרכאות כפולות ברצף, זה מייצג מרכאה אחת בתוך ערך
        if (i + 1 < row.length && row[i + 1] === '"') {
          current += '"'
          i++ // דלג על המרכאה הבאה
        } else {
          // החלף מצב מרכאות
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        // סיום שדה
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }

    // הוסף את השדה האחרון
    result.push(current)

    return result
  }

  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ייבוא נתונים</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ייבוא נתונים מקובץ CSV</CardTitle>
            <CardDescription>בחר טבלה וקובץ CSV לייבוא נתונים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">בחר טבלה</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר טבלה לייבוא" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">בחר קובץ CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button
                onClick={importData}
                disabled={!selectedTable || !fileInputRef.current?.files?.length || isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    מייבא...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    ייבוא נתונים
                  </span>
                )}
              </Button>

              {importResult && (
                <div
                  className={`mt-4 rounded-md p-4 ${
                    importResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {importResult.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  )
}
