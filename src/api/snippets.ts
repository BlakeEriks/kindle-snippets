import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TagType } from 'antd'
import { stringify } from '../util/helper'

export type Snippet = {
  id: number
  source: {
    id: number
    bookId: number
    string: string
  }
  meta: string
  quotee: string
  createdAt: Date
  content: string
  deleted: boolean
  staged: boolean
  tags: TagType[]
}

const useSnippetsApi = () => {
  const queryClient = useQueryClient()

  const snippetsQuery = useQuery<Snippet[], Error>(['snippets'], async () => {
    const res = await fetch('http://localhost:8000/snippets')
    return await res.json()
  })

  return {
    allSnippets: snippetsQuery.data,

    saveAllSnippets: async (snippets: Partial<Snippet>[]) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippets),
      }
      const res = await fetch('http://localhost:8000/snippets', requestOptions)
      queryClient.invalidateQueries(['snippets'])
      return (await res.json()) as Snippet[]
    },

    saveSnippet: async (snippet: Partial<Snippet>) => {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: stringify(snippet),
      }

      const res = await fetch(`http://localhost:8000/snippets/${snippet.id}`, requestOptions)
      queryClient.invalidateQueries(['snippets'])
      return (await res.json()) as Snippet
    },

    deleteSnippet: async (id: number) => {
      const res = await fetch(`http://localhost:8000/snippets/${id}`, { method: 'DELETE' })
      queryClient.invalidateQueries(['snippets'])
      return await res.json()
    },
  }
}

export default useSnippetsApi
