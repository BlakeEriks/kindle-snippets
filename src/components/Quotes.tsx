import { BookOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Menu, MenuProps } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import useBookApi, { Book } from '../api/book'
import { Quote } from '../api/quote'
import Table from './Table'

const Quotes = () => {
  const { getBooks } = useBookApi()
  const [selected, setSelected] = useState<string>()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)

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

  useEffect(() => {
    if (books?.length) {
      setSelected(books[0].id.toString())
    }
  }, [books])

  const items: MenuProps['items'] = books?.map(({ id, title, author }) => ({
    key: id,
    label: (
      <div className='leading-4 py-2'>
        <div>{title}</div>
        <div className='opacity-60'>{author.name}</div>
      </div>
    ),
    className: 'h-auto',
  }))

  return (
    <div className='flex flex-1 overflow-auto'>
      <div className='flex flex-col overflow-auto m-2'>
        <div className='flex'>
          <Button icon={<BookOutlined />}>Book</Button>
          <Search className='' />
        </div>
        <Menu
          items={items}
          className='flex-1 overflow-auto'
          onSelect={({ key }) => setSelected(key)}
          selectedKeys={selected ? [selected] : []}
        />
      </div>
      <div className='flex-1'>
        <Table dataSource={activeBook?.quotes} columns={columns} pagination={false} />
      </div>
    </div>
  )
}

export default Quotes
