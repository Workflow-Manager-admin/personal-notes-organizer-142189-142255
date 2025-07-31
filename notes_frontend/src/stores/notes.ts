import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/api'

export interface Note {
  id: number
  title: string
  content: string
  created?: string
  updated?: string
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const search = ref<string>('')

  // PUBLIC_INTERFACE
  async function fetchNotes(query: string = '') {
    loading.value = true
    try {
      const res = await api.fetchNotes(query)
      notes.value = res.data as Note[]
      error.value = null
    } catch {
      error.value = 'Failed to load notes'
      notes.value = []
    }
    loading.value = false
  }

  // PUBLIC_INTERFACE
  async function createNote(title: string, content: string) {
    try {
      await api.createNote({ title, content })
      await fetchNotes(search.value)
    } catch {
      // handle error (no variable, fixes lint error)
    }
  }

  // PUBLIC_INTERFACE
  async function updateNote(note: Note) {
    try {
      await api.updateNote(note.id, { title: note.title, content: note.content })
      await fetchNotes(search.value)
    } catch {
      // handle error (no variable, fixes lint error)
    }
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id: number) {
    try {
      await api.deleteNote(id)
      await fetchNotes(search.value)
    } catch {
      // handle error (no variable, fixes lint error)
    }
  }

  return { notes, loading, error, search, fetchNotes, createNote, updateNote, deleteNote }
})
