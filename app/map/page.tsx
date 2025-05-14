import { MapView } from "@/components/map-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">מפת מיקומים</h1>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>מפת מיקומים</CardTitle>
          <CardDescription>צפה במיקומים של האקתונים, מנטורים, משתתפים וספקים</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <MapView />
        </CardContent>
      </Card>
    </div>
  )
}
