"use client"

import { useEffect, useState } from "react"

interface CircularTimerProps {
  duration?: number
  isActive?: boolean
  onComplete?: () => void
  className?: string
  size?: number
}

export const CircularTimer = ({
  duration,
  isActive = false,
  onComplete,
  className = "",
  size = 128,
}: CircularTimerProps) => {
  const showDash = duration === undefined
  const effectiveDuration = typeof duration === "number" && duration > 0 ? duration : 0

  const [timeLeft, setTimeLeft] = useState(Math.max(0, effectiveDuration))

  useEffect(() => {
    setTimeLeft(Math.max(0, effectiveDuration))
  }, [effectiveDuration])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isActive && timeLeft > 0 && !showDash) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1)
          if (newTime === 0 && prev > 0 && onComplete) {
            onComplete()
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onComplete, showDash])

  const progress = effectiveDuration > 0 ? ((effectiveDuration - timeLeft) / effectiveDuration) * 100 : 0
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className={`relative text-primary ${className}`}
      style={{ width: size, height: size }}
      role="timer"
      aria-live="polite"
      aria-label={showDash ? "Timer unavailable" : `Time remaining ${timeLeft} seconds`}
      title={showDash ? "-" : `Time left: ${timeLeft}s`}
    >
      <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="opacity-25"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="square"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      {/* Timer text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs font-mono text-muted-foreground mb-1">[TIMER]</div>
        <div className="text-2xl font-mono font-bold py-2">{showDash ? "-" : String(timeLeft).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground mt-1">SEC</div>
      </div>
    </div>
  )
}
