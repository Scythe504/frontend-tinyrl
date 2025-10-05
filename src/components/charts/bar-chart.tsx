"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
import { toast } from "sonner"
import { useEffect, useState } from "react"

export const description = "A bar chart with a custom label"

const chartConfig = {
  click_count: {
    label: "Redirects",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

export function ChartBar({ shortCode }: {
  shortCode: string
}) {
  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"
  const [trafficStats, setTrafficStats] = useState<TrafficFromReferrer[] | null>(null)

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

        setTrafficStats(data)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode])

  return (trafficStats &&
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[500px] w-full">
          <BarChart
            accessibilityLayer
            data={trafficStats}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="referrer"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="click_count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="click_count"
              layout="vertical"
              fill="var(--chart-1)"
              radius={4}
            >
              <LabelList
                dataKey="referrer"
                position="insideLeft"
                offset={8}
                className="dark:fill-(--chart-label) font-mono"
                fontSize={12}
                formatter={(value: string) =>
                  value.replace(/^https?:\/\//, "").replace(/\/$/, "")
                }
              />
              <LabelList
                dataKey="click_count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
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
