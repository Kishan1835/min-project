import type React from "react"
import { Navigation } from "./navigation"

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AppLayout({ children, className = "" }: AppLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navigation />
      {children}
    </div>
  )
}
