'use client'
import { ChartBar } from "@/components/charts/bar-chart";
import { ChartPieLegend } from "@/components/charts/browser-pie-charts";
import { ChartArea } from "@/components/charts/clicks-chart";
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

export default function AnalyticsDashboard() {
  const pathname = usePathname()
  const shortCode = pathname.slice(pathname.length - 6, pathname.length)

  const redirectsConfig = {
    click_count: {
      label: "Redirects",
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig

  const countryTrafficConfig = {
    click_count: {
      label: "Visitors",
      color: "var(--chart-1)"
    }
  }

  const backendURL = process.env.BACKEND_URL || "http://localhost:8080"
  const [referrerStats, setReferrerStats] = useState<TrafficFromReferrer[] | null>(null)
  const [countryStats, setCountryStats] = useState<TrafficFromCountry[] | null>(null)
  const [clicksData, setClicksData] = useState<ClicksOverTime[] | null>(null)

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

        setReferrerStats(data)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode])

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await fetch(`${backendURL}/api/analytics/${shortCode}/countries`)
        console.log({ res })
        if (!res.ok) {
          throw new Error(`Error occured while fetching ${res}`)
        }
        const data: TrafficFromCountry[] = await res.json()
        if (data.length === 0) {
          toast("No records exist", {
            description: "Share the link to other to aggregate data."
          })
          return
        }

        setCountryStats(data)
      } catch (error) {
        console.error(error)
      }
    }
    fn()
  }, [shortCode])

  return (shortCode && referrerStats && countryStats &&
    <div className="sm:px-8 px-4 lg:px-32 md:px-20 py-4 md:py-4 space-y-2 w-full">
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
      <section className="flex flex-row gap-4 max-h-[250px] w-full justify-between">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Total Clicks
            </CardTitle>
            <CardDescription className="hidden lg:block">
              The unique interactions with this TinyRL.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full lg:text-4xl text-xl font-bold">
            123400
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent>
            {/* For tomfoolery */}
            <Image
              src={Animation}
              alt="animation"
              width={300}
              height={250}
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
        <Card className="">

        </Card>
      </section>
      <section className="sm:grid sm:grid-cols-12 space-y-2 gap-2">
        <div className="w-full col-span-8">
          {/* <ChartLine/> */}
        </div>
        <div className="w-full col-span-4">
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
          <div className="lg:my-5 my-1"></div>
          <ChartPieLegend shortCode={shortCode} />
        </div>
      </section>
      <ChartBar
        shortCode={shortCode}
        chartData={referrerStats}
        dataKey={"referrer"}
        chartConfig={redirectsConfig}
      />
      <ChartBar
        shortCode={shortCode}
        chartData={countryStats}
        dataKey={"country_iso_code"}
        chartConfig={countryTrafficConfig}
      />
    </div >
  )
} 