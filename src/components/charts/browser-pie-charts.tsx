"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const description = "A pie chart with a legend"

const chartConfig = {
  click_count: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartPieLegend({ shortCode }: {
  shortCode: string
}) {
  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"
  const [browserStats, setBrowserStats] = useState<(ClicksPerBrowser & { fill: string })[] | null>(null)

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await fetch(`${backendURL}/api/analytics/${shortCode}/browsers`)
        console.log({ res })
        if (!res.ok) {
          throw new Error(`Error occured while fetching ${res}`)
        }
        const data: ClicksPerBrowser[] = await res.json()
        if (data.length === 0) {
          toast("No records exist", {
            description: "Share the link to other to aggregate data."
          })
          return
        }

        let otherclick_count = 0;

        const fmtChartData: (ClicksPerBrowser & { fill: string })[] = data.map((dt) => {
          let fillColor = ""
          let browserName = ""
          switch (dt.browser.toLowerCase()) {
            case "chrome":
              fillColor = "var(--color-chrome)";
              browserName = dt.browser.toLowerCase()
              break;
            case "safari":
              fillColor = "var(--color-safari)";
              browserName = dt.browser.toLowerCase()

              break;
            case "firefox":
              browserName = dt.browser.toLowerCase()
              fillColor = "var(--color-firefox)";
              break;
            case "edge":
              browserName = dt.browser.toLowerCase()
              fillColor = "var(--color-edge)";
              break;
            default:
              browserName = "other"
              otherclick_count += dt.click_count
              fillColor = "var(--color-other)";
              break;
          }

          if (browserName !== "other") {
            return {
              browser: browserName,
              click_count: dt.click_count,
              fill: fillColor
            }
          }
          return null
        }).filter(Boolean) as (ClicksPerBrowser & { fill: string })[]

        if (otherclick_count > 0) {
          fmtChartData.push({
            browser: "other",
            click_count: otherclick_count,
            fill: "var(--color-other)"
          })
        }

        console.log({ fmtChartData, data })

        setBrowserStats(fmtChartData)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode])

  return (browserStats &&
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] min-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={browserStats}
              dataKey="click_count"
              label
              nameKey={"browser"}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
