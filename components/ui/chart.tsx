"use client"

import type * as React from "react"
import { createContext, useContext } from "react"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextValue>({ config: {} })

export function useChart() {
  return useContext(ChartContext)
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config = {}, className, children, ...props }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={className}
        style={
          {
            "--chart-count": Object.keys(config).length,
            ...Object.fromEntries(
              Object.entries(config).flatMap(([key, value], index) => [
                [`--color-${key}`, value.color],
                [`--label-${key}`, value.label],
              ]),
            ),
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipProps {
  content: React.ReactNode
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <>{content}</>
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: string | number
    payload: {
      [key: string]: any
    }
  }>
  label?: string
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-flow-col gap-2">
        <div className="font-medium">{label}</div>
      </div>
      <div className="mt-1 grid gap-0.5">
        {payload.map((data, i) => (
          <div key={i} className="flex items-center gap-1 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: data.color,
              }}
            />
            <span className="font-medium tabular-nums">{data.value}</span>
            <span className="text-muted-foreground">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
