"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  XTickCount: number;
  timeRange?: FilterTimeRange;
  YTickCount: number;
}

// Aggregate data by month
function aggregateByMonth(data: ClicksOverTime[]) {
  const monthMap = new Map<string, number>()
  
  data.forEach(item => {
    const date = new Date(item.day)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    
    const current = monthMap.get(monthKey) || 0
    monthMap.set(monthKey, current + item.click_count)
  })
  
  return Array.from(monthMap.entries())
    .map(([day, click_count]) => ({ day, click_count }))
    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
}

// Format X-axis tick based on time range
function formatXAxisTick(value: string, timeRange: FilterTimeRange) {
  const date = new Date(value)

  switch (timeRange) {
    case "7d":
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
    case "30d":
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    case "90d":
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    case "180d":
      return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
    case "365d":
      return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
    default:
      return date.toLocaleDateString()
  }
}

// Format tooltip label based on time range
function formatTooltipLabel(value: string, timeRange: FilterTimeRange) {
  const date = new Date(value)

  switch (timeRange) {
    case "7d":
    case "30d":
    case "90d":
      return new Intl.DateTimeFormat("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      }).format(date)
    case "180d":
    case "365d":
      return new Intl.DateTimeFormat("en-US", { 
        month: "long", 
        year: "numeric" 
      }).format(date)
    default:
      return date.toLocaleDateString()
  }
}

// Get X-axis ticks based on time range
function getXTicks(data: ClicksOverTime[], timeRange: FilterTimeRange) {
  if (!data || data.length === 0) return []

  switch (timeRange) {
    case "7d":
      // All days
      return data.map(d => d.day)
    
    case "30d":
      // 5-day intervals (approx 6-7 ticks)
      return data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map(d => d.day)
    
    case "90d":
      // 10-day intervals (approx 9 ticks)
      return data.filter((_, i) => i % 10 === 0 || i === data.length - 1).map(d => d.day)
    
    case "180d":
      // 6 monthly ticks
      const interval180 = Math.floor(data.length / 6)
      return data.filter((_, i) => i % interval180 === 0 || i === data.length - 1).map(d => d.day)
    
    case "365d":
      // 4 quarterly ticks
      const interval365 = Math.floor(data.length / 4)
      return data.filter((_, i) => i % interval365 === 0 || i === data.length - 1).map(d => d.day)
    
    default:
      return []
  }
}

export function ChartArea({
  chartConfig,
  chartData,
  cartesianGridVerticalLine = false,
  showXAxis,
  showYAxis,
  className,
  timeRange,
  XTickCount,
  YTickCount,
}: ChartAreaProps) {
  // Aggregate data for 6 and 12 months
  const processedData = (timeRange === "180d" || timeRange === "365d") 
    ? aggregateByMonth(chartData) 
    : chartData

  return (chartConfig && processedData &&
    <ChartContainer config={chartConfig} className={cn(className)}>
      <AreaChart
        accessibilityLayer
        data={processedData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={cartesianGridVerticalLine} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={showXAxis}
          ticks={getXTicks(processedData, timeRange!)}
          tickMargin={8}
          tickCount={XTickCount}
          tickFormatter={(value) => formatXAxisTick(value, timeRange!)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={showYAxis}
          tickMargin={8}
          tickCount={YTickCount}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent 
              indicator="line"
              labelFormatter={(value) => formatTooltipLabel(value, timeRange!)}
            />
          }
        />
        <Area
          dataKey="click_count"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--chart-1)"
          strokeOpacity={1}
        />
      </AreaChart>
    </ChartContainer>
  )
}