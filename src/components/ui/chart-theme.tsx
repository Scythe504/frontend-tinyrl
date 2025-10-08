"use client"

import { useEffect, useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Palette = "default" | "scaled" | "mono" | "blue" | "green" | "amber" | "rose" | "purple" | "orange" | "teal"

const palettes: Record<Exclude<Palette, "default">, [string, string, string, string, string]> = {
  // OKLCH values tuned for good contrast in both themes
  scaled: [
    "oklch(0.70 0.18 262)", // base blue
    "oklch(0.62 0.16 262)",
    "oklch(0.54 0.14 262)",
    "oklch(0.46 0.12 262)",
    "oklch(0.38 0.10 262)",
  ],
  mono: ["oklch(0.72 0 0)", "oklch(0.64 0 0)", "oklch(0.55 0 0)", "oklch(0.46 0 0)", "oklch(0.38 0 0)"],
  blue: [
    "oklch(0.68 0.20 255)",
    "oklch(0.60 0.17 255)",
    "oklch(0.52 0.14 255)",
    "oklch(0.44 0.11 255)",
    "oklch(0.36 0.09 255)",
  ],
  green: [
    "oklch(0.70 0.17 150)",
    "oklch(0.62 0.15 150)",
    "oklch(0.54 0.12 150)",
    "oklch(0.46 0.10 150)",
    "oklch(0.38 0.08 150)",
  ],
  amber: [
    "oklch(0.80 0.15 80)",
    "oklch(0.74 0.13 80)",
    "oklch(0.68 0.11 80)",
    "oklch(0.60 0.09 80)",
    "oklch(0.52 0.07 80)",
  ],
  rose: [
    "oklch(0.70 0.20 20)",
    "oklch(0.62 0.17 20)",
    "oklch(0.54 0.14 20)",
    "oklch(0.46 0.11 20)",
    "oklch(0.38 0.09 20)",
  ],
  purple: [
    "oklch(0.68 0.20 300)",
    "oklch(0.60 0.17 300)",
    "oklch(0.52 0.14 300)",
    "oklch(0.44 0.11 300)",
    "oklch(0.36 0.09 300)",
  ],
  orange: [
    "oklch(0.78 0.17 60)",
    "oklch(0.70 0.14 60)",
    "oklch(0.62 0.12 60)",
    "oklch(0.54 0.10 60)",
    "oklch(0.46 0.08 60)",
  ],
  teal: [
    "oklch(0.72 0.16 190)",
    "oklch(0.64 0.14 190)",
    "oklch(0.56 0.12 190)",
    "oklch(0.48 0.10 190)",
    "oklch(0.40 0.08 190)",
  ],
}

export function ChartThemeSelect() {
  const [value, setValue] = useState<Palette>("scaled")

  const options = useMemo(
    () => [
      { label: "Scaled", value: "scaled" },
      { label: "Mono", value: "mono" },
      { label: "Blue", value: "blue" },
      { label: "Green", value: "green" },
      { label: "Amber", value: "amber" },
      { label: "Rose", value: "rose" },
      { label: "Purple", value: "purple" },
      { label: "Orange", value: "orange" },
      { label: "Teal", value: "teal" },
    ],
    [],
  )

  useEffect(() => {
    const root = document.documentElement
    if (value === "default") {
      for (let i = 1; i <= 5; i++) root.style.removeProperty(`--chart-${i}`)
      return
    }
    const set = palettes[value as Exclude<Palette, "default">]
    root.style.setProperty("--chart-1", set[0])
    root.style.setProperty("--chart-2", set[1])
    root.style.setProperty("--chart-3", set[2])
    root.style.setProperty("--chart-4", set[3])
    root.style.setProperty("--chart-5", set[4])
  }, [value])

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={(v: Palette) => setValue(v)}>
        <SelectTrigger id="chart-theme" className="text-left min-w-auto sm:min-w-[149px] w-full">
          <p className="hidden sm:block sm:text-base text-sm">Theme:</p>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="space-x-2">
              <p className="sm:text-base text-sm">
                {opt.label}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
