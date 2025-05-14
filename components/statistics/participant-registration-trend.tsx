"use client"

import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface RegistrationData {
  date: string
  count: number
}

export function ParticipantRegistrationTrend() {
  const [data, setData] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClientSupabaseClient()

      // Получаем список участников с датой регистрации
      const { data: participants } = await supabase.from("participants").select("created_at").order("created_at")

      if (!participants || participants.length === 0) {
        setLoading(false)
        return
      }

      // Группируем по дате (без времени)
      const dateGroups: Record<string, number> = {}

      participants.forEach((participant) => {
        const date = new Date(participant.created_at).toISOString().split("T")[0]
        dateGroups[date] = (dateGroups[date] || 0) + 1
      })

      // Преобразуем в формат для графика и сортируем по дате
      let registrationData = Object.entries(dateGroups)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Добавляем накопительный итог
      let cumulativeCount = 0
      registrationData = registrationData.map((item) => {
        cumulativeCount += item.count
        return {
          ...item,
          count: cumulativeCount,
        }
      })

      setData(registrationData)
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
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip content={<ChartTooltipContent active={active} payload={payload} label={label} />} />
            )}
          />
          <Legend />
          <Line type="monotone" dataKey="count" name="מספר משתתפים מצטבר" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
