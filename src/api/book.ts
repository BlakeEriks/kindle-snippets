import { useQueryClient } from '@tanstack/react-query'
import { Author } from './author'
import { Quote } from './quote'

export type Book = {
  id: number
  title: string
  author: Author
  quotes: Quote[]
}

const useBookApi = () => {
  const queryClient = useQueryClient()

  return {
    getBooks: async (opts = {}) => {
      const params = new URLSearchParams(opts)
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/books?${params}`)
      return await res.json()
    },

    createBook: async (book: Partial<Book>) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, requestOptions)
      queryClient.invalidateQueries(['books'])
      return await res.json()
    },

    saveBook: async (book: Partial<Book>) => {
      const requestOptions = {
        method: book.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/books/${book.id ?? ''}`,
        requestOptions
      )
      queryClient.invalidateQueries(['books'])
      return await res.json()
    },
  }
}

export default useBookApi
