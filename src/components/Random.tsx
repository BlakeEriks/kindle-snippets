import useQuoteApi from '../api/quote'

const Random = () => {
  const { quotes } = useQuoteApi()

  const quote = quotes?.[Math.floor(Math.random() * (quotes?.length || 0))]

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <h1>{quote?.content}</h1>
    </div>
  )
}

export default Random
