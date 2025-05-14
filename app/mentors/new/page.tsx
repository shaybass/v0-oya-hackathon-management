"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם המנטור חייב להכיל לפחות 2 תווים",
  }),
  id_number: z.string().min(5, {
    message: "מספר ת.ז. חייב להכיל לפחות 5 תווים",
  }),
  phone: z.string().min(9, {
    message: "מספר טלפון חייב להכיל לפחות 9 תווים",
  }),
  email: z.string().email({
    message: 'נא להזין כתובת דוא"ל תקינה',
  }),
  occupation: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  is_potential: z.boolean().default(true),
  is_event_manager: z.boolean().default(false),
})

export default function NewMentorPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id_number: "",
      phone: "",
      email: "",
      occupation: "",
      organization: "",
      location: "",
      is_potential: true,
      is_event_manager: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("mentors").insert([values]).select()

      if (error) throw error

      toast({
        title: "מנטור נוצר בהצלחה",
        description: "המנטור החדש נוסף למערכת",
      })

      router.push("/mentors")
    } catch (error) {
      console.error("Error creating mentor:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת המנטור",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת מנטור חדש</CardTitle>
          <CardDescription>הוסף מנטור חדש למאגר המנטורים</CardDescription>
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
                      <Input placeholder="הזן את שם המנטור" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר ת.ז.</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן מספר ת.ז." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>דוא"ל</FormLabel>
                      <FormControl>
                        <Input placeholder='הזן כתובת דוא"ל' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תפקיד</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן תפקיד" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ארגון</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן שם ארגון" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן מיקום (עיר)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_potential"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">מנטור פוטנציאלי</FormLabel>
                        <FormDescription>האם זהו מנטור פוטנציאלי שטרם שובץ להאקתון?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_event_manager"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">מנהל אירוע</FormLabel>
                        <FormDescription>האם מנטור זה יכול לשמש כמנהל אירוע?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">הוסף מנטור</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
