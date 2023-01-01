import { useQuery, useQueryClient } from "react-query"
import { Quote } from "../types/types"

const useQuotesApi = () => {

  const queryClient = useQueryClient()

  return {
    allQuotes: useQuery<Quote[], Error>('quotes', async () => {
      const res = await fetch("http://localhost:8000/quotes")
      return await res.json()
    }),

    saveQuote: async (quote: Quote) => {
      const requestOptions = {
        method: quote.id ? "PUT" : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      }
  
      const url = 'http://localhost:8000/quotes' + (quote.id || '')
      const res = await fetch(url, requestOptions)
      queryClient.invalidateQueries('quotes')
      return await res.json()
    }
  }
}

export default useQuotesApi