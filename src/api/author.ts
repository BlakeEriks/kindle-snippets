import { useQuery, useQueryClient } from '@tanstack/react-query'

export type Author = {
  id?: number
  name: string
}

const useAuthorApi = () => {
  const queryClient = useQueryClient()

  return {
    allAuthors: useQuery<Author[], Error>(['authors'], async () => {
      const res = await fetch('process.env.REACT_APP_API_URL/authors')
      return await res.json()
    }),

    saveAuthor: async (author: Partial<Author>) => {
      const requestOptions = {
        method: author.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(author),
      }

      const res = await fetch(
        `process.env.REACT_APP_API_URL/authors/${author.id ?? ''}`,
        requestOptions
      )
      queryClient.invalidateQueries(['books'])
      return await res.json()
    },

    deleteAuthor: async (id: number) => {
      const res = await fetch(`process.env.REACT_APP_API_URL/authors/${id}`, { method: 'DELETE' })
      queryClient.invalidateQueries(['authors'])
      return await res.json()
    },
  }
}

export default useAuthorApi
