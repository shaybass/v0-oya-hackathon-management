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

const formSchema = z.object({
  hackathon_id: z.string().uuid({
    message: "יש לבחור האקתון",
  }),
  sponsorship_type: z.string().optional(),
  amount: z.string().optional(),
  description: z.string().optional(),
  status: z.string().default("pending"),
})

export default function AddHackathonToSponsorPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [hackathons, setHackathons] = useState<any[]>([])
  const [sponsor, setSponsor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hackathon_id: "",
      sponsorship_type: "",
      amount: "",
      description: "",
      status: "pending",
    },
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch sponsor details
        const { data: sponsorData, error: sponsorError } = await supabase
          .from("sponsors")
          .select("*")
          .eq("id", params.id)
          .single()

        if (sponsorError) throw sponsorError
        setSponsor(sponsorData)

        // Fetch hackathons
        const { data: hackathonsData, error: hackathonsError } = await supabase
          .from("hackathons")
          .select("id, name, start_date, end_date")
          .order("start_date", { ascending: false })

        if (hackathonsError) throw hackathonsError
        setHackathons(hackathonsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת הנתונים",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, supabase, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convert amount to number if provided
      const formattedValues = {
        ...values,
        sponsor_id: params.id,
        amount: values.amount ? Number.parseFloat(values.amount) : null,
      }

      const { data, error } = await supabase.from("hackathon_sponsors").insert([formattedValues]).select()

      if (error) throw error

      toast({
        title: "הספונסר נוסף להאקתון בהצלחה",
        description: "החסות נוספה בהצלחה",
      })

      router.push(`/sponsors/${params.id}`)
    } catch (error: any) {
      console.error("Error adding hackathon to sponsor:", error)

      // Check if it's a unique constraint violation
      if (error.code === "23505") {
        toast({
          title: "שגיאה",
          description: "הספונסר כבר משויך להאקתון זה",
          variant: "destructive",
        })
      } else {
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בעת הוספת הספונסר להאקתון",
          variant: "destructive",
        })
      }
    }
  }

  const sponsorshipTypes = [
    { value: "financial", label: "כספית" },
    { value: "in-kind", label: "שווה כסף" },
    { value: "services", label: "שירותים" },
    { value: "products", label: "מוצרים" },
    { value: "other", label: "אחר" },
  ]

  const statusOptions = [
    { value: "pending", label: "ממתין" },
    { value: "confirmed", label: "מאושר" },
    { value: "completed", label: "הושלם" },
    { value: "cancelled", label: "בוטל" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>טוען נתונים...</p>
        </div>
      </div>
    )
  }

  if (!sponsor) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-lg font-medium">הספונסר לא נמצא</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת {sponsor.name} להאקתון</CardTitle>
          <CardDescription>בחר האקתון והגדר את פרטי החסות</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>סכום (₪)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="הזן סכום" {...field} />
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
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור החסות</FormLabel>
                    <FormControl>
                      <Textarea placeholder="הזן תיאור של החסות" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">הוסף להאקתון</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
