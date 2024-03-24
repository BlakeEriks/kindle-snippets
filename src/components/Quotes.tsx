import { useQuery } from '@tanstack/react-query'
import { Menu, MenuProps } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { cn } from 'lib/utils'
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import useBookApi, { Book } from '../api/book'
import { Quote } from '../api/quote'
import useModal from '../state/modal'
import { EditBookDialog } from './dialog/EditBook'
import { Button } from './ui/button'

const Quotes = () => {
  const { getBooks } = useBookApi()
  const [selected, setSelected] = useState<string>()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)
  const modal = useModal()

  const activeBook = books?.find(({ id }) => id === Number(selected))

  const columns: ColumnsType<Quote> = [
    {
      title: 'Quote',
      dataIndex: 'content',
    },
    // {
    //   title: 'Tags',
    //   dataIndex: 'tags',
    //   render: tags => (
    //     <div className='flex flex-wrap'>
    //       {tags?.map((tag: TagType) => (
    //         <Tag color='default' key={tag.id} className='p-1 m-1'>
    //           {tag.name}
    //         </Tag>
    //       ))}
    //     </div>
    //   ),
    //   width: 200,
    // },
  ]

  const openEditBookModal = (bookId: number) => {
    modal.openModal({
      title: 'Edit Book',
      children: <div>hi</div>,
      bookId,
    })
  }

  useEffect(() => {
    if (books?.length) {
      setSelected(books[0].id?.toString())
    }
  }, [books])

  const items: MenuProps['items'] = books?.map(({ id, title, author }) => ({
    key: id.toString(),
    label: (
      <div className='flex group w-full items-center'>
        <div className='leading-4 py-2 flex-1 overflow-auto'>
          <div className='text-ellipsis'>{title}</div>
          <div className='opacity-60'>{author.name}</div>
        </div>
        {/* <EditBookDialog> */}
        <Button
          className={cn('opacity-0 group-hover:opacity-100')}
          onClick={() => openEditBookModal(id)}
        >
          <Edit size={12} />
        </Button>
        {/* </EditBookDialog> */}
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
          onSelect={({ key }) => setSelected(key)}
          selectedKeys={selected ? [selected] : []}
        />
      </div>
      <div className='flex-1 overflow-auto'>
        <div className='w-full columns-3 overflow-y-auto'>
          {activeBook?.quotes.map(quote => (
            <div className='p-6 border-b border-r text-sm italic break-inside-avoid'>
              <div>"{quote.content}"</div>
              <div className='text-right'>- {quote.quotee ?? activeBook.author.name}</div>
            </div>
          ))}
          {/* <Table dataSource={activeBook?.quotes} columns={columns} pagination={false} /> */}
        </div>
      </div>
      <EditBookDialog />
    </div>
  )
}

export default Quotes
