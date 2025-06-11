"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCrmStore } from "@/lib/store"
import type { Contact } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface ContactDialogProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null
}

export default function ContactDialog({ isOpen, onClose, contact }: ContactDialogProps) {
  const { addContact, updateContact } = useCrmStore()
  const { toast } = useToast()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [tags, setTags] = useState("") // Comma-separated string

  useEffect(() => {
    if (contact) {
      setFirstName(contact.firstName)
      setLastName(contact.lastName)
      setEmail(contact.email)
      setTags(contact.tags.join(", "))
    } else {
      setFirstName("")
      setLastName("")
      setEmail("")
      setTags("")
    }
  }, [contact, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !email) {
      toast({ title: "Fehler", description: "Vorname und E-Mail sind Pflichtfelder.", variant: "destructive" })
      return
    }

    const contactData = {
      firstName,
      lastName,
      email,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    }

    if (contact) {
      updateContact(contact.id, contactData)
      toast({ title: "Erfolg", description: "Kontakt erfolgreich aktualisiert." })
    } else {
      addContact(contactData)
      toast({ title: "Erfolg", description: "Kontakt erfolgreich hinzugefügt." })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {" "}
        {/* Increased max width for larger dialog */}
        <DialogHeader>
          <DialogTitle>{contact ? "Kontakt bearbeiten" : "Neuen Kontakt hinzufügen"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Vorname
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nachname
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="col-span-3"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <small className="col-span-4 text-muted-foreground text-center -mt-2">Tags mit Komma trennen.</small>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
