import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  ReadOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Typography, Upload } from 'antd'
import { useEffect, useState } from 'react'
import useAuthorApi from '../api/author'
import useBooksApi from '../api/book'
import useQuoteApi, { Quote } from '../api/quote'
import useFileUpload from '../util/fileUpload'
import Button from './Button'

const Staging = () => {
  const [editing, setEditing] = useState(false)
  const { books, saveBook } = useBooksApi()
  const { saveAuthor } = useAuthorApi()
  const { quotes, save } = useQuoteApi()
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const { handleUpload, dummyRequest } = useFileUpload()

  // const filteredSnippets = allSnippets?.filter(({ staged, deleted }) => !deleted && !staged)

  // const currentSnippet = filteredSnippets && filteredSnippets[currentIndex]
  // const existing = allQuotes.data?.find(
  //   ({ createdAt }) => currentSnippet?.createdAt.getTime() === new Date(createdAt).getTime()
  // )

  // useEffect(() => {
  //   if (!currentSnippet) {
  //     return
  //   }
  //   const { createdAt, content, meta, source } = currentSnippet

  //   setQuote({
  //     createdAt,
  //     content,
  //     meta,
  //     source: allBooks.data?.find(({ id }) => id === source.bookId),
  //     tags: [],
  //   })
  // }, [currentSnippet, allQuotes.data, allBooks.data])

  // const onDelete = () => {
  //   currentSnippet && deleteSnippet(currentSnippet.id)
  // }

  // const updateSnippet =
  const bookIdToSnippets: { [key: number]: Quote[] } = {}
  quotes?.forEach(snippet => {
    if (!bookIdToSnippets[snippet.book!.id]) {
      bookIdToSnippets[snippet.book!.id] = []
    }
    bookIdToSnippets[snippet.book!.id].push(snippet)
  })
  const bookIds = Object.keys(bookIdToSnippets)

  const currentBook = books?.find(book => book.id === Number(bookIds[currentBookIndex]))

  const approveAll = async () => {
    if (!currentBook?.id) {
      return
    }

    for (const book of bookIdToSnippets[currentBook.id]) {
      if (!book.deleted) {
        await save({ id: book.id, staged: true })
      }
    }
  }

  // useEffect(() => {
  //   if (allSnippets && allBooks.data) {
  //     setCurrentBookId(Number(bookIds[0]))
  //   }
  // }, [allSnippets, allBooks])

  // const addQuote = () => {
  //   if (!currentSnippet) { return }

  //   const index = allSnippets?.findIndex(snippet => snippet.createdAt === currentSnippet.createdAt)
  //   const createdAt = new Date(new Date(currentSnippet.createdAt).getTime() + 1000)
  //   setSnippets([
  //     ...allSnippets.slice(0, index),
  //     {
  //       ...currentSnippet,
  //       createdAt,
  //     },
  //     ...allSnippets.slice(index),
  //   ])
  // }

  useEffect(() => {
    const onPress = (e: any) => {
      if (e.keyCode === 37) {
        currentBookIndex > 0 && setCurrentBookIndex(currentBookIndex - 1)
      }
      if (e.keyCode === 39) {
        bookIds[currentBookIndex + 1] && setCurrentBookIndex(currentBookIndex + 1)
      }
    }
    if (!editing) window.addEventListener('keydown', onPress)

    return () => window.removeEventListener('keydown', onPress)
  }, [bookIds, currentBookIndex])

  console.log(quotes)

  console.log(currentBook)

  return quotes?.length && currentBook ? (
    <div className='flex flex-col h-full items-center px-8 max-w-[650px] mx-auto bg-zinc-200 rounded-xl overflow-auto'>
      <div className='flex w-full justify-between items-stretch'>
        <Button
          icon={<ArrowLeftOutlined />}
          className='h-auto mr-0'
          disabled={currentBookIndex === 0}
          onClick={() => setCurrentBookIndex(currentBookIndex - 1)}
          type='text'
        />
        <header className='p-4 flex-1 max-w-lg'>
          <div className='flex text-4xl items-center justify-center gap-x-2'>
            <ReadOutlined />
            <Typography.Title
              level={2}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: val => saveBook({ id: currentBook.id, title: val }),
                text: currentBook?.title,
                onStart: () => setEditing(true),
                onEnd: () => setEditing(false),
              }}
              className='text-center'
            >
              {currentBook?.title}
            </Typography.Title>
          </div>
          <div className='flex items-center justify-center gap-x-2'>
            By
            <Typography.Title
              level={4}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: name => saveAuthor({ id: currentBook.author.id, name }),
                text: currentBook?.author.name,
                onStart: () => setEditing(true),
                onEnd: () => setEditing(false),
              }}
            >
              {currentBook?.author.name}
            </Typography.Title>
          </div>
        </header>
        <Button
          icon={<ArrowRightOutlined />}
          className='h-auto mr-0'
          disabled={!bookIds[currentBookIndex + 1]}
          onClick={() => setCurrentBookIndex(currentBookIndex + 1)}
          type='text'
        />
      </div>
      <div className='w-full p-4 rounded-xl bg-white space-y-2 overflow-auto'>
        {currentBook &&
          bookIdToSnippets[currentBook.id!]?.map(
            ({ id, content, deleted, quotee, staged }, index) => (
              <div className='flex items-center group space-x-4 w-full' key={index}>
                {deleted ? (
                  <Button
                    className={'opacity-0 group-hover:opacity-100'}
                    icon={<UndoOutlined onClick={() => save({ id: id, deleted: false })} />}
                    type='text'
                  />
                ) : (
                  <Button
                    className={'opacity-0 group-hover:opacity-100'}
                    icon={<CloseOutlined />}
                    danger
                    type='text'
                    onClick={() => save({ id: id, deleted: true })}
                  />
                )}
                <div className={'flex flex-col w-full border-b ' + (deleted && 'opacity-50')}>
                  <Typography.Paragraph
                    italic
                    delete={deleted}
                    editable={
                      !deleted && {
                        onChange: val => save({ id: id, content: val }),
                        text: content,
                        onStart: () => setEditing(true),
                        onEnd: () => setEditing(false),
                      }
                    }
                    className='flex-1 text-lg mb-0'
                  >
                    "{content}"
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    delete={deleted}
                    editable={
                      !deleted && {
                        onChange: val =>
                          save({
                            id: id,
                            quotee: val === currentBook?.author.name ? undefined : val,
                          }),
                        text: quotee || currentBook?.author.name,
                        onStart: () => setEditing(true),
                        onEnd: () => setEditing(false),
                      }
                    }
                    className='text-right'
                  >
                    - {quotee || currentBook?.author.name}
                  </Typography.Paragraph>
                </div>
                {staged && <CheckCircleOutlined className='text-green-500' />}
              </div>
            )
          )}
        <div className='flex justify-center'>
          <Button
            icon={<PlusOutlined />}
            onClick={() => save({ createdAt: new Date(), content: '' })}
          />
        </div>
      </div>
      <div className='flex justify-center my-2'>
        <Button icon={<CheckCircleOutlined />} type='primary' onClick={() => approveAll()}>
          Approve All
        </Button>
      </div>
    </div>
  ) : (
    <div className='flex flex-col justify-center items-center my-4 px-8 max-w-[650px] mx-auto bg-zinc-200 rounded-xl'>
      <Upload
        beforeUpload={handleUpload}
        name='file'
        customRequest={dummyRequest}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload some snippets</Button>
      </Upload>
    </div>
  )
}

const useKeyPress = () => {
  const [keyPressed, setKeyPressed] = useState(false)

  return keyPressed
}

export default Staging
