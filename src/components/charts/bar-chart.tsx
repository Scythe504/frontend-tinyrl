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

export const description = "A bar chart with a custom label"

interface ChartBarProps {
  chartConfig: ChartConfig;
  chartData: any[];
  dataKey: string;
}

export function ChartBar({ chartData, chartConfig, dataKey }: ChartBarProps) {

  return (chartData && chartConfig &&
    <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[500px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
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
  )
}
