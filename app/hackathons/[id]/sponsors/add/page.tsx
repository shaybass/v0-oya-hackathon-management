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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Sponsor {
  id: string
  name: string
  sponsorship_level?: string
}

interface Hackathon {
  id: string
  name: string
}

const formSchema = z.object({
  sponsor_id: z.string().uuid({
    message: "יש לבחור ספונסר",
  }),
  sponsorship_type: z.string().min(1, {
    message: "יש לבחור סוג חסות",
  }),
  amount: z.string().optional(),
  description: z.string().optional(),
  status: z.string().min(1, {
    message: "יש לבחור סטטוס",
  }),
})

export default function AddSponsorToHackathonPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sponsor_id: "",
      sponsorship_type: "",
      amount: "",
      description: "",
      status: "pending",
    },
  })

  useEffect(() => {
    async function fetchData() {
      // Fetch hackathon details
      const { data: hackathonData, error: hackathonError } = await supabase
        .from("hackathons")
        .select("id, name")
        .eq("id", params.id)
        .single()

      if (hackathonError) {
        console.error("Error fetching hackathon:", hackathonError)
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת פרטי ההאקתון",
          variant: "destructive",
        })
        return
      }

      setHackathon(hackathonData)

      // Fetch sponsors
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("id, name, sponsorship_level")
        .order("name", { ascending: true })

      if (sponsorsError) {
        console.error("Error fetching sponsors:", sponsorsError)
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת רשימת הספונסרים",
          variant: "destructive",
        })
        return
      }

      // Filter out sponsors that are already associated with this hackathon
      const { data: existingSponsors, error: existingSponsorsError } = await supabase
        .from("hackathon_sponsors")
        .select("sponsor_id")
        .eq("hackathon_id", params.id)

      if (existingSponsorsError) {
        console.error("Error fetching existing sponsors:", existingSponsorsError)
      } else {
        const existingSponsorIds = new Set(existingSponsors.map((es) => es.sponsor_id))
        setSponsors(sponsorsData.filter((s) => !existingSponsorIds.has(s.id)))
      }
    }

    fetchData()
  }, [supabase, params.id, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convert amount to number if provided
      const formattedValues = {
        ...values,
        hackathon_id: params.id,
        amount: values.amount ? Number.parseFloat(values.amount) : null,
      }

      const { data, error } = await supabase.from("hackathon_sponsors").insert([formattedValues]).select()

      if (error) throw error

      toast({
        title: "הספונסר נוסף בהצלחה",
        description: "הספונסר נוסף להאקתון בהצלחה",
      })

      router.push(`/hackathons/${params.id}/sponsors`)
    } catch (error) {
      console.error("Error adding sponsor to hackathon:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת הוספת הספונסר",
        variant: "destructive",
      })
    }
  }

  const sponsorshipTypes = [
    { value: "financial", label: "כספית" },
    { value: "in-kind", label: "שווה כסף" },
    { value: "services", label: "שירותים" },
    { value: "products", label: "מוצרים" },
    { value: "media", label: "מדיה" },
    { value: "other", label: "אחר" },
  ]

  const statusOptions = [
    { value: "pending", label: "ממתין" },
    { value: "confirmed", label: "מאושר" },
    { value: "completed", label: "הושלם" },
    { value: "cancelled", label: "בוטל" },
  ]

  if (!hackathon) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת ספונסר להאקתון</CardTitle>
          <CardDescription>הוסף ספונסר להאקתון {hackathon.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">כל הספונסרים כבר משויכים להאקתון זה</p>
              <Button onClick={() => router.push(`/hackathons/${params.id}/sponsors`)} className="mt-4">
                חזור לרשימת הספונסרים
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="sponsor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ספונסר</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר ספונסר" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sponsors.map((sponsor) => (
                            <SelectItem key={sponsor.id} value={sponsor.id}>
                              {sponsor.name}
                              {sponsor.sponsorship_level && ` (${sponsor.sponsorship_level})`}
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
                  name="sponsorship_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סוג חסות</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סוג חסות" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sponsorshipTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סכום (אופציונלי)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="הזן סכום" {...field} />
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
                      <FormLabel>תיאור החסות (אופציונלי)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="הזן תיאור של החסות" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סטטוס</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סטטוס" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/hackathons/${params.id}/sponsors`)}
                  >
                    ביטול
                  </Button>
                  <Button type="submit">הוסף ספונסר</Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
