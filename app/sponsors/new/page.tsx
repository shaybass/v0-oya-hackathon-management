"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "שם הספונסר חייב להכיל לפחות 2 תווים",
  }),
  contact_person: z.string().optional(),
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
  address: z.string().optional(),
  logo_url: z.string().url({ message: "נא להזין כתובת URL תקינה" }).optional().or(z.literal("")),
  website: z.string().url({ message: "נא להזין כתובת URL תקינה" }).optional().or(z.literal("")),
  sponsorship_level: z.string().optional(),
  notes: z.string().optional(),
})

export default function NewSponsorPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      logo_url: "",
      website: "",
      sponsorship_level: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("sponsors").insert([values]).select()

      if (error) throw error

      toast({
        title: "ספונסר נוצר בהצלחה",
        description: "הספונסר החדש נוסף למערכת",
      })

      router.push("/sponsors")
    } catch (error) {
      console.error("Error creating sponsor:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת הספונסר",
        variant: "destructive",
      })
    }
  }

  const sponsorshipLevels = [
    { value: "platinum", label: "פלטינום" },
    { value: "gold", label: "זהב" },
    { value: "silver", label: "כסף" },
    { value: "bronze", label: "ארד" },
    { value: "partner", label: "שותף" },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת ספונסר חדש</CardTitle>
          <CardDescription>הוסף ספונסר חדש למאגר הספונסרים</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הספונסר</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שם הספונסר" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>איש קשר</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן שם איש קשר" {...field} />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן כתובת" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>קישור ללוגו</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן קישור ללוגו" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אתר אינטרנט</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן כתובת אתר" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sponsorship_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>רמת חסות</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר רמת חסות" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sponsorshipLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>הערות</FormLabel>
                    <FormControl>
                      <Textarea placeholder="הזן הערות נוספות" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">הוסף ספונסר</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
