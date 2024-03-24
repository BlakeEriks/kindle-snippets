import useAuthorApi from 'api/author'
import { get } from 'lodash'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useQuoteApi from '../api/quote'

const Random = () => {
  const { quotes } = useQuoteApi()
  const { allAuthors } = useAuthorApi()
  const { seed } = useParams<{ seed?: string }>()

  const quote = useMemo(() => quotes?.[Math.floor(Math.random() * (quotes?.length || 0))], [seed])

  return (
    <div className='w-full h-full flex justify-center items-center flex-col px-8 gap-4'>
      <h1 className='text-2xl italic text-center'>"{quote?.content}"</h1>
      <p>-{allAuthors.data?.find(a => a.id === get(quote?.book, 'authorId'))?.name ?? ''}</p>
    </div>
  )
}

export default Random
