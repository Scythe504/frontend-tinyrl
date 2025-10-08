import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ChartConfig } from "../ui/chart"
import { ChartBar } from "../ui/bar-chart"

export const ReferrerBarChart = ({ shortCode }: {
  shortCode: string
}) => {
  const redirectsConfig = {
    click_count: {
      label: "Redirects",
      color: "var(--chart-1)",
    }
  } satisfies ChartConfig
  const [referrerStats, setReferrerStats] = useState<TrafficFromReferrer[] | null>(null)
  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await fetch(`${backendURL}/api/analytics/${shortCode}/referrers`)
        console.log({ res })
        if (!res.ok) {
          throw new Error(`Error occured while fetching ${res}`)
        }
        const data: TrafficFromReferrer[] = await res.json()
        if (data.length === 0) {
          toast("No records exist", {
            description: "Share the link to other to aggregate data."
          })
          return
        }

        setReferrerStats(data)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode, backendURL])

  return (referrerStats &&
    <ChartBar
      type="referrer"
      chartData={referrerStats}
      dataKey={"referrer"}
      chartConfig={redirectsConfig}
      cardTitle={"Referrers"}
      cardDescription={"Showing the number of clicks from different sources"}
    />
  )
}