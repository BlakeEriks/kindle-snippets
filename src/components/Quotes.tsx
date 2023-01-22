
import { Select, Table } from 'antd';
import useQuotesApi from '../api/quote';
import { Book } from '../types/types';
import { useState } from 'react';
import useBookApi from '../api/book';
import useAuthorApi from '../api/author';

const Quotes = () => {

  const { allQuotes } = useQuotesApi()
  const { allBooks } = useBookApi()
  const { allAuthors } = useAuthorApi()
  const [bookFilter, setBookFilter] = useState<string>()

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Quotee',
      dataIndex: 'quotee',
      key: 'quotee',
    },
    {
      title: 'Book',
      dataIndex: 'source',
      key: 'source',
      render: (source: Book) => source.title
    },
    {
      title: 'Quote',
      dataIndex: 'content',
      key: 'content',
    },
  ]

  // console.log(allQuotes.data)
  const books = allBooks.data?.map(book => {
    return {
      value: book.title,
      label: book.title
    }
  })
  
  const authors = allAuthors.data?.map(author => {
    return {
      value: author.name,
      label: author.name
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='flex items-center p-2'>
        <Select
          showSearch
          placeholder="Select a book"
          optionFilterProp="children"
          onChange={event => console.log(event)}
          onSearch={bookFilter => setBookFilter(bookFilter)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={books}
          className='w-64 mr-2'
        />
        <Select
          showSearch
          placeholder="Select an author"
          optionFilterProp="children"
          onChange={event => console.log(event)}
          onSearch={bookFilter => setBookFilter(bookFilter)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={authors}
          className='w-64'
        />
      </div>
      <Table
        dataSource={allQuotes.data?.map((quote, index) => ({...quote, key: index}))}
        columns={columns}
      />
    </div>
  )
}

export default Quotes