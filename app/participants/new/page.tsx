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

interface Team {
  id: string
  name: string
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
  hackathon_id: z.string().uuid({
    message: "יש לבחור האקתון",
  }),
  team_id: z.string().uuid().optional(),
  participant_type: z.string().optional(),
  organization: z.string().optional(),
  class: z.string().optional(),
  role: z.string().optional(),
  barcode: z.string().optional(),
})

export default function NewParticipantPage() {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      hackathon_id: "",
      team_id: "",
      participant_type: "",
      organization: "",
      class: "",
      role: "",
      barcode: generateBarcode(),
    },
  })

  // Generate a random barcode
  function generateBarcode() {
    return Math.floor(100000000 + Math.random() * 900000000).toString()
  }

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

  useEffect(() => {
    async function fetchTeams() {
      if (!selectedHackathon) {
        setTeams([])
        return
      }

      const { data, error } = await supabase
        .from("teams")
        .select("id, name")
        .eq("hackathon_id", selectedHackathon)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching teams:", error)
        return
      }

      setTeams(data || [])
    }

    fetchTeams()
  }, [supabase, selectedHackathon])

  // Update teams when hackathon changes
  const onHackathonChange = (hackathonId: string) => {
    setSelectedHackathon(hackathonId)
    form.setValue("hackathon_id", hackathonId)
    form.setValue("team_id", "")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("participants").insert([values]).select()

      if (error) throw error

      toast({
        title: "משתתף נוצר בהצלחה",
        description: "המשתתף החדש נוסף למערכת",
      })

      router.push("/participants")
    } catch (error) {
      console.error("Error creating participant:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת המשתתף",
        variant: "destructive",
      })
    }
  }

  const participantTypes = [
    { value: "student", label: "תלמיד/ה" },
    { value: "teacher", label: "מורה" },
    { value: "professional", label: "איש/אשת מקצוע" },
    { value: "other", label: "אחר" },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>הוספת משתתף חדש</CardTitle>
          <CardDescription>הוסף משתתף חדש למערכת</CardDescription>
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
                      <Input placeholder="הזן את שם המשתתף" {...field} />
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
                    <Select onValueChange={onHackathonChange} defaultValue={field.value}>
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
                name="team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>צוות (אופציונלי)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedHackathon}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedHackathon ? "בחר צוות" : "יש לבחור האקתון תחילה"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="participant_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סוג משתתף</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סוג משתתף" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {participantTypes.map((type) => (
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
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ארגון (אופציונלי)</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן שם ארגון" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>תפקיד (אופציונלי)</FormLabel>
                      <FormControl>
                        <Input placeholder="הזן תפקיד" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ברקוד</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">הוסף משתתף</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
