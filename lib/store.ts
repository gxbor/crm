"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Contact } from "./types"

interface CrmState {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void
  updateContact: (id: string, updates: Partial<Omit<Contact, "id" | "createdAt">>) => void
  deleteContact: (id: string) => void
  getContactById: (id: string) => Contact | undefined
  getAllTags: () => string[]
  getContactsByTag: (tag: string) => Contact[]
}

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, { ...contact, id: crypto.randomUUID(), createdAt: new Date().toISOString() }],
        })),
      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
      getContactById: (id) => get().contacts.find((c) => c.id === id),
      getAllTags: () => {
        const allTags = get().contacts.flatMap((c) => c.tags)
        return [...new Set(allTags)].sort()
      },
      getContactsByTag: (tag) => get().contacts.filter((c) => c.tags.includes(tag)),
    }),
    {
      name: "simple-crm-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
