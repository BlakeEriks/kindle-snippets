import { CopyOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Checkbox, Pagination } from 'antd';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useBooksApi from '../api/book';
import useQuotesApi from '../api/quote';
import deletedSnippetsAtom from '../state/deletedSnippets';
import sourceMapAtom from '../state/sourceMap';
import { Quote, Snippet } from '../types/types';
import Button from './Button';
import EditQuote from './EditQuote';

const UploadSnippets = () => {
  const { state } = useLocation();
  
  const { allQuotes, saveQuote } = useQuotesApi()
  const { allBooks } = useBooksApi()
  const [sourceMap] = useAtom(sourceMapAtom)
  const [quote, setQuote] = useState<Partial<Quote>>({})
  const [snippets, setSnippets] = useState<Snippet[]>(state.snippets)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deletedSnippets, setDeletedSnippets] = useAtom(deletedSnippetsAtom)
  const [hideSaved, setHideSaved] = useState(false)
  
  const filteredSnippets = snippets?.filter(snippet => {
    const existing = allQuotes.data?.find(({createdAt}) => snippet?.createdAt.getTime() === new Date(createdAt).getTime())
    return !deletedSnippets.includes(snippet.createdAt.getTime()) && (hideSaved ? !existing : true)
  })

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
      setQuote({
        createdAt,
        content,
        meta,
        source: allBooks.data?.find(({id}) => id === mappedSource),
        tags: []
      })
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
    <div className='flex flex-col items-center w-1/2 mx-auto'>
      <h1 className='my-4 text-2xl'>Edit Snippets</h1>
      <EditQuote snippet={currentSnippet} quote={quote} setQuote={setQuote}/>
      <div className='flex w-full items-center justify-center'>
        <Checkbox 
          checked={hideSaved} 
          onClick={() => setHideSaved(!hideSaved)}
          className='self-start'
        >
          Hide Saved
        </Checkbox>
        <Pagination
          simple
          pageSize={1}
          current={currentIndex + 1}
          total={filteredSnippets?.length}
          onChange={val => setCurrentIndex(val - 1)}
          className="my-2"
        />
      </div>
      <div className="flex justify-center my-2">
        <Button icon={<DeleteOutlined />} onClick={onDelete} danger className='mr-2'>Delete</Button>
        <Button icon={<CopyOutlined />} onClick={addQuote} className='mr-2'>Duplicate</Button>
        <Button icon={<SaveOutlined />} type='primary' onClick={() => saveQuote(quote as Quote)} disabled={!quote?.source || !quote?.content}>Save</Button>
        </div>
    </div>
  )
}

export default UploadSnippets