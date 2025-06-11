"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Übersicht", icon: BarChart3 },
  { href: "/kontakte", label: "Kontakte", icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Projekt CRM</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
