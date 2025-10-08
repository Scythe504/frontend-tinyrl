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
import Image from "next/image"

interface ChartBarProps {
  chartConfig: ChartConfig;
  chartData: object[];
  dataKey: string;
  cardTitle: string;
  type: "referrer" | "c_iso_code"
  className?: string;
  cardDescription?: string;
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

  /* eslint-disable  @typescript-eslint/no-explicit-any */
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
                <CartesianGrid horizontal={false} vertical={false} />
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
                    offset={12}
                    className="dark:fill-foreground fill-zinc-950"
                    fontSize={12}
                    content={(props) => {
                      const { x, y, height, value } = props
                      if (!value) return null

                      const yOffset = (y as number) + (Number(height) / 2) - 7

                      // --- Referrer (with favicon) ---
                      if (type === "referrer") {
                        try {
                          if (value === "direct") {
                            return (
                              <foreignObject
                                x={(x as number) + 4}
                                y={yOffset}
                                width={160}
                                height={20}
                              >
                                <div className="flex items-center gap-2 text-[12px] leading-none text-foreground font-sans overflow-hidden whitespace-nowrap text-ellipsis">
                                  <span>direct</span>
                                </div>
                              </foreignObject>
                            )
                          }

                          const uri = new URL(value as string)
                          const domain = uri.hostname
                          const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`

                          return (
                            <foreignObject
                              x={(x as number) + 4}
                              y={yOffset}
                              width={180}
                              height={20}
                            >
                              <div className="flex items-center gap-2 text-[12px] leading-none text-foreground font-sans overflow-hidden whitespace-nowrap text-ellipsis">
                                <Image
                                  src={faviconUrl}
                                  alt=""
                                  width={16}
                                  height={16}
                                  className="blur-0 h-4 w-4 rounded-full"
                                  style={{
                                    color: "transparent"
                                  }}
                                />
                                <span className="truncate max-w-[120px]">{domain}</span>
                              </div>
                            </foreignObject>
                          )
                        } catch {
                          return (
                            <foreignObject
                              x={(x as number) + 4}
                              y={yOffset}
                              width={160}
                              height={20}
                            >
                              <div className="flex items-center gap-2 text-[12px] leading-none text-foreground font-sans overflow-hidden whitespace-nowrap text-ellipsis">
                                <span>{String(value)}</span>
                              </div>
                            </foreignObject>
                          )
                        }
                      }

                      // --- Country ISO Codes (using flag.vercel.app + Next/Image) ---
                      if (type === "c_iso_code") {
                        const code = (value as string).toLowerCase()
                        const display = new Intl.DisplayNames(["en"], { type: "region" })
                        const countryName = display.of(code.toUpperCase()) ?? code.toUpperCase()
                        const flagUrl = `https://flag.vercel.app/s/${code.toUpperCase()}.svg`

                        return (
                          <foreignObject
                            x={(x as number) + 4}
                            y={yOffset}
                            width={180}
                            height={20}
                          >
                            <div className="flex items-center gap-2 text-[12px] leading-none text-foreground font-sans overflow-hidden whitespace-nowrap text-ellipsis">
                              <Image
                                src={flagUrl}
                                alt={countryName}
                                width={18}
                                height={12}
                                className="shrink-0"
                              />
                              <span className="truncate max-w-[120px]">{countryName}</span>
                            </div>
                          </foreignObject>
                        )
                      }

                      // --- Default text fallback ---
                      return (
                        <foreignObject
                          x={(x as number) + 4}
                          y={yOffset}
                          width={160}
                          height={20}
                        >
                          <div className="flex items-center gap-2 text-[12px] leading-none text-foreground font-sans overflow-hidden whitespace-nowrap text-ellipsis">
                            <span>{String(value)}</span>
                          </div>
                        </foreignObject>
                      )
                    }}
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
