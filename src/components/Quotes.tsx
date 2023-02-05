
import { BookOutlined } from '@ant-design/icons';
import { Button, Menu, MenuProps } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import useBookApi from '../api/book';
import useQuotesApi from '../api/quote';
import { Quote, Tag } from '../types/types';
import Table from './Table';

const Quotes = () => {

  const { allQuotes } = useQuotesApi()
  const { allBooks } = useBookApi()
  const [selected, setSelected] = useState('0')

  const columns: ColumnsType<Quote> = [
    {
      title: 'Quote',
      dataIndex: 'content',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: tags => 
        <div className='flex flex-wrap'>
          {tags.map((tag: Tag) => 
            <span key={tag.id} className='rounded-md border border-gray-500 p-1 m-1'>
              {tag.name}
            </span>
          )}
        </div>,
      width: 200
    },
  ]

  const items: MenuProps['items'] = allBooks.data?.map(
    (book, index) => (
      {
        key: index,
        label: <span>{book.title}</span>,
      }
    )
  )
  
  const filteredQuotes = allQuotes.data?.map((quote, index) => ({...quote, key: index}))
    .filter((quote) => quote.source?.id === allBooks.data?.at(Number(selected))?.id)
    
  return (
    <div className='flex h-full'>
      <div className='h-full overflow-auto m-2'>
        <div className='flex'>
          <Button
            icon={<BookOutlined />}
          >
            Book
          </Button>
          <Search className=''/>
        </div>
        <Menu
          items={items}
          className='overflow-auto'
          onSelect={({ key }) => setSelected(key)}
          selectedKeys={[selected]}
        />
      </div>
      <div className='flex-1'>
        <Table
          dataSource={filteredQuotes}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default Quotes