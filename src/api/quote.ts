import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TagType } from 'antd'
import { useAtomValue } from 'jotai'
import userAtom from '../state/user'
import { stringify } from '../util/helper'
import { Book } from './book'

export type Quote = {
  id: number
  book: Book
  meta: string
  quotee: string
  createdAt: Date
  content: string
  deleted: boolean
  staged: boolean
  tags: TagType[]
  user: number
}

const useQuoteApi = () => {
  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  const { data } = useQuery<Quote[], Error>(['quotes'], async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quotes`)
    return await res.json()
  })

  return {
    quotes: data,

    upload: async (quotes: Partial<Quote>[]) => {
      // Function to split the array into chunks of 100 items each
      const CHUNK_SIZE = 100
      const chunks = []
      for (let i = 0; i < quotes.length; i += CHUNK_SIZE) {
        chunks.push(quotes.slice(i, i + CHUNK_SIZE))
      }

      // Function to perform the fetch request for each chunk
      const uploadChunk = async (chunk: Partial<Quote>[]) => {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chunk),
        }
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/quotes/upload`,
          requestOptions
        )
        if (!res.ok) throw new Error(`Failed to upload chunk. Status: ${res.status}`)
        return res.json() as Promise<Quote[]>
      }

      // Array to collect all the results
      let allUploadedQuotes: Quote[] = []

      // Sequentially upload each chunk and collect the results
      for (const chunk of chunks) {
        allUploadedQuotes.concat(await uploadChunk(chunk))
      }

      // Invalidate queries once after all batches have been uploaded
      queryClient.invalidateQueries(['quotes'])

      return allUploadedQuotes
    },

    save: async (quote: Partial<Quote>) => {
      const { id, ...rest } = quote

      const requestOptions = {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringify({ ...rest, user }),
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quotes/${id ? id : ''}`,
        requestOptions
      )
      queryClient.invalidateQueries(['books'])
      return (await res.json()) as Quote
    },

    delete: async (id: number) => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quotes/${id}`, {
        method: 'DELETE',
      })
      queryClient.invalidateQueries(['quotes'])
      return await res.json()
    },
  }
}

export default useQuoteApi
