"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { FormatISOtoDate, FormatISOtoMonth } from "@/lib/utils"

export const description = "Clicks on a Day"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLine({ shortCode }: {
  shortCode: string
}) {
  const [clicksData, setClicksData] = useState<ClicksOverTime[] | null>(null)
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await fetch(`${backendURL}/api/analytics/${shortCode}/days`)
        console.log({ res })
        if (!res.ok) {
          throw new Error(`Error occured while fetching ${res}`)
        }
        const data: ClicksOverTime[] = await res.json()
        if (data.length === 0) {
          toast("No records exist", {
            description: "Share the link to other to get data."
          })
          return
        }
        const fmtClicksData: ClicksOverTime[] = data.map((dt) => {
          return {
            day: `${FormatISOtoMonth(dt.day)} ${FormatISOtoDate(dt.day)}`,
            click_count: dt.click_count
          }
        })

        console.log({ fmtClicksData })
        setClicksData(fmtClicksData)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full min-h-[300px]">
          <LineChart
            accessibilityLayer
            data={clicksData!}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="click_count"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
