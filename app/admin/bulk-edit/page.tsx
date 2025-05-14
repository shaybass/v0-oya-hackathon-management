"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Save, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { AdminOnly } from "@/components/admin-only"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function BulkEditPage() {
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})
  const [editedData, setEditedData] = useState<Record<string, any>>({})
  const supabase = createClientSupabaseClient()
  const { toast } = useToast()

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

  useEffect(() => {
    if (selectedTable) {
      fetchData()
    }
  }, [selectedTable])

  const fetchData = async () => {
    setIsLoading(true)
    setData([])
    setColumns([])
    setSelectedRows({})
    setEditedData({})

    try {
      const { data, error } = await supabase.from(selectedTable).select("*").limit(100)

      if (error) throw error

      if (data && data.length > 0) {
        setData(data)
        setColumns(Object.keys(data[0]))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הנתונים",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {}
    data.forEach((row) => {
      newSelectedRows[row.id] = checked
    })
    setSelectedRows(newSelectedRows)
  }

  const handleEdit = (id: string, column: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [column]: value,
      },
    }))
  }

  const saveChanges = async () => {
    setIsSaving(true)

    try {
      // עדכון כל שורה שנערכה
      for (const id in editedData) {
        const { error } = await supabase.from(selectedTable).update(editedData[id]).eq("id", id)

        if (error) throw error
      }

      toast({
        title: "השינויים נשמרו בהצלחה",
        description: `${Object.keys(editedData).length} רשומות עודכנו`,
      })

      // רענון הנתונים
      fetchData()
      setEditedData({})
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת השינויים",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const deleteSelected = async () => {
    const selectedIds = Object.entries(selectedRows)
      .filter(([_, selected]) => selected)
      .map(([id]) => id)

    if (!selectedIds.length) return

    if (!confirm(`האם אתה בטוח שברצונך למחוק ${selectedIds.length} רשומות?`)) return

    setIsSaving(true)

    try {
      const { error } = await supabase.from(selectedTable).delete().in("id", selectedIds)

      if (error) throw error

      toast({
        title: "הרשומות נמחקו בהצלחה",
        description: `${selectedIds.length} רשומות נמחקו`,
      })

      // רענון הנתונים
      fetchData()
    } catch (error) {
      console.error("Error deleting records:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת הרשומות",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderCellValue = (row: any, column: string) => {
    const value = editedData[row.id]?.[column] !== undefined ? editedData[row.id][column] : row[column]

    if (value === null || value === undefined) return ""

    if (typeof value === "boolean") {
      return value ? "כן" : "לא"
    }

    if (typeof value === "object") {
      return JSON.stringify(value)
    }

    if (column.includes("date") && typeof value === "string" && value.includes("T")) {
      return new Date(value).toLocaleString("he-IL")
    }

    return String(value)
  }

  const isEditable = (column: string) => {
    // רשימת עמודות שלא ניתן לערוך
    const nonEditableColumns = ["id", "created_at", "updated_at"]
    return !nonEditableColumns.includes(column)
  }

  const renderEditableCell = (row: any, column: string) => {
    if (!isEditable(column)) {
      return renderCellValue(row, column)
    }

    const value = editedData[row.id]?.[column] !== undefined ? editedData[row.id][column] : row[column]

    if (typeof row[column] === "boolean") {
      return <Checkbox checked={value === true} onCheckedChange={(checked) => handleEdit(row.id, column, checked)} />
    }

    return (
      <Input
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(e) => handleEdit(row.id, column, e.target.value)}
        className="h-8 w-full"
      />
    )
  }

  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">עריכה מרוכזת</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>עריכת נתונים</CardTitle>
            <CardDescription>בחר טבלה לעריכת הנתונים בה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">בחר טבלה</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר טבלה לעריכה" />
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

              {selectedTable && (
                <div className="flex justify-between">
                  <Button
                    onClick={saveChanges}
                    disabled={!Object.keys(editedData).length || isSaving}
                    className="flex items-center"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    שמור שינויים
                  </Button>
                  <Button
                    onClick={deleteSelected}
                    disabled={!Object.values(selectedRows).some(Boolean) || isSaving}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    מחק נבחרים
                  </Button>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-right">
                          <Checkbox
                            checked={Object.keys(selectedRows).length > 0 && Object.values(selectedRows).every(Boolean)}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        {columns.map((column) => (
                          <th key={column} className="p-2 text-right font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-muted/20">
                          <td className="p-2">
                            <Checkbox
                              checked={selectedRows[row.id] || false}
                              onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                            />
                          </td>
                          {columns.map((column) => (
                            <td key={`${row.id}-${column}`} className="p-2">
                              {renderEditableCell(row, column)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedTable ? (
                <div className="py-8 text-center text-muted-foreground">אין נתונים בטבלה זו</div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  )
}
