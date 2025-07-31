<template>
  <div class="notes-app">
    <header class="app-bar">
      <div class="brand">📝 Notes</div>
      <div v-if="auth.isAuthenticated" class="user-info">
        <span>{{ auth.user?.username }}</span>
        <button @click="logout" class="btn-out">Log Out</button>
      </div>
    </header>

    <div class="main-content">
      <aside class="side-panel">
        <!-- Future: tags/categories; now just a placeholder -->
        <div class="side-title">Quick actions</div>
        <ul>
          <li><button @click="openCreate" class="create-btn">+ New Note</button></li>
        </ul>
      </aside>

      <section class="notes-area">
        <div class="toolbar">
          <input
            v-model="notesStore.search"
            @input="onSearch"
            type="text"
            placeholder="Search notes..."
            class="search-input"
          />
        </div>

        <div v-if="notesStore.loading" class="center">Loading...</div>
        <div v-else>
          <div v-if="notesStore.error" class="center error">{{ notesStore.error }}</div>
          <ul v-if="notesStore.notes.length > 0" class="note-list">
            <li v-for="note in notesStore.notes" :key="note.id" @click="selectNote(note)" :class="{selected: selectedNote?.id === note.id}">
              <div class="note-title">{{ note.title }}</div>
              <div class="note-dt">{{ formatDate(note.updated || note.created) }}</div>
              <button @click.stop="editNote(note)" class="edit-btn" title="Edit">✏️</button>
              <button @click.stop="deleteNote(note.id)" class="delete-btn" title="Delete">🗑️</button>
            </li>
          </ul>
          <div v-else class="center empty">No notes found.</div>
        </div>
      </section>

      <section class="editor-area" v-if="isEditorOpen">
        <h2>{{ editMode ? 'Edit Note' : 'New Note' }}</h2>
        <form @submit.prevent="saveNote" class="edit-form">
          <input type="text" v-model="editorTitle" placeholder="Title" required />
          <textarea v-model="editorContent" placeholder="Write your note..." rows="10" required></textarea>
          <div class="editor-actions">
            <button type="submit" class="main-btn">{{ editMode ? 'Update' : 'Create' }}</button>
            <button type="button" @click="closeEditor" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </section>

      <section class="note-detail" v-else-if="selectedNote">
        <div class="note-detail-title">{{ selectedNote.title }}</div>
        <div class="note-detail-content">{{ selectedNote.content }}</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotesStore, Note } from '@/stores/notes'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const notesStore = useNotesStore()
const router = useRouter()

const selectedNote = ref<Note | null>(null)

const isEditorOpen = ref<boolean>(false)
const editorTitle = ref('')
const editorContent = ref('')
const editMode = ref(false)

function openCreate() {
  editorTitle.value = ''
  editorContent.value = ''
  editMode.value = false
  isEditorOpen.value = true
}

function editNote(note: Note) {
  editorTitle.value = note.title
  editorContent.value = note.content
  editMode.value = true
  isEditorOpen.value = true
  selectedNote.value = note
}

function selectNote(note: Note) {
  selectedNote.value = note
  isEditorOpen.value = false
}

function closeEditor() {
  isEditorOpen.value = false
}

async function saveNote() {
  if (editMode.value && selectedNote.value) {
    await notesStore.updateNote({ ...selectedNote.value, title: editorTitle.value, content: editorContent.value })
    selectedNote.value = null
  } else {
    await notesStore.createNote(editorTitle.value, editorContent.value)
  }
  isEditorOpen.value = false
  await notesStore.fetchNotes(notesStore.search)
}

async function deleteNote(id: number) {
  await notesStore.deleteNote(id)
  selectedNote.value = null
}

function formatDate(dt?: string) {
  if (!dt) return ''
  return new Date(dt).toLocaleString()
}

function onSearch() {
  notesStore.fetchNotes(notesStore.search)
}

async function logout() {
  await auth.logout()
  router.push('/auth')
}

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/auth')
  } else {
    notesStore.fetchNotes()
  }
})
watch(
  () => auth.isAuthenticated,
  val => {
    if (val) notesStore.fetchNotes()
  }
)
</script>

<style scoped>
.notes-app {
  min-height: 100vh;
  background: var(--color-background);
  font-family: Inter, sans-serif;
  color: #222;
}
.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #3b82f6;
  color: #fff;
  padding: 1rem 2rem;
  font-size: 1.6rem;
}
.brand {
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: -1px;
}
.user-info {
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-out {
  padding: 0.48rem 1.2rem;
  background: #64748b;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.main-content {
  display: flex;
  flex-direction: row;
  min-height: 700px;
}
.side-panel {
  min-width: 185px;
  background: #f1f5f9;
  padding: 2.3rem 1.3rem 2.3rem 2rem;
  border-right: 1px solid #e5e7eb;
  color: #64748b;
}
.side-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.create-btn {
  background: #3b82f6;
  color: #fff;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  margin-top: 1rem;
  width: 100%;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.19s;
}
.create-btn:hover {
  background: #2563eb;
}
.notes-area {
  flex: 2;
  min-width: 350px;
  padding: 2rem 1.8rem;
}
.toolbar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
.search-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  width: 16.5rem;
  margin-left: 1rem;
}
.note-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.note-list li {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(60,60,60,0.06);
  padding: 1.1rem 1.4rem;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;
}
.note-list li.selected {
  border: 2px solid #3b82f6;
}
.note-title {
  flex: 1;
  font-weight: 600;
  font-size: 1.07rem;
  margin-right: 1.7rem;
}
.note-dt {
  color: #64748b;
  font-size: 0.95rem;
  margin-right: 1.7rem;
}
.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 1.07rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: color 0.14s;
}
.edit-btn:hover {
  color: #3b82f6;
}
.delete-btn:hover {
  color: #f05942;
}
.editor-area {
  flex: 2;
  min-width: 350px;
  padding: 2.6rem 2rem;
  background: #fff;
  border-left: 1px solid #e5e7eb;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.edit-form input[type="text"] {
  font-size: 1.11rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.6rem 1rem;
}
.edit-form textarea {
  resize: vertical;
  font-size: 1.09rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}
.editor-actions {
  display: flex;
  gap: 1rem;
}
.main-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 2.1rem;
  font-size: 1.03rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
}
.main-btn:hover {
  background: #2563eb;
}
.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 600;
  padding: 0.7rem 2.1rem;
  cursor: pointer;
  transition: background 0.18s;
}
.cancel-btn:hover {
  background: #e5e7eb;
}
.note-detail {
  flex: 2;
  min-width: 350px;
  padding: 2.5rem 2.2rem;
}
.note-detail-title {
  font-size: 2rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 1.8rem;
}
.note-detail-content {
  font-size: 1.18rem;
  white-space: pre-wrap;
  color: #222;
}
.center {
  text-align: center;
  padding: 3rem 0;
  color: #222;
}
.empty {
  color: #64748b;
}
.error {
  color: #f05942;
}
@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  .side-panel {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    min-width: 0;
    width: 100%;
    padding: 1.3rem 1rem 1.3rem 1rem;
  }
  .editor-area, .note-detail, .notes-area {
    min-width: 0;
    width: 100%;
    padding: 2rem 1rem;
  }
}
</style>
