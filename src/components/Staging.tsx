import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Checkbox, Space, Typography } from 'antd'
import { useState } from 'react'
import useAuthorApi from '../api/author'
import useBooksApi, { Book } from '../api/book'
import useQuoteApi from '../api/quote'
import useFileUpload from '../util/fileUpload'
import { Button } from './ui/button'

const Staging = () => {
  const { getBooks, saveBook } = useBooksApi()
  const { saveAuthor } = useAuthorApi()
  const { save } = useQuoteApi()
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const { handleUpload, dummyRequest } = useFileUpload()

  const [hideDeleted, setHideDeleted] = useState(false)
  const [hideStaged, setHideStaged] = useState(false)

  const { data: books } = useQuery<Book[]>(['books'], () => getBooks())

  const [selected, setSelected] = useState<string>()
  const activeBook = books?.[currentBookIndex]

  const [newQuoteText, setNewQuoteText] = useState('')
  const [newQuotee, setNewQuotee] = useState('')

  console.log(books)

  const approveAll = async () => {
    if (!activeBook) return

    for (const quote of activeBook.quotes) {
      if (!quote.deleted) {
        await save({ ...quote, staged: true })
      }
    }
  }

  const quotes = activeBook?.quotes.filter(
    ({ deleted, staged }) => (hideDeleted ? !deleted : true) && (hideStaged ? !staged : true)
  )

  return activeBook ? (
    <div className='flex flex-col h-full items-center px-8 w-[650px] mx-auto bg-zinc-200 rounded-xl overflow-auto '>
      <div className='flex w-full justify-between items-stretch'>
        <Button
          className='h-auto mr-0'
          disabled={currentBookIndex === 0}
          onClick={() => setCurrentBookIndex(currentBookIndex - 1)}
        >
          <ArrowLeftOutlined />
        </Button>
        <header className='p-4 flex-1 max-w-lg'>
          <div className='flex text-4xl items-center justify-center gap-x-2'>
            <Typography.Title
              level={2}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: val => saveBook({ ...activeBook, title: val }),
                text: activeBook.title,
              }}
              className='text-center'
            >
              {activeBook.title}
            </Typography.Title>
          </div>
          <div className='flex items-center justify-center gap-x-2'>
            By
            <Typography.Title
              level={4}
              italic
              style={{ margin: 0 }}
              editable={{
                onChange: name => saveAuthor({ ...activeBook.author, name }),
                text: activeBook.author.name,
              }}
            >
              {activeBook.author.name}
            </Typography.Title>
          </div>
        </header>
        <Button
          className='h-auto mr-0'
          disabled={!books[currentBookIndex + 1]}
          onClick={() => setCurrentBookIndex(currentBookIndex + 1)}
        >
          <ArrowRightOutlined />
        </Button>
      </div>
      <div className='w-full flex-1 p-4 rounded-xl bg-white space-y-2 overflow-auto'>
        {quotes?.map(({ id, content, deleted, quotee, staged }, index) => (
          <div className='flex items-center group space-x-4 w-full' key={index}>
            {deleted ? (
              <Button className='opacity-0 group-hover:opacity-100'>
                <UndoOutlined onClick={() => save({ id: id, deleted: false })} />
              </Button>
            ) : (
              <Button
                className={'opacity-0 group-hover:opacity-100'}
                variant='destructive'
                onClick={() => save({ id: id, deleted: true })}
              >
                <CloseOutlined />
              </Button>
            )}
            <div className={'flex flex-col w-full border-b ' + (deleted && 'opacity-50')}>
              <Typography.Paragraph
                italic
                delete={deleted}
                editable={
                  !deleted && {
                    onChange: val => save({ id: id, content: val }),
                    text: content,
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
                        quotee: val === activeBook.author.name ? undefined : val,
                      }),
                    text: quotee || activeBook.author.name,
                  }
                }
                className='text-right'
              >
                - {quotee || activeBook.author.name}
              </Typography.Paragraph>
            </div>
            {staged && <CheckCircleOutlined className='text-green-500' />}
          </div>
        ))}
        <div className='flex justify-center'>
          <Button onClick={() => save({ content: '', book: activeBook })}>
            <PlusOutlined />
          </Button>
        </div>
      </div>
      <div className='flex w-full justify-between my-2'>
        <Space>
          <Checkbox checked={hideDeleted} onClick={() => setHideDeleted(!hideDeleted)}>
            Hide Deleted
          </Checkbox>
          <Checkbox checked={hideStaged} onClick={() => setHideStaged(!hideStaged)}>
            Hide Staged
          </Checkbox>
        </Space>
        <Button onClick={() => approveAll()}>
          <CheckCircleOutlined />
          Approve All
        </Button>
      </div>
    </div>
  ) : (
    <p>Upload some clippings using the header bar to get started.</p>
  )
}

export default Staging
