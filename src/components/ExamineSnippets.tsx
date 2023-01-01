import { useState, useEffect } from 'react';
import { Book, Quote, Snippet } from '../types/types';
import { useAtom } from 'jotai';
import deletedSnippetsAtom from '../state/deletedSnippets';
import useQuotesApi from '../api/quote';
import { Select, Divider, Space, Button, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Input } from 'antd';
import useBooksApi from '../api/book';
import useModal from '../state/modal';
import NewBookDialogue from './dialogue/NewBookDialogue';

const ExamineSnippets = () => {

  const { allQuotes, saveQuote } = useQuotesApi()
  const { allBooks } = useBooksApi()
  const { openModal } = useModal()

  const [quote, setQuote] = useState<Partial<Quote>>()
  const [snippets, setSnippets] = useState<Snippet[]>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deletedSnippets, setDeletedSnippets] = useAtom(deletedSnippetsAtom)
  const [sourceMap, setSourceMap] = useState<{[key: string]: number}>({})

  const filteredSnippets = snippets?.filter(snippet => !deletedSnippets.includes(snippet.createdAt.getTime()))
  const currentSnippet = filteredSnippets && filteredSnippets[currentIndex]
  const existing = allQuotes.data?.find(({createdAt}) => currentSnippet?.createdAt.getTime() === new Date(createdAt).getTime())
  const quoteSaved = existing && existing.content === quote?.content
  const isQuoteValid = quote?.source && quote?.content

  // <FileDrop setMode={setMode} setSnippets={setSnippets}/>

  useEffect(() => {
    if (!currentSnippet) { return }
    
    if (existing) {
      setQuote({...existing})
    }
    else {
      const { createdAt, content, meta, source } = currentSnippet
      const mappedSource = sourceMap[source]
      setQuote({createdAt, content, meta, source: allBooks.data?.find(({id}) => id === mappedSource)}) 
    }
  }, [currentSnippet, allQuotes.data])

  const updateBook = (id: number) => {
    if (currentSnippet) {
      setSourceMap({...sourceMap, [currentSnippet.source]: id})
    }
      
    setQuote({...quote, source: allBooks.data?.find(book => book.id === id)!})
  }

  const onDelete = () => {
    const existing = allQuotes.data?.find(({ createdAt }) => new Date(createdAt) === currentSnippet?.createdAt)
    if (existing) {

    }
    else {
      setDeletedSnippets([...deletedSnippets, currentSnippet?.createdAt.getTime()!])
    }
  }

  const openNewBookModal = () => {
    openModal({
      title: "New Book",
      children: <NewBookDialogue bookClue={currentSnippet?.source!}/>,
    })
  }

  return (
    <div className={"flex justify-center items-center w-4/5 mt-12 border-dashed border-2 shadow-lg " + (quoteSaved ? " shadow-green-500" : "shadow-yellow-500")}>
      {
        quote && currentSnippet &&
          <div className='h-full flex flex-col items-stretch'>
            <h1 className='text-2xl m-3 relative top-2'>Time to analyze each one, edit or delete, and save!</h1>
            <h2>Source: {currentSnippet.source}</h2>
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
                    <Button type="text" icon={<PlusOutlined />} onClick={openNewBookModal}>
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
            <p>{" " + quote?.meta}</p>
            <Pagination
              simple
              pageSize={1}
              current={currentIndex + 1}
              total={filteredSnippets?.length}
              onChange={val => setCurrentIndex(val - 1)}
              className="flex justify-center my-2"
            />
            <div className="flex justify-center">
              <Button onClick={onDelete} danger className='mr-2'>Delete</Button>
              <Button type='primary' onClick={() => saveQuote(quote as Quote)} disabled={!isQuoteValid}>Save</Button>
            </div>
          </div>
        }
    </div> 
  )
}

export default ExamineSnippets