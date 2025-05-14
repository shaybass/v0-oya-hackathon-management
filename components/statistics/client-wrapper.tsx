"use client"
import dynamic from "next/dynamic"

// Динамически импортируем клиентские компоненты
const StatisticsOverviewComponent = dynamic(
  () => import("@/components/statistics/overview").then((mod) => mod.StatisticsOverview),
  {
    ssr: false,
    loading: () => <div>טוען נתונים...</div>,
  },
)

const HackathonParticipantsChartComponent = dynamic(
  () => import("@/components/statistics/hackathon-participants-chart").then((mod) => mod.HackathonParticipantsChart),
  {
    ssr: false,
    loading: () => <div>טוען נתונים...</div>,
  },
)

const TeamDistributionChartComponent = dynamic(
  () => import("@/components/statistics/team-distribution-chart").then((mod) => mod.TeamDistributionChart),
  {
    ssr: false,
    loading: () => <div>טוען נתונים...</div>,
  },
)

const SponsorshipLevelsChartComponent = dynamic(
  () => import("@/components/statistics/sponsorship-levels-chart").then((mod) => mod.SponsorshipLevelsChart),
  {
    ssr: false,
    loading: () => <div>טוען נתונים...</div>,
  },
)

const ParticipantRegistrationTrendComponent = dynamic(
  () =>
    import("@/components/statistics/participant-registration-trend").then((mod) => mod.ParticipantRegistrationTrend),
  {
    ssr: false,
    loading: () => <div>טוען נתונים...</div>,
  },
)

export function StatisticsOverviewClient() {
  return <StatisticsOverviewComponent />
}

export function HackathonParticipantsChartClient() {
  return <HackathonParticipantsChartComponent />
}

export function TeamDistributionChartClient() {
  return <TeamDistributionChartComponent />
}

export function SponsorshipLevelsChartClient() {
  return <SponsorshipLevelsChartComponent />
}

export function ParticipantRegistrationTrendClient() {
  return <ParticipantRegistrationTrendComponent />
}
