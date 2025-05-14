import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CalendarDays, Camera, ClipboardList, Cog, Printer, Shirt, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { AdminOnly } from "@/components/admin-only"

export default function AdminPage() {
  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">לוח בקרה למנהל</h1>
        </div>

        <Tabs defaultValue="hackathons">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="hackathons">האקתונים</TabsTrigger>
            <TabsTrigger value="mentors">מנטורים</TabsTrigger>
            <TabsTrigger value="participants">משתתפים</TabsTrigger>
            <TabsTrigger value="food">מזון</TabsTrigger>
            <TabsTrigger value="shirts">חולצות</TabsTrigger>
            <TabsTrigger value="photography">צילום</TabsTrigger>
            <TabsTrigger value="printing">דפוס</TabsTrigger>
            <TabsTrigger value="prizes">פרסים</TabsTrigger>
            <TabsTrigger value="managers">מנהלי אירוע</TabsTrigger>
          </TabsList>

          <TabsContent value="hackathons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  ניהול האקתונים
                </CardTitle>
                <CardDescription>צפייה, עריכה ומחיקה של האקתונים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/hackathons">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">צפייה בהאקתונים</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">צפייה ברשימת כל ההאקתונים במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/hackathons/new">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הוספת האקתון חדש</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">יצירת אירוע האקתון חדש במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  ניהול מנטורים
                </CardTitle>
                <CardDescription>צפייה, עריכה ומחיקה של מנטורים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/mentors">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">צפייה במנטורים</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">צפייה ברשימת כל המנטורים במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/mentors/new">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הוספת מנטור חדש</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">הוספת מנטור חדש למאגר המנטורים</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  ניהול משתתפים
                </CardTitle>
                <CardDescription>צפייה, עריכה ומחיקה של משתתפים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/participants">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">צפייה במשתתפים</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">צפייה ברשימת כל המשתתפים במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/participants/new">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הוספת משתתף חדש</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">הוספת משתתף חדש למערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5" />
                  ניהול מזון
                </CardTitle>
                <CardDescription>ניהול ספקי מזון והזמנות מזון</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/food/suppliers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ספקי מזון</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול ספקי המזון במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/food/orders">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הזמנות מזון</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול הזמנות המזון במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shirts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shirt className="mr-2 h-5 w-5" />
                  ניהול חולצות
                </CardTitle>
                <CardDescription>ניהול ספקי חולצות והזמנות חולצות</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/shirts/suppliers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ספקי חולצות</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול ספקי החולצות במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/shirts/orders">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הזמנות חולצות</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול הזמנות החולצות במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  ניהול צילום
                </CardTitle>
                <CardDescription>ניהול ספקי צילום והזמנות צילום</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/photography/suppliers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ספקי צילום</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול ספקי הצילום במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/photography/orders">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הזמנות צילום</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול הזמנות הצילום במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="printing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Printer className="mr-2 h-5 w-5" />
                  ניהול דפוס
                </CardTitle>
                <CardDescription>ניהול ספקי דפוס והזמנות דפוס</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/printing/suppliers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ספקי דפוס</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול ספקי הדפוס במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/printing/orders">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">הזמנות דפוס</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול הזמנות הדפוס במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  ניהול פרסים
                </CardTitle>
                <CardDescription>ניהול ספקי פרסים ורשימת פרסים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/prizes/suppliers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ספקי פרסים</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול ספקי הפרסים במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/prizes/list">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">רשימת פרסים</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול הפרסים במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="managers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  ניהול מנהלי אירוע
                </CardTitle>
                <CardDescription>צפייה, עריכה ומחיקה של מנהלי אירוע</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/event-managers">
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">מנהלי אירוע</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">ניהול מנהלי האירוע במערכת</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cog className="mr-2 h-5 w-5" />
              כלי ניהול מתקדמים
            </CardTitle>
            <CardDescription>כלים מתקדמים לניהול המערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Link href="/admin/bulk-edit">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">עריכה מרוכזת</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">עריכה מרוכזת של נתונים במערכת</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/export">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ייצוא נתונים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">ייצוא נתונים מהמערכת לקבצי CSV</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/import">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ייבוא נתונים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">ייבוא נתונים למערכת מקבצי CSV</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  )
}
