import { CopyOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Pagination } from 'antd';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useBooksApi from '../api/book';
import useQuotesApi from '../api/quote';
import deletedSnippetsAtom from '../state/deletedSnippets';
import sourceMapAtom from '../state/sourceMap';
import { Quote, Snippet } from '../types/types';
import EditQuote from './EditQuote';

const UploadSnippets = () => {
  const { state } = useLocation();
  
  const { allQuotes, saveQuote } = useQuotesApi()
  const { allBooks, createBook } = useBooksApi()
  const [sourceMap, setSourceMap] = useAtom(sourceMapAtom)
  const [quote, setQuote] = useState<Partial<Quote>>()
  const [snippets, setSnippets] = useState<Snippet[]>(state.snippets)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deletedSnippets, setDeletedSnippets] = useAtom(deletedSnippetsAtom)
  
  const filteredSnippets = snippets?.filter(snippet => !deletedSnippets.includes(snippet.createdAt.getTime()))
  const currentSnippet = filteredSnippets && filteredSnippets[currentIndex]
  const existing = allQuotes.data?.find(({createdAt}) => currentSnippet?.createdAt.getTime() === new Date(createdAt).getTime())
  
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
  }, [currentSnippet, allQuotes.data, allBooks.data])

  const onDelete = () => {
    if (existing) {

    }
    else {
      setDeletedSnippets([...deletedSnippets, currentSnippet?.createdAt.getTime()!])
    }
  }

  const addQuote = () => {
    const index = snippets.findIndex(snippet => snippet.createdAt === currentSnippet.createdAt)
    const createdAt = new Date (new Date(currentSnippet.createdAt).getTime() + 1000)
    setSnippets([
      ...snippets.slice(0,index), 
      {
        ...currentSnippet,
        createdAt
      },
      ...snippets.slice(index)
    ])
  }

  return (
    <div className='flex justify-center items-center w-full mt-12 border-dashed border-2 shadow-lg'>
      {
        quote && currentSnippet &&
        <div className='flex flex-col items-center w-1/2'>
          <EditQuote snippet={currentSnippet} quote={quote} setQuote={setQuote}/>
          <Pagination
            simple
            pageSize={1}
            current={currentIndex + 1}
            total={filteredSnippets?.length}
            onChange={val => setCurrentIndex(val - 1)}
            className="flex justify-center my-2"
          />
          <div className="flex justify-center my-2">
            <Button icon={<DeleteOutlined />} onClick={onDelete} danger className='mr-2'>Delete</Button>
            <Button icon={<CopyOutlined />} onClick={addQuote} className='mr-2'>Duplicate</Button>
            <Button icon={<SaveOutlined />} type='primary' onClick={() => saveQuote(quote as Quote)} disabled={!quote?.source || !quote?.content}>Save</Button>
            </div>
        </div>
        }
    </div> 
  )
}

export default UploadSnippets