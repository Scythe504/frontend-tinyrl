'use client'
import { ChartBar } from "@/components/ui/bar-chart";
import { ChartPieLegend } from "@/components/ui/pie-chart";
import { ChartArea } from "@/components/ui/area-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ChartThemeSelect } from "@/components/ui/chart-theme";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Animation from "../../../../public/walking.gif"
import { FormatISOtoMonth, FormatISOtoDate } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BrowserPieChart } from "@/components/charts/browser-charts";
import { CountryBarChart } from "@/components/charts/country-chart";
import { ReferrerBarChart } from "@/components/charts/referrer-chart";
import { ClicksAreaChart } from "@/components/charts/clicks-area-chart";

export default function AnalyticsDashboard() {
  const pathname = usePathname()
  const shortCode = pathname.split('/').findLast((val) => val)
  const [timeRange, setTimeRange] = useState<FilterTimeRange>("30d")

  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"



  return (shortCode &&
    <div className="sm:px-8 px-4 lg:px-20 md:px-12 py-4 md:py-4 space-y-2 w-full">
      <section className="flex lg:flex-row flex-col w-full justify-end gap-2 items-center">
        <h1 className="mr-auto text-xl font-mono">Analytics:[{shortCode}]</h1>
        <div className="grid grid-cols-3 gap-4 justify-between lg:w-auto w-full">
          <Button variant={"outline"}
            className="w-full text-sm sm:text-base"
          >
            Change Link
          </Button>
          <Button variant={"outline"}
            className="w-full text-sm sm:text-base"
            onClick={() => toast("Coming Soon!", {
              description: "The developer just wanted to fill space with future functionality and empty space."
            })}
          >
            Export Data
          </Button>
          <ChartThemeSelect />
        </div>
      </section>
      <section className="flex md:flex-row flex-col gap-2 md:max-h-[350px] w-full justify-between">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Total Clicks
            </CardTitle>
            <CardDescription>
              The unique interactions with this TinyRL.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full lg:text-4xl text-xl font-bold">
            123400
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent>
            {/* For shits and giggles */}
            <Image
              src={Animation}
              alt="animation"
              width={250}
              height={200}
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Highest Traffic
            </CardTitle>
            <CardDescription>
              Most amount of traffic from:
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-1 flex-col flex h-full">
            <CardTitle>
              Day: 25, April 2025
            </CardTitle>
            <CardDescription className="hidden lg:block">
              Your TinyRL Peaked out on this very day!
            </CardDescription>
            <CardTitle>
              Browser: Chrome
            </CardTitle>
            <CardDescription className="hidden lg:block">
              Most used browser to visit this TinyRL.
            </CardDescription>
            <CardTitle>
              Country: India
            </CardTitle>
            <CardDescription className="hidden lg:block">
              Most visitors from this country.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
      <section>
        {/* Line Chart Config options */}
        <Card className="max-h-16 flex justify-center w-full">
          <CardContent className="flex items-center">
            <div>
              <h1 className="text-2xl font-semibold font-mono">Filter</h1>
            </div>
            <Select value={timeRange} onValueChange={(v: typeof timeRange) => setTimeRange(v)}>
              <SelectTrigger
                className="w-[160px] rounded-lg ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value='365d' className="rounded-lg">
                  Last 1 year
                </SelectItem>
                <SelectItem value='180d' className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value='90d' className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value='30d' className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value='7d' className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </section>
      <section className="sm:grid sm:grid-cols-12 space-y-2 gap-2">
        <div className="w-full col-span-8">
          {/* <ChartLine/> */}
          <ClicksAreaChart
            timeRange={timeRange}
            shortCode={shortCode}
          />
        </div>
        <div className="w-full col-span-4 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>
                Browser Share
              </CardTitle>
              <CardDescription>
                Hover or Click on Chart to get browser traffic.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <BrowserPieChart shortCode={shortCode} />
          </Card>
        </div>
      </section>
      <section className="flex md:flex-row flex-col gap-2 md:pr-2">
        <ReferrerBarChart shortCode={shortCode} />
        <CountryBarChart shortCode={shortCode} />
      </section>
    </div >
  )
} 