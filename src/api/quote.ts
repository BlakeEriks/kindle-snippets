import { useQuery, useQueryClient } from "react-query"
import { Quote } from "../types/types"
import { useAtomValue } from 'jotai';
import userAtom from '../state/user';

const useQuotesApi = () => {

  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  return {
    allQuotes: useQuery<Quote[], Error>('quotes', async () => {
      const res = await fetch("http://localhost:8000/quotes")
      return await res.json()
    }),

    saveQuote: async (quote: Quote) => {
      if (!user) {
        console.log('User required to make a quote')
        return
      }

      const requestOptions = {
        method: quote.id ? "PUT" : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...quote, user})
      }
  
      const url = 'http://localhost:8000/quotes/' + (quote.id || '')
      const res = await fetch(url, requestOptions)
      queryClient.invalidateQueries(['quotes'])
      queryClient.invalidateQueries(['tags'])
      return await res.json()
    }
  }
}

export default useQuotesApi