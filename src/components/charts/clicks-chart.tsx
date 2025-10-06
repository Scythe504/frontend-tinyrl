"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { cn } from "@/lib/utils"

interface ChartAreaProps {
  chartConfig: ChartConfig;
  chartData: ClicksOverTime[];
  cartesianGridVerticalLine?: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  className?: string;
}

export function ChartArea({
  chartConfig,
  chartData,
  cartesianGridVerticalLine = false,
  showXAxis,
  showYAxis,
  className
}: ChartAreaProps) {
  return (
    <ChartContainer config={chartConfig} className={cn(className)}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={cartesianGridVerticalLine} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={showXAxis}
          tickMargin={8}
          tickCount={12}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}  
          axisLine={false}
          tick={showYAxis}
          tickMargin={8}
          tickCount={5}
        />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="click_count"
          type="natural"
          fill="var(--chart-1)"
          fillOpacity={0.4}
          stroke="var(--chart-1)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
