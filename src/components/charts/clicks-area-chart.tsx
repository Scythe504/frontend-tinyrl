import { ChartArea } from "@/components/ui/area-chart"
import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { ChartConfig } from "../ui/chart"
import { AnimatePresence, motion } from "framer-motion"


export const ClicksAreaChart = ({
  shortCode,
  timeRange
}: {
  shortCode: string
  timeRange: FilterTimeRange
}) => {
  const [rawClicksData, setRawClicksData] = useState<ClicksOverTime[] | null>(null)
  const [clicksData, setClicksData] = useState<ClicksOverTime[] | null>(null)
  const [totalClicks, setTotalClicks] = useState(0)
  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"

  // Chart configuration
  const redirectsConfig = {
    click_count: {
      label: "Redirects",
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig

  // Map timeRange to number of days
  const timeRangeMap: Record<FilterTimeRange, number> = useMemo(() => ({
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '180d': 180,
    '365d': 365
  }), [])

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
  }, [shortCode, backendURL])

  // Filter clicks data whenever raw data or timeRange changes
  useEffect(() => {
    if (!rawClicksData) return

    const days = timeRangeMap[timeRange] ?? 0
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    let clickCount = 0;
    const filtered = rawClicksData.filter(item => new Date(item.day) >= cutoff)
    setTotalClicks(clickCount)
    filtered.forEach((val) => clickCount += val.click_count)
    setTotalClicks(clickCount)
    setClicksData(filtered)
  }, [rawClicksData, timeRange, timeRangeMap])

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex flex-row items-center gap-2 sm:text-xl text-lg">
          <div className="w-2 h-2 aspect-square rounded-[1px] bg-chart-1"></div>
          <div>Redirects [{<AnimatePresence mode="popLayout">
            <motion.span
              key={totalClicks} // causes reanimation on change
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="ml-2 font-mono"
            >
              {totalClicks.toLocaleString()}
            </motion.span>
          </AnimatePresence>} ]
          </div>
        </CardTitle>
        <CardDescription>
          Showing Redirects for the last {timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent className="sm:px-2 sm:pt-5 p-0 mt-4.5">
        {clicksData && redirectsConfig && (
          <ChartArea
            chartConfig={redirectsConfig}
            chartData={clicksData}
            cartesianGridVerticalLine={false}
            showXAxis
            timeRange={timeRange}
            showYAxis
            XTickCount={5}
            YTickCount={5}
            className="sm:h-[300px] min-h-[200px] w-full -translate-x-4"
          />
        )}
      </CardContent>
    </Card>
  )
}
