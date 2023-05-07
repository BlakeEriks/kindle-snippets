import { BookOutlined } from '@ant-design/icons'
import { Button, Menu, MenuProps, Tag } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import useBookApi from '../api/book'
import { Quote } from '../api/quote'
import { TagType } from '../api/tag'
import Table from './Table'

const Quotes = () => {
  const { books } = useBookApi()
  const [selected, setSelected] = useState<string>()
  const activeBook = books?.find(({ id }) => id === Number(selected))

  const columns: ColumnsType<Quote> = [
    {
      title: 'Quote',
      dataIndex: 'content',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: tags => (
        <div className='flex flex-wrap'>
          {tags?.map((tag: TagType) => (
            <Tag color='default' key={tag.id} className='p-1 m-1'>
              {tag.name}
            </Tag>
          ))}
        </div>
      ),
      width: 200,
    },
  ]

  const items: MenuProps['items'] = books?.map(({ id, title }) => ({
    key: id,
    label: <span>{title}</span>,
  }))

  return (
    <div className='flex h-full'>
      <div className='h-full overflow-auto m-2'>
        <div className='flex'>
          <Button icon={<BookOutlined />}>Book</Button>
          <Search className='' />
        </div>
        <Menu
          items={items}
          className='overflow-auto'
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
