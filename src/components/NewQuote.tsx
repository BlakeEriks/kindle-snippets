import { SaveOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useQuoteApi, { Quote } from '../api/quote'
import EditQuote from './EditQuote'
import { Button } from './ui/button'

const NewQuote = () => {
  const [quote, setQuote] = useState<Partial<Quote>>({})
  const { save } = useQuoteApi()

  return (
    <div className='flex flex-col items-center w-1/2 mx-auto'>
      <h1 className='my-4 text-2xl'>New Quote</h1>
      <EditQuote quote={quote} setQuote={setQuote} />
      <Button onClick={() => save(quote as Quote)}>
        <SaveOutlined />
        Save
      </Button>
    </div>
  )
}

export default NewQuote
