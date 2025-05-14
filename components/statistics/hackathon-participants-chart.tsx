"use client"

import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HackathonData {
  name: string
  participants: number
  teams: number
}

export function HackathonParticipantsChart() {
  const [data, setData] = useState<HackathonData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClientSupabaseClient()

      // Получаем список хакатонов
      const { data: hackathons } = await supabase.from("hackathons").select("id, name")

      if (!hackathons) {
        setLoading(false)
        return
      }

      // Для каждого хакатона получаем количество участников и команд
      const hackathonData = await Promise.all(
        hackathons.map(async (hackathon) => {
          const { count: participantsCount } = await supabase
            .from("participants")
            .select("id", { count: "exact", head: true })
            .eq("hackathon_id", hackathon.id)

          const { count: teamsCount } = await supabase
            .from("teams")
            .select("id", { count: "exact", head: true })
            .eq("hackathon_id", hackathon.id)

          return {
            name: hackathon.name,
            participants: participantsCount || 0,
            teams: teamsCount || 0,
          }
        }),
      )

      setData(hackathonData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>טוען נתונים...</div>
  }

  if (data.length === 0) {
    return <div>אין נתונים להצגה</div>
  }

  return (
    <ChartContainer className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip content={<ChartTooltipContent active={active} payload={payload} label={label} />} />
            )}
          />
          <Legend />
          <Bar dataKey="participants" name="משתתפים" fill="#8884d8" />
          <Bar dataKey="teams" name="צוותים" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
