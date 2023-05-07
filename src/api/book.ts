import { useQuery, useQueryClient } from '@tanstack/react-query'
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

  const booksQuery = useQuery<Book[], Error>(['books'], async () => {
    const res = await fetch('http://localhost:8000/books')
    return await res.json()
  })

  return {
    books: booksQuery.data,

    createBook: async (book: Partial<Book>) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      }
      const res = await fetch('http://localhost:8000/books', requestOptions)
      queryClient.invalidateQueries(['books'])
      return await res.json()
    },

    saveBook: async (book: Partial<Book>) => {
      const requestOptions = {
        method: book.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      }

      const res = await fetch(`http://localhost:8000/books/${book.id ?? ''}`, requestOptions)
      queryClient.invalidateQueries(['books'])
      return await res.json()
    },
  }
}

export default useBookApi
