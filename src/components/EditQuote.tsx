import { ReadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Typography } from 'antd'
import { useState } from 'react'
import useBooksApi, { Book } from '../api/book'
import useQuotesApi, { Quote } from '../api/quote'
import { Snippet } from '../api/snippets'
import TagApi, { TagType } from '../api/tag'

const { Paragraph, Title } = Typography

type EditQuoteProps = {
  snippet?: Snippet
  quote: Partial<Quote>
  setQuote: Function
}

const EditQuote = ({ snippet, quote, setQuote }: EditQuoteProps) => {
  const { allQuotes } = useQuotesApi()
  const { allBooks, createBook } = useBooksApi()
  // const [sourceMap, setSourceMap] = useAtom(sourceMapAtom)
  const [open, setOpen] = useState(false)
  const [newBook, setNewBook] = useState<Book>({
    title: '',
    author: { name: '' },
  })

  const tags = useQuery<TagType[], Error>({
    queryKey: ['tags'],
    queryFn: TagApi.getAllTags,
  })
  const existing = allQuotes.data?.find(
    ({ createdAt }) => snippet?.createdAt.getTime() === new Date(createdAt).getTime()
  )
  const quoteSaved =
    existing && existing.content === quote?.content && existing.tags === quote?.tags

  const updateBook = (id: number) => {
    // if (snippet?.source) {
    //   setSourceMap({ ...sourceMap, [snippet.source]: id })
    // }

    setQuote({
      ...quote,
      source: allBooks.data?.find(book => book.id === id)!,
    })
  }

  const onModalConfirm = async () => {
    if (!newBook?.author || !newBook.title) {
      return
    }
    const book = await createBook(newBook)
    setOpen(false)
    updateBook(book)
  }

  return (
    <div className='h-full flex flex-col items-stretch w-full'>
      <div className='flex text-4xl items-center justify-center gap-x-2'>
        <ReadOutlined />
        <Title level={2} italic style={{ margin: 0 }} editable>
          {quote.source?.title}
        </Title>
      </div>
      <div className='flex items-center justify-center gap-x-2'>
        By
        <Title level={4} italic style={{ margin: 0 }} editable>
          {quote.source?.author.name}
        </Title>
      </div>

      {/* <Select
          options={allBooks.data?.map((book: Book) => ({
            label: `${book.title} - ${book.author.name}`,
            value: book.id,
          }))}
          placeholder='Select Book'
          onChange={id => updateBook(id)}
          value={quote.source?.id}
          className='my-4'
          dropdownRender={menu => (
            <div>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Button type='text' icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                  Create New Book
                </Button>
              </Space>
            </div>
          )}
        >
          {quote.source?.title || 'Select Book'}
        </Select> */}

      {/* <Input
        className='mb-4'
        placeholder='Speaker (Defaults to Author)'
        value={quote.quotee}
        onChange={({ target }) => setQuote({ ...quote, quotee: target.value })}
      />
      <Select
        className='mb-4'
        mode='tags'
        style={{ width: '100%' }}
        placeholder='Tags'
        onChange={tags =>
          setQuote({
            ...quote,
            tags: tags.map((tag: string) => ({ name: tag })),
          })
        }
        options={tags.data?.map(tag => ({
          value: tag.name,
          label: tag.name,
        }))}
        value={quote.tags?.map(tag => tag.name)}
      />
      <TextArea
        showCount
        rows={16}
        className='italic'
        value={quote.content}
        onChange={({ target }) => setQuote({ ...quote, content: target.value })}
      />
      <div className='flex justify-between'>
        {quote?.meta && <p>{' ' + quote?.meta}</p>}
        {quoteSaved ? (
          <div className='flex items-center text-green-500'>
            <span className='mr-1'>Saved</span>
            <CheckCircleOutlined />
          </div>
        ) : (
          <div className='flex items-center text-yellow-500'>
            <span className='mr-1'>Not Saved</span>
            <ExclamationCircleOutlined />
          </div>
        )}
      </div> */}
      {/* <Modal title={'New Book'} onCancel={() => setOpen(false)} open={open} onOk={onModalConfirm}>
        <NewBookDialogue book={newBook} setBook={setNewBook} />
      </Modal> */}
    </div>
  )
}

export default EditQuote
