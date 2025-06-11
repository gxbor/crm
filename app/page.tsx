"use client"

import { useMemo, useState, useEffect } from "react" // Added React, useMemo, useState, useEffect
import { useCrmStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Tag } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  const contacts = useCrmStore((state) => state.contacts)
  const getAllTagsFunc = useCrmStore((state) => state.getAllTags) // Get the function

  // Call the function and memoize its result
  // getAllTagsFunc implicitly depends on `contacts` via `get().contacts` in the store
  const allTagsArray = useMemo(() => {
    if (!hydrated) return [] // Ensure not to run before hydration
    return getAllTagsFunc()
  }, [hydrated, getAllTagsFunc, contacts])

  const contactsPerTagData = useMemo(() => {
    if (!hydrated) return [] // Ensure not to run before hydration
    return allTagsArray
      .map((tag) => ({
        name: tag,
        total: contacts.filter((c) => c.tags.includes(tag)).length,
      }))
      .filter((item) => item.total > 0)
  }, [hydrated, allTagsArray, contacts])

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Übersicht</h1>
        <p>Lade Daten...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Übersicht</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtzahl Kontakte</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eindeutige Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTagsArray.length}</div> {/* Use allTagsArray.length */}
          </CardContent>
        </Card>
      </div>

      {contactsPerTagData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Kontakte pro Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactsPerTagData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
      {contactsPerTagData.length === 0 && contacts.length > 0 && (
        <p className="text-muted-foreground">Fügen Sie Tags zu Ihren Kontakten hinzu, um hier Analysen zu sehen.</p>
      )}
      {contacts.length === 0 && (
        <p className="text-muted-foreground">
          Noch keine Kontakte vorhanden. Fügen Sie einige hinzu, um Analysen zu sehen.
        </p>
      )}
    </div>
  )
}
