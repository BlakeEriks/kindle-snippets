import create from 'zustand'
import { persist } from 'zustand/middleware'

interface DeletedSnippetsState {
  deleted: number[]
  add: (id: number) => void
}

const useDeletedSnippets = create<DeletedSnippetsState>()(persist(
  set => ({
    deleted: [],
    add: (id) => set((state) => ({ deleted: [...state.deleted, id] })),
  }),
  {
    name: 'deleted-snippets', // name of item in the storage (must be unique)
  }
))

export default useDeletedSnippets