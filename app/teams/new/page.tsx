"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Hackathon {
  id: string
  name: string
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם הצוות חייב להכיל לפחות 2 תווים",
  }),
  hackathon_id: z.string().uuid({
    message: "יש לבחור האקתון",
  }),
  project_name: z.string().optional(),
})

export default function NewTeamPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [registrationLink, setRegistrationLink] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hackathon_id: "",
      project_name: "",
    },
  })

  useEffect(() => {
    async function fetchHackathons() {
      const { data, error } = await supabase.from("hackathons").select("id, name").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching hackathons:", error)
        return
      }

      setHackathons(data || [])
    }

    fetchHackathons()
  }, [supabase])

  // Generate a unique registration link
  function generateRegistrationLink() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Generate a unique registration link
      const link = generateRegistrationLink()
      setRegistrationLink(link)

      const { data, error } = await supabase
        .from("teams")
        .insert([{ ...values, registration_link: link }])
        .select()

      if (error) throw error

      toast({
        title: "צוות נוצר בהצלחה",
        description: "הצוות החדש נוסף למערכת",
      })

      router.push("/teams")
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת הצוות",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>יצירת צוות חדש</CardTitle>
          <CardDescription>הוסף צוות חדש למערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הצוות</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שם הצוות" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hackathon_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>האקתון</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר האקתון" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hackathons.map((hackathon) => (
                          <SelectItem key={hackathon.id} value={hackathon.id}>
                            {hackathon.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הפרויקט (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שם הפרויקט" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">צור צוות</Button>
              </div>
            </form>
          </Form>

          {registrationLink && (
            <div className="mt-6 rounded-md bg-primary/10 p-4">
              <h3 className="mb-2 font-medium">קישור הרשמה לצוות:</h3>
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/register/${registrationLink}`}
                  readOnly
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/register/${registrationLink}`)
                    toast({
                      title: "הקישור הועתק",
                      description: "קישור ההרשמה הועתק ללוח",
                    })
                  }}
                >
                  העתק
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">שתף קישור זה עם משתתפים כדי שיוכלו להירשם לצוות זה</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
