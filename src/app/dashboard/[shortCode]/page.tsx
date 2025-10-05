'use client'
import { ChartBar } from "@/components/charts/bar-chart";
import { ChartPieLegend } from "@/components/charts/browser-pie-charts";
import { ChartLine } from "@/components/charts/click-line-charts";
import { usePathname } from "next/navigation";

export default function AnalyticsDashboard() {
  const pathname = usePathname()
  const shortCode = pathname.slice(pathname.length - 6, pathname.length)

  return (shortCode &&
    <div className="sm:px-8 px-4 md:px-40 py-4 md:py-4 space-y-2">
      <ChartLine shortCode={shortCode} />
      <ChartPieLegend shortCode={shortCode} />
      <ChartBar shortCode={shortCode} />
    </div >
  )
} 