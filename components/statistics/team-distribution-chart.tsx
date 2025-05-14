"use client"

import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TeamData {
  name: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function TeamDistributionChart() {
  const [data, setData] = useState<TeamData[]>([])
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

      // Для каждого хакатона получаем количество команд
      const teamData = await Promise.all(
        hackathons.map(async (hackathon) => {
          const { count: teamsCount } = await supabase
            .from("teams")
            .select("id", { count: "exact", head: true })
            .eq("hackathon_id", hackathon.id)

          return {
            name: hackathon.name,
            value: teamsCount || 0,
          }
        }),
      )

      // Фильтруем хакатоны без команд
      const filteredData = teamData.filter((item) => item.value > 0)

      setData(filteredData)
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip content={<ChartTooltipContent active={active} payload={payload} label={label} />} />
            )}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
