import { ChartArea } from "@/components/ui/area-chart"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { ChartConfig } from "../ui/chart"


export const ClicksAreaChart = ({
  shortCode,
  timeRange
}: {
  shortCode: string
  timeRange: FilterTimeRange
}) => {
  const [rawClicksData, setRawClicksData] = useState<ClicksOverTime[] | null>(null)
  const [clicksData, setClicksData] = useState<ClicksOverTime[] | null>(null)
  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"

  // Chart configuration
  const redirectsConfig = {
    click_count: {
      label: "Redirects",
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig

  // Map timeRange to number of days
  const timeRangeMap: Record<FilterTimeRange, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '180d': 180,
    '365d': 365
  }

  // Fetch raw clicks data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendURL}/api/analytics/${shortCode}/days`)
        if (!res.ok) throw new Error(`Failed to fetch clicks: ${res.statusText}`)

        const data: ClicksOverTime[] = await res.json()
        if (!data || data.length === 0) {
          toast("No records exist", {
            description: "Share the link with others to get data."
          })
          return
        }

        setRawClicksData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [shortCode])

  // Filter clicks data whenever raw data or timeRange changes
  useEffect(() => {
    if (!rawClicksData) return

    const days = timeRangeMap[timeRange] ?? 0
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const filtered = rawClicksData.filter(item => new Date(item.day) >= cutoff)
    setClicksData(filtered)
  }, [rawClicksData, timeRange])

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex flex-row items-center gap-2 text-xl">
          <div className="w-2 h-2 aspect-square rounded-[1px] bg-chart-1"></div>
          <h1>Redirects</h1>
        </CardTitle>
        <CardDescription>
          Showing Redirects for the last {timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[350px] w-full px-2 pt-4 sm:px-6 sm:pt-6">
        {clicksData && redirectsConfig && (
          <ChartArea
            chartConfig={redirectsConfig}
            chartData={clicksData}
            cartesianGridVerticalLine={false}
            showXAxis
            timeRange={timeRange}
            showYAxis
            XTickCount={12}
            YTickCount={5}
            className="aspect-auto h-[300px] w-full"
          />
        )}
      </CardContent>
    </Card>
  )
}
