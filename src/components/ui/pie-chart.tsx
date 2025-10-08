"use client"

import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

interface ChartPieProps {
  chartConfig: ChartConfig;
  chartData: any[];
}

export function ChartPieLegend({
  chartConfig,
  chartData
}: ChartPieProps) {

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto min-h-[300px] w-full"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
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
  )
}
