"use client"

import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SponsorshipData {
  level: string
  count: number
}

export function SponsorshipLevelsChart() {
  const [data, setData] = useState<SponsorshipData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClientSupabaseClient()

      // Получаем список уровней спонсорства
      const { data: sponsors } = await supabase.from("sponsors").select("sponsorship_level")

      if (!sponsors) {
        setLoading(false)
        return
      }

      // Подсчитываем количество спонсоров для каждого уровня
      const levelCounts: Record<string, number> = {}

      sponsors.forEach((sponsor) => {
        const level = sponsor.sponsorship_level || "לא מוגדר"
        levelCounts[level] = (levelCounts[level] || 0) + 1
      })

      // Преобразуем в формат для графика
      const sponsorshipData = Object.entries(levelCounts).map(([level, count]) => ({
        level,
        count,
      }))

      setData(sponsorshipData)
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
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip content={<ChartTooltipContent active={active} payload={payload} label={label} />} />
            )}
          />
          <Legend />
          <Bar dataKey="count" name="מספר ספונסרים" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
