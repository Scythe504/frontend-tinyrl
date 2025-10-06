import { ChartLine, MoveUpRight } from "lucide-react"
import { ChartArea } from "../charts/clicks-chart"
import { ChartConfig } from "../ui/chart"
import { Button } from "../ui/button"
import Link from "next/link"

export const description = "A simple area chart"
export const AnalyticsPreview = () => {

  const chartConfig = {
    click_count: {
      label: "Clicks",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const chartData: ClicksOverTime[] = [
    { day: "January", click_count: 920 },
    { day: "February", click_count: 1120 },
    { day: "March", click_count: 1020 },
    { day: "April", click_count: 823 },
    { day: "May", click_count: 986 },
    { day: "June", click_count: 867 },
  ]

  return <section className="relative w-full py-24 flex flex-col items-center justify-center text-center">
    <div className="space-y-4 flex flex-col items-center">
      <p className="flex gap-x-2 text-muted-foreground text-base">
        <ChartLine /> Insightful Analytics
      </p>
      <h1 className="font-bold text-3xl">
        Smarter Link Insights
      </h1>
      <p className="text-xl text-muted-foreground">
        Track clicks, sources, and trends, all in one clear, intuitive dashboard built for precision.
      </p>
      <Link
        href={"/dashboard"}
        // TODO- PROD /dashboard/demo
      >
        <Button>
          <div
            className="flex flex-row items-center space-x-1 px-3"
          >
            <p>Try Now</p>
            <MoveUpRight className="size-3 translate-y-0.5" />
          </div>
        </Button>
      </Link>
    </div>
    <div className="w-full rounded-lg bg-gradient-to-b dark:from-zinc-950 dark:to-zinc-950 from-white to-neutral-white px-4 pt-12 sm:mt-12">
      <div className="mx-auto w-full [mask-image:linear-gradient(black_50%,transparent)] flex items-center justify-center">
        <ChartArea
          chartConfig={chartConfig}
          chartData={chartData}
          showXAxis={false}
          showYAxis={true}
          className="w-full"
        />
      </div>
    </div>
  </section >
}