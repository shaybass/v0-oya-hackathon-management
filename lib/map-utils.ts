// פונקציות עזר למפה

export type LocationItem = {
  id: string
  name: string
  category: string
  latitude: number
  longitude: number
  address?: string
  description?: string
}

export type MapCategory = {
  id: string
  name: string
  color: string
}

export const MAP_CATEGORIES: MapCategory[] = [
  { id: "hackathons", name: "האקתונים", color: "#3b82f6" }, // כחול
  { id: "mentors", name: "מנטורים", color: "#10b981" }, // ירוק
  { id: "participants", name: "משתתפים", color: "#f59e0b" }, // כתום
  { id: "food_suppliers", name: "ספקי מזון", color: "#ef4444" }, // אדום
  { id: "shirt_suppliers", name: "ספקי חולצות", color: "#8b5cf6" }, // סגול
]

export const getCategoryColor = (categoryId: string): string => {
  const category = MAP_CATEGORIES.find((cat) => cat.id === categoryId)
  return category?.color || "#6b7280" // אפור כברירת מחדל
}

export const getCategoryName = (categoryId: string): string => {
  const category = MAP_CATEGORIES.find((cat) => cat.id === categoryId)
  return category?.name || "אחר"
}
