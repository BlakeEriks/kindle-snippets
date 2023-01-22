import { CheckCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useAtom } from 'jotai';
import { useState } from 'react';
import useBooksApi from '../api/book';
import useQuotesApi from '../api/quote';
import sourceMapAtom from '../state/sourceMap';
import { Book, Quote } from '../types/types';
import NewBookDialogue from './dialogue/NewBookDialogue';

type EditQuoteProps = {
  snippet: any
  quote: Partial<Quote>
  setQuote: Function
}

const EditQuote = ({ snippet, quote, setQuote }: EditQuoteProps) => {

  const { allQuotes } = useQuotesApi()
  const { allBooks, createBook } = useBooksApi()
  const [sourceMap, setSourceMap] = useAtom(sourceMapAtom)
  const [open, setOpen] = useState(false)
  const [newBook, setNewBook] = useState<Book>({title: '', author: { name: '' }})

  const existing = allQuotes.data?.find(({createdAt}) => snippet?.createdAt.getTime() === new Date(createdAt).getTime())
  const quoteSaved = existing && existing.content === quote?.content

  const updateBook = (id: number) => {
    if (snippet?.source) {
      setSourceMap({...sourceMap, [snippet.source]: id})
    }

    setQuote({...quote, source: allBooks.data?.find(book => book.id === id)!})
  }

  const onModalConfirm = async () => {
    if (!newBook?.author || !newBook.title) { return }
    const book = await createBook(newBook)
    setOpen(false)
    updateBook(book)
  }

  return (
    <div className='h-full flex flex-col items-stretch w-full'>
      {snippet?.source && <h2>Source: {snippet.source}</h2>}
      <Select
        options={allBooks.data?.map((book: Book) => ({ label: `${book.title} - ${book.author.name}`, value: book.id}))}
        placeholder="Select Book"
        onChange={id => updateBook(id)}
        value={quote.source?.id}
        className="my-4"
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Button type="text" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                Create New Book
              </Button>
            </Space>
          </div>
        )}
      >
        {quote.source?.title || "Select Book"}
      </Select>
      <Input
        className='mb-4'
        placeholder='Speaker (Defaults to Author)'
        value={quote.quotee}
        onChange={({ target }) => setQuote({...quote, quotee: target.value})}
      />
      <TextArea
        showCount
        rows={16}
        className='italic'
        value={quote.content}
        onChange={({ target }) => setQuote({...quote, content: target.value})}
      />
      <div className='flex justify-between'>
        {quote?.meta && <p>{" " + quote?.meta}</p>}
        {quoteSaved ? 
          <div className='flex items-center text-green-500'>
            <span className='mr-1'>Saved</span>
            <CheckCircleOutlined />
          </div>
          : 
          <div className='flex items-center text-yellow-500'>
            <span className='mr-1'>Not Saved</span>
            <ExclamationCircleOutlined />
        </div>
          }
      </div>
      <Modal
        title={"New Book"}
        onCancel={() => setOpen(false)}
        open={open}
        onOk={onModalConfirm}
      >
        <NewBookDialogue bookClue={snippet?.source!} book={newBook} setBook={setNewBook} />
      </Modal>
    </div>
  )
}

export default EditQuote