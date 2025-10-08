import { ChartBar } from "@/components/ui/bar-chart";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CountryBarChart = ({ shortCode }: {
  shortCode: string;
}) => {
  const countryTrafficConfig = {
    click_count: {
      label: "Visitors",
      color: "var(--chart-1)"
    }
  }
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const [countryStats, setCountryStats] = useState<TrafficFromCountry[] | null>(null)
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
  }, [shortCode, backendURL])

  return <>{
    countryStats &&
    <ChartBar
      type="c_iso_code"
      chartData={countryStats}
      dataKey={"country_iso_code"}
      chartConfig={countryTrafficConfig}
      cardTitle={"Country"}
      cardDescription={"Showing the number clicks from different countries"}
    />
  }
  </>
}