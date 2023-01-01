import { useQuery, useQueryClient } from "react-query"
import { Book } from "../types/types"

const useBookApi = () => {

  const queryClient = useQueryClient()

  return {
    allBooks: useQuery<Book[], Error>('books', async () => {
      const res = await fetch("http://localhost:8000/books")
      return await res.json()
    }),

    createBook: async (book: Partial<Book>) => {
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      }
      const res = await  fetch("http://localhost:8000/books", requestOptions)
      queryClient.invalidateQueries('books')
      return await res.json()
    }
  }
}

export default useBookApi