import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TagType } from 'antd'
import { useAtomValue } from 'jotai'
import userAtom from '../state/user'
import { stringify } from '../util/helper'

export type Quote = {
  id: number
  book?: {
    id: number
    title: string
    author: {
      id: number
      name: string
    }
  }
  meta: string
  quotee: string
  createdAt: Date
  content: string
  deleted: boolean
  staged: boolean
  tags: TagType[]
}

const useQuoteApi = () => {
  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  const { data } = useQuery<Quote[], Error>(['quotes'], async () => {
    const res = await fetch('http://localhost:8000/quotes')
    return await res.json()
  })

  return {
    quotes: data,

    upload: async (quotes: Partial<Quote>[]) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotes),
      }
      const res = await fetch('http://localhost:8000/quotes/upload', requestOptions)
      queryClient.invalidateQueries(['quotes'])
      return (await res.json()) as Quote[]
    },

    save: async (quote: Partial<Quote>) => {
      const { id, ...rest } = quote

      const requestOptions = {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringify({ ...rest, user }),
      }

      const res = await fetch(`http://localhost:8000/quotes/${quote.id}`, requestOptions)
      queryClient.invalidateQueries(['quotes'])
      return (await res.json()) as Quote
    },

    delete: async (id: number) => {
      const res = await fetch(`http://localhost:8000/quotes/${id}`, { method: 'DELETE' })
      queryClient.invalidateQueries(['quotes'])
      return await res.json()
    },
  }
}

export default useQuoteApi
