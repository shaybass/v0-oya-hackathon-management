"use client"

import { createContext, useContext } from "react"

interface ChartContextType {
  config?: any
}

const ChartContext = createContext<ChartContextType>({})

export const ChartProvider = ChartContext.Provider

export function useChart() {
  return useContext(ChartContext)
}
