"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Team {
  id: string
  name: string
  hackathon_id: string
  hackathon: {
    name: string
  }
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם המשתתף חייב להכיל לפחות 2 תווים",
  }),
  phone: z.string().min(9, {
    message: "מספר טלפון חייב להכיל לפחות 9 תווים",
  }),
  email: z
    .string()
    .email({
      message: 'נא להזין כתובת דוא"ל תקינה',
    })
    .optional()
    .or(z.literal("")),
  class: z.string().optional(),
  role: z.string().optional(),
})

export default function RegisterPage({ params }: { params: { link: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      class: "",
      role: "",
    },
  })

  useEffect(() => {
    async function fetchTeam() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("teams")
          .select(
            `
            id, 
            name, 
            hackathon_id,
            hackathon:hackathons(name)
          `,
          )
          .eq("registration_link", params.link)
          .single()

        if (error) {
          console.error("Error fetching team:", error)
          toast({
            title: "שגיאה",
            description: "קישור ההרשמה אינו תקין או שפג תוקפו",
            variant: "destructive",
          })
          return
        }

        setTeam(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeam()
  }, [supabase, params.link, toast])

  // Generate a random barcode
  function generateBarcode() {
    return Math.floor(100000000 + Math.random() * 900000000).toString()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!team) return

    setIsSubmitting(true)

    try {
      const participantData = {
        ...values,
        hackathon_id: team.hackathon_id,
        team_id: team.id,
        barcode: generateBarcode(),
      }

      const { error } = await supabase.from("participants").insert([participantData])

      if (error) throw error

      setRegistrationComplete(true)
      toast({
        title: "הרשמה הושלמה בהצלחה",
        description: "נרשמת בהצלחה לצוות",
      })
    } catch (error) {
      console.error("Error registering participant:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת ההרשמה",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p>טוען...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">קישור לא תקין</CardTitle>
            <CardDescription className="text-center">
              קישור ההרשמה אינו תקין או שפג תוקפו. אנא פנה למארגני האירוע.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/")}>
              חזור לדף הבית
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (registrationComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">ההרשמה הושלמה בהצלחה!</CardTitle>
            <CardDescription className="text-center">
              נרשמת בהצלחה לצוות {team.name} בהאקתון {team.hackathon.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">תודה על הרשמתך!</p>
            <Button className="w-full" onClick={() => router.push("/")}>
              חזור לדף הבית
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>הרשמה לצוות {team.name}</CardTitle>
          <CardDescription>האקתון: {team.hackathon.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם מלא</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שמך המלא" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן מספר טלפון" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>דוא"ל (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder='הזן כתובת דוא"ל' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כיתה (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן כיתה" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תפקיד בצוות (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן תפקיד" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "מבצע רישום..." : "הירשם לצוות"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
