import { SaveOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useQuotesApi, { Quote } from '../api/quote'
import Button from './Button'
import EditQuote from './EditQuote'

const NewQuote = () => {
  const [quote, setQuote] = useState<Partial<Quote>>({})
  const { saveQuote } = useQuotesApi()

  return (
    <div className='flex flex-col items-center w-1/2 mx-auto'>
      <h1 className='my-4 text-2xl'>New Quote</h1>
      <EditQuote quote={quote} setQuote={setQuote} />
      <Button icon={<SaveOutlined />} type='primary' onClick={() => saveQuote(quote as Quote)}>
        Save
      </Button>
    </div>
  )
}

export default NewQuote
