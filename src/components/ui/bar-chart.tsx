"use client"
import { useState, useCallback } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "@/lib/utils"
import { DomainFavicon } from "../display-label-icons/favicon-url-formatter"

interface ChartBarProps {
  chartConfig: ChartConfig;
  chartData: any[];
  dataKey: string;
  cardTitle: string;
  type: "referrer" | "c_iso_code"
  className?: string;
  cardDescription?: string;
}

function getFlagEmoji(countryCode: string) {
  if (countryCode === "" || countryCode === null) {
    return "🏳️"
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char, idx) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const description = "A bar chart with a right-aligned label"

export function ChartBar({
  chartData,
  chartConfig,
  dataKey,
  cardTitle,
  type,
  className,
  cardDescription
}: ChartBarProps) {
  const [chartWidth, setChartWidth] = useState(0)

  // capture chart container width dynamically
  const handleResize = useCallback((width: number) => {
    setChartWidth(width)
  }, [])

  const RightEdgeLabel = (props: any) => {
    const { y, height, value } = props
    const margin = 24
    return (
      <text
        x={chartWidth - margin}
        y={y + height / 2}
        textAnchor="end"
        dominantBaseline="middle"
        className="fill-foreground font-mono"
        fontSize={12}
      >
        {value}
      </text>
    )
  }

  return (
    chartData &&
    chartConfig && (
      <Card className="md:w-[50%] w-full">
        <CardHeader className="border-b">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent
          className={cn("w-full", className)}
        >
          <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%" onResize={handleResize}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} vertical={false}/>
                <YAxis
                  dataKey={dataKey}
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
                    dataKey={dataKey}
                    position="insideLeft"
                    offset={8}
                    className="dark:fill-foreground fill-zinc-950 font-mono"
                    fontSize={12}
                  />
                  <LabelList dataKey="click_count" content={<RightEdgeLabel />} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  )
}
