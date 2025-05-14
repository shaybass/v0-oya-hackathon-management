import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CalendarDays, Users } from "lucide-react"
import { AdminOnly } from "@/components/admin-only"
import { Suspense } from "react"
import {
  StatisticsOverviewClient,
  HackathonParticipantsChartClient,
  TeamDistributionChartClient,
  SponsorshipLevelsChartClient,
  ParticipantRegistrationTrendClient,
} from "@/components/statistics/client-wrapper"

export default function StatisticsPage() {
  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">סטטיסטיקות מפורטות</h1>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="hackathons">האקתונים</TabsTrigger>
            <TabsTrigger value="participants">משתתפים וצוותים</TabsTrigger>
            <TabsTrigger value="sponsors">ספונסרים</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Suspense fallback={<div>טוען נתונים...</div>}>
              <StatisticsOverviewClient />
            </Suspense>
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  סטטיסטיקות האקתונים
                </CardTitle>
                <CardDescription>נתונים מפורטים על האקתונים במערכת</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <Suspense fallback={<div>טוען נתונים...</div>}>
                  <HackathonParticipantsChartClient />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  סטטיסטיקות משתתפים וצוותים
                </CardTitle>
                <CardDescription>נתונים מפורטים על משתתפים וצוותים במערכת</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <Suspense fallback={<div>טוען נתונים...</div>}>
                  <TeamDistributionChartClient />
                </Suspense>
                <Suspense fallback={<div>טוען נתונים...</div>}>
                  <ParticipantRegistrationTrendClient />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  סטטיסטיקות ספונסרים
                </CardTitle>
                <CardDescription>נתונים מפורטים על ספונסרים במערכת</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>טוען נתונים...</div>}>
                  <SponsorshipLevelsChartClient />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminOnly>
  )
}
