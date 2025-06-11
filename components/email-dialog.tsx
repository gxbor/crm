"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Contact } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
}

export default function EmailDialog({ isOpen, onClose, contact }: EmailDialogProps) {
  const { toast } = useToast()
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate email sending
    console.log("E-Mail senden an:", contact.email)
    console.log("Betreff:", subject)
    console.log("Nachricht:", message)
    toast({
      title: "E-Mail gesendet (simuliert)",
      description: `An: ${contact.email}\nBetreff: ${subject}`,
    })
    setSubject("")
    setMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            E-Mail senden an {contact.firstName} {contact.lastName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendEmail}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                An
              </Label>
              <Input id="to" value={contact.email} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Betreff
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right pt-2">
                Nachricht
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3 min-h-[150px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit">Senden</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
