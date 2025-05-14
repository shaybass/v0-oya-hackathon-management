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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם מנהל האירוע חייב להכיל לפחות 2 תווים",
  }),
  email: z.string().email({
    message: 'נא להזין כתובת דוא"ל תקינה',
  }),
  phone: z.string().min(9, {
    message: "מספר טלפון חייב להכיל לפחות 9 תווים",
  }),
  hackathon_id: z.string().uuid({
    message: "יש לבחור האקתון",
  }),
})

interface Hackathon {
  id: string
  name: string
}

export default function NewEventManagerPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      hackathon_id: "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("event_managers").insert([values]).select()

      if (error) throw error

      toast({
        title: "מנהל אירוע נוצר בהצלחה",
        description: "מנהל האירוע החדש נוסף למערכת",
      })

      router.push("/event-managers")
    } catch (error) {
      console.error("Error creating event manager:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת מנהל האירוע",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת מנהל אירוע חדש</CardTitle>
          <CardDescription>הוסף מנהל אירוע חדש למערכת</CardDescription>
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
                      <Input placeholder="הזן את שם מנהל האירוע" {...field} />
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

              <div className="flex justify-end">
                <Button type="submit">הוסף מנהל אירוע</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
