import { useQuery } from '@tanstack/react-query'
import { Menu, MenuProps } from 'antd'
import { useSetAtom } from 'jotai'
import { cn } from 'lib/utils'
import { first } from 'lodash'
import { Edit, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { modalStateAtom } from 'state/modal'
import useBookApi, { Book } from '../api/book'
import { EditBookDialog } from './dialog/EditBook'
import { EditQuoteDialog } from './dialog/EditQuote'
import { Button } from './ui/button'

const Quotes = () => {
  const { getBooks } = useBookApi()
  const [selected, setSelected] = useState<number>()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)
  const setEditBookModalState = useSetAtom(modalStateAtom('editBook'))
  const setEditQuoteModalState = useSetAtom(modalStateAtom('editQuote'))
  const activeBook = selected ? books?.find(({ id }) => id === Number(selected)) : first(books)

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
          onSelect={({ key }) => setSelected(parseInt(key))}
          selectedKeys={activeBook ? [activeBook.id.toString()] : []}
        />
      </div>
      <div className='flex-1 overflow-auto'>
        <div className='w-full columns-3 overflow-y-auto'>
          {activeBook?.quotes.map(({ content, id, quotee, deleted }) => (
            <div className='p-6 border-b border-r break-inside-avoid group cursor-pointer space-y-2'>
              <div
                onClick={() => setEditQuoteModalState({ bookId: selected, quoteId: id })}
                className='flex items-center'
                key={id}
              >
                <span className={cn('italic text-sm flex-1', deleted && 'line-through opacity-50')}>
                  "{content}"
                </span>
                <Edit2 className='opacity-0 group-hover:opacity-100 shrink-0' size={12} />
              </div>
              {quotee && <div className='text-right text-xs opacity-60'>{quotee}</div>}
            </div>
          ))}
        </div>
      </div>
      <EditBookDialog />
      <EditQuoteDialog />
    </div>
  )
}

export default Quotes
