import {
  CloseOutlined,
  ReadOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Space, Typography, Upload } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'
import useAuthorApi from '../api/author'
import useBooksApi from '../api/book'
import useQuotesApi, { Quote } from '../api/quote'
import useSnippetsApi, { Snippet } from '../api/snippets'
import useFileUpload from '../util/fileUpload'
import Button from './Button'

const Staging = () => {
  const { allQuotes, saveQuote } = useQuotesApi()
  const { allBooks, saveBook } = useBooksApi()
  const { saveAuthor } = useAuthorApi()
  const [quote, setQuote] = useState<Partial<Quote>>({})
  const { allSnippets, saveSnippet } = useSnippetsApi()
  const [currentBookId, setCurrentBookId] = useState<number>()
  const { handleUpload, dummyRequest } = useFileUpload()

  // console.log(allSnippets)

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

  const currentBook = allBooks.data?.find(book => book.id === currentBookId)

  useEffect(() => {
    if (allSnippets && allBooks.data) {
      setCurrentBookId(allSnippets[0]?.source.bookId)
    }
  }, [allSnippets, allBooks])

  const bookIdToSnippets: { [key: number]: Snippet[] } = {}
  allSnippets?.forEach(snippet => {
    if (!bookIdToSnippets[snippet.source.bookId]) {
      bookIdToSnippets[snippet.source.bookId] = []
    }
    bookIdToSnippets[snippet.source.bookId].push(snippet)
  })

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

  console.log(allSnippets)

  return allSnippets?.length && currentBook ? (
    <div className='flex flex-col items-center my-4 px-8 max-w-[650px] mx-auto bg-zinc-200 rounded-xl'>
      <div className='h-full flex flex-col items-stretch w-full'>
        <header className='p-4'>
          <div className='flex text-4xl items-center justify-center gap-x-2'>
            <ReadOutlined />
            <Title
              level={2}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: val => saveBook({ id: currentBook.id, title: val }),
                text: currentBook?.title,
              }}
              className='whitespace-nowrap'
            >
              {currentBook?.title}
            </Title>
          </div>
          <div className='flex items-center justify-center gap-x-2'>
            By
            <Title
              level={4}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: name => saveAuthor({ id: currentBook.author.id, name }),
                text: currentBook?.author.name,
              }}
            >
              {currentBook?.author.name}
            </Title>
          </div>
        </header>
        <div className='p-4 rounded-xl bg-white space-y-2'>
          {currentBookId &&
            bookIdToSnippets[currentBookId]?.map(({ id, content, deleted, quotee }, index) => (
              <Space className='group'>
                {deleted ? (
                  <Button
                    className={'opacity-0 group-hover:opacity-100'}
                    icon={<UndoOutlined onClick={() => saveSnippet({ id: id, deleted: false })} />}
                    type='text'
                  />
                ) : (
                  <Button
                    className={'opacity-0 group-hover:opacity-100'}
                    icon={<CloseOutlined />}
                    danger
                    type='text'
                    onClick={() => saveSnippet({ id: id, deleted: true })}
                  />
                )}
                <Space
                  direction='vertical'
                  className={'w-full border-b ' + (deleted && 'opacity-50')}
                  key={index}
                >
                  <Typography.Paragraph
                    italic
                    delete={deleted}
                    editable={
                      !deleted && {
                        onChange: val => saveSnippet({ id: id, content: val }),
                        text: content,
                      }
                    }
                    className='text-lg mb-0'
                  >
                    "{content}"
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    delete={deleted}
                    editable={
                      !deleted && {
                        onChange: val =>
                          saveSnippet({
                            id: id,
                            quotee: val === currentBook?.author.name ? undefined : val,
                          }),
                        text: quotee || currentBook?.author.name,
                      }
                    }
                    className='text-right'
                  >
                    - {quotee || currentBook?.author.name}
                  </Typography.Paragraph>
                </Space>
              </Space>
            ))}
        </div>
      </div>
      <div className='flex justify-center my-2'>
        <Button
          icon={<SaveOutlined />}
          type='primary'
          onClick={() => saveQuote(quote as Quote)}
          disabled={!quote?.source || !quote?.content}
        >
          Save
        </Button>
      </div>
    </div>
  ) : (
    <div className='flex flex-col h-full justify-center items-center my-4 px-8 max-w-[650px] mx-auto bg-zinc-200 rounded-xl'>
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

export default Staging
