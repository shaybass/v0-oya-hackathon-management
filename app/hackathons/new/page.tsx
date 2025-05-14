"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם האקתון חייב להכיל לפחות 2 תווים",
  }),
  description: z.string().optional(),
  location: z.string().min(2, {
    message: "מיקום האקתון חייב להכיל לפחות 2 תווים",
  }),
  start_date: z.string().min(1, {
    message: "תאריך התחלה הוא שדה חובה",
  }),
  end_date: z.string().min(1, {
    message: "תאריך סיום הוא שדה חובה",
  }),
  challenge: z.string().optional(),
  registration_link: z
    .string()
    .url({
      message: "נא להזין כתובת URL תקינה",
    })
    .optional()
    .or(z.literal("")),
})

export default function NewHackathonPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      start_date: "",
      end_date: "",
      challenge: "",
      registration_link: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("hackathons").insert([values]).select()

      if (error) throw error

      toast({
        title: "האקתון נוצר בהצלחה",
        description: "האקתון החדש נוסף למערכת",
      })

      router.push("/hackathons")
    } catch (error) {
      console.error("Error creating hackathon:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת האקתון",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>יצירת האקתון חדש</CardTitle>
          <CardDescription>הוסף האקתון חדש למערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם האקתון</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שם האקתון" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור</FormLabel>
                    <FormControl>
                      <Textarea placeholder="הזן תיאור של האקתון" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את מיקום האקתון" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך התחלה</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך סיום</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="challenge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אתגר</FormLabel>
                    <FormControl>
                      <Textarea placeholder="הזן את האתגר של האקתון" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>קישור הרשמה</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן קישור להרשמה" {...field} />
                    </FormControl>
                    <FormDescription>קישור לטופס הרשמה למשתתפים</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">צור האקתון</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
