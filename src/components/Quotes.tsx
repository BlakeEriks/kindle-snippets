import { useQuery } from '@tanstack/react-query'
import { Menu, MenuProps } from 'antd'
import useQuoteApi from 'api/quote'
import useUserApi from 'api/user'
import { useSetAtom } from 'jotai'
import { cn } from 'lib/utils'
import { find, first } from 'lodash'
import { Copy, Edit, Edit2, Heart, Undo2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { modalStateAtom } from 'state/modal'
import useBookApi, { Book } from '../api/book'
import { EditBookDialog } from './dialog/EditBook'
import { EditQuoteDialog } from './dialog/EditQuote'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'

const Quotes = () => {
  const { getBooks } = useBookApi()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)
  const setEditBookModalState = useSetAtom(modalStateAtom('editBook'))
  const setEditQuoteModalState = useSetAtom(modalStateAtom('editQuote'))
  const { save } = useQuoteApi()
  const [loading, setLoading] = useState({} as any)
  const [hideDisabled, setHideDisabled] = useState(false)
  const { favorites, addFavorite, removeFavorite } = useUserApi()
  const { bookId } = useParams()
  const navigate = useNavigate()

  const toggleFavorite = (quoteId: number) => {
    if (favorites?.includes(quoteId)) {
      removeFavorite(quoteId)
    } else {
      addFavorite(quoteId)
    }
  }

  useEffect(() => {
    if (!bookId && books) {
      navigate(`${first(books)?.id}`)
    }
  }, [bookId, books])

  const activeBook = find(books, { id: parseInt(bookId!) }) as Book

  if (!activeBook) {
    return null
  }

  const toggleDisabled = (quoteId: number) => {
    const quote = find(activeBook.quotes, ({ id }) => id === quoteId)
    if (!quote) return
    setLoading({ ...loading, [quoteId]: true })
    save({ id: quoteId, deleted: !quote?.deleted }).then(() =>
      setLoading({ ...loading, [quoteId]: false })
    )
  }

  const items: MenuProps['items'] = books?.map(({ id, title, author }) => ({
    key: id.toString(),
    label: (
      <div className='flex group w-full items-center'>
        <div className='leading-4 py-2 flex-1 overflow-auto'>
          <div className='overflow-ellipsis max-w-[200px]'>{title}</div>
          <div className='opacity-60'>{author.name}</div>
        </div>
        <Button
          className={cn('opacity-0 group-hover:opacity-100')}
          onClick={() => setEditBookModalState({ bookId: id })}
        >
          <Edit size={12} />
        </Button>
      </div>
    ),
    className: 'h-12',
  }))

  return (
    <div className='flex flex-1 overflow-y-auto'>
      <div className='flex flex-col overflow-auto m-2 w-[300px]'>
        <Menu
          items={items}
          className='flex-1 overflow-auto'
          onSelect={({ key }) => navigate(`../${parseInt(key)}`)}
          selectedKeys={activeBook ? [activeBook.id.toString()] : []}
        />
      </div>
      <div className='flex-1 overflow-auto'>
        <Button
          onClick={() => setHideDisabled(!hideDisabled)}
          className='flex justify-end items-center p-2 px-4 space-x-2 border-b ml-auto'
          variant='ghost'
        >
          <Checkbox checked={hideDisabled} />
          <span>Hide Disabled</span>
        </Button>
        <div className='w-full columns-3 overflow-y-auto'>
          {activeBook?.quotes.map(({ content, id, quotee, deleted, createdAt }) =>
            deleted && hideDisabled ? null : (
              <div
                key={id}
                className={cn(
                  'flex p-6 pr-3 border-b border-r break-inside-avoid group',
                  loading[id] && 'opacity-50'
                )}
              >
                <div className='my-auto flex-1'>
                  <div className='flex items-center mb-2' key={id}>
                    <span
                      className={cn('italic text-sm flex-1', deleted && 'line-through opacity-50')}
                    >
                      "{content}"
                    </span>
                  </div>
                  <div className='flex justify-between text-xs opacity-60'>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                    {quotee && <div>{quotee}</div>}
                  </div>
                </div>
                <div className='flex flex-col justify-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={loading[id]}
                    onClick={() => toggleFavorite(id)}
                    className='opacity-50 hover:opacity-80 transition-all scale-110'
                  >
                    <Heart
                      className={cn('shrink-0')}
                      size={12}
                      fill={favorites?.includes(id) ? 'red' : 'none'}
                    />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={loading[id]}
                    onClick={() => setEditQuoteModalState({ bookId: activeBook.id, quoteId: id })}
                    className='opacity-50 hover:opacity-80 transition-all scale-110'
                  >
                    <Edit2 className='shrink-0' size={12} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={loading[id]}
                    onClick={() => {
                      navigator.clipboard.writeText(content)
                      toast.success('Copied!')
                    }}
                    className='opacity-50 hover:opacity-80 transition-all scale-110'
                  >
                    <Copy className='shrink-0' size={12} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={loading[id]}
                    onClick={() => toggleDisabled(id)}
                    className='opacity-50 hover:opacity-80 transition-all scale-110'
                  >
                    {deleted ? (
                      <Undo2 className='shrink-0' size={12} />
                    ) : (
                      <X className='shrink-0' size={12} />
                    )}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <EditBookDialog />
      <EditQuoteDialog />
    </div>
  )
}

export default Quotes
