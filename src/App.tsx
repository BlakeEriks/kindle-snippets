import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Pagination, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import FileDrop from './components/FileDrop';
import NewBookModal from './components/NewBookModal';
import useDeletedSnippets from './state/deletedSnippets';
import { Book, Quote, Snippet } from './types/types';

/**
 * TODO
 * - Make a local mapping from title / author to book so it auto assigns when you're clicking through
 * - Persist deleted snippets to the database, so that if we delete a snippet and re-upload the same file, it stays delete
 *  */ 

function App() {
  const [mode, setMode] = useState('waiting')
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [quote, setQuote] = useState<Partial<Quote>>()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [saved, setSaved] = useState<boolean>()

  const [sourceMap, setSourceMap] = useState<{[key: string]: number}>({})
  const [snippets, setSnippets] = useState<Snippet[]>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deletedSnippets, deleteSnippet] = useDeletedSnippets(state => [state.deleted, state.add])

  const filteredSnippets = snippets?.filter(snippet => !deletedSnippets.includes(snippet.createdAt.getTime()))
  const currentSnippet = filteredSnippets && filteredSnippets[currentIndex]
  const existing = quotes.find(({createdAt}) => currentSnippet?.createdAt.getTime() === new Date(createdAt).getTime())

  useEffect(() => {
    fetch("http://localhost:8000/quotes").then(async response => {
      const data = await response.json()
      setQuotes(data)
    })
    fetch("http://localhost:8000/books").then(async response => {
      const data = await response.json()
      setBooks(data)
    })
  }, [])

  useEffect(() => {
    if (!currentSnippet) { return }
    
    if (existing) {
      setQuote({...existing})
    }
    else {
      const { createdAt, content, meta, source } = currentSnippet
      const mappedSource = sourceMap[source]
      setQuote({createdAt, content, meta, source: books.find(({id}) => id === mappedSource)}) 
    }
  }, [books, currentSnippet, sourceMap, quotes])

  const updateBook = (id: number) => {
    if (currentSnippet) {
      setSourceMap({...sourceMap, [currentSnippet.source]: id})
    }
      
    setQuote({...quote, source: books.find(book => book.id === id)!})
  }

  const onDelete = () => {
    const existing = quotes.find(({ createdAt }) => new Date(createdAt) === currentSnippet?.createdAt)
    if (existing) {

    }
    else {
      deleteSnippet(currentSnippet?.createdAt.getTime()!)
    }
  }

  const saveQuote = () => {
    const requestOptions = {
      method: existing ? "PUT" : "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    }

    const url = 'http://localhost:8000/quotes' + (existing && `/${new Date(quote!.createdAt!).getTime()}`)
    fetch(url, requestOptions).then( async response => {
      setQuotes(await response.json())
    })
  }

  const isQuoteValid = quote?.source && quote?.content

  const createAndSetBook = (newBook: Book) => {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    }
    fetch("http://localhost:8000/books", requestOptions).then( async response => {
      const books: Book[] = await response.json()
      setIsModalOpen(false)
      setBooks(books)
      setQuote({...quote, source: books.at(-1)!})
    })
  }

  const quoteSaved = existing && existing.content === quote?.content

  return (
    <RecoilRoot>
      <div className="App flex flex-col items-center">
        This is my kindle snippets processing app
        <div className={"flex justify-center items-center w-4/5 mt-12 border-dashed border-2 shadow-lg " + (quoteSaved ? " shadow-green-500" : "shadow-yellow-500")}>
          {
            mode === 'waiting' ?
              <FileDrop setMode={setMode} setSnippets={setSnippets}/>
            : 
              quote && currentSnippet &&
                <div className='h-full flex flex-col items-stretch'>
                  <h1 className='text-2xl m-3 relative top-2'>Time to analyze each one, edit or delete, and save!</h1>
                  <h2>Source: {currentSnippet.source}</h2>
                  <Select 
                    options={books.map((book: Book) => ({ label: `${book.title} - ${book.author.name}`, value: book.id}))}
                    placeholder="Select Book"
                    onChange={id => updateBook(id)}
                    value={quote.source?.id}
                    className="my-4"
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Button type="text" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                            Create New Book
                          </Button>
                        </Space>
                      </div>
                    )}
                  >
                    {quote.source?.title || "Select Book"}
                  </Select>
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
                    <Button type='primary' onClick={saveQuote} disabled={!isQuoteValid}>Save</Button>
                  </div>
                </div>
            }
        </div>
      </div>
      <NewBookModal open={isModalOpen} setOpen={setIsModalOpen} createAndSetBook={createAndSetBook} bookClue={currentSnippet?.source}/>
    </RecoilRoot>
  );
}

export default App;
