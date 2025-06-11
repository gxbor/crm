"use client"

import { Card } from "@/components/ui/card"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Edit3, Trash2, Mail, Search, Filter, X } from "lucide-react"
import { useCrmStore } from "@/lib/store"
import type { Contact } from "@/lib/types"
import ContactDialog from "@/components/contact-dialog"
import EmailDialog from "@/components/email-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ContactsPage() {
  const { contacts, deleteContact, getAllTags } = useCrmStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | "all">("all")
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailTarget, setEmailTarget] = useState<Contact | null>(null)

  // Hydration fix for Zustand with persist
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const allTags = useMemo(() => getAllTags(), [contacts, getAllTags])

  const filteredContacts = useMemo(() => {
    if (!hydrated) return [] // Don't render from store until hydrated
    return contacts
      .filter((contact) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          contact.firstName.toLowerCase().includes(searchLower) ||
          contact.lastName.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower)
        )
      })
      .filter((contact) => {
        if (selectedTag === "all") return true
        return contact.tags.includes(selectedTag)
      })
  }, [contacts, searchTerm, selectedTag, hydrated])

  const handleAddContact = () => {
    setEditingContact(null)
    setIsContactDialogOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setIsContactDialogOpen(true)
  }

  const handleDeleteContact = (id: string) => {
    deleteContact(id)
    toast({ title: "Erfolg", description: "Kontakt erfolgreich gelöscht." })
  }

  const handleSendEmail = (contact: Contact) => {
    setEmailTarget(contact)
    setIsEmailDialogOpen(true)
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Lade Kontakte...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Kontakte</h1>
        <Button onClick={handleAddContact}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Kontakt hinzufügen
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Suchen (Name, E-Mail)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Nach Tag filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTag !== "all" && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedTag("all")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vorname</TableHead>
              <TableHead>Nachname</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                          <Edit3 className="mr-2 h-4 w-4" /> Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(contact)}>
                          <Mail className="mr-2 h-4 w-4" /> E-Mail senden
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteContact(contact.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Keine Kontakte gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <ContactDialog
        isOpen={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
        contact={editingContact}
      />
      {emailTarget && (
        <EmailDialog isOpen={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)} contact={emailTarget} />
      )}
    </div>
  )
}
