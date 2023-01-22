import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Divider, Input, Select, Space } from "antd"
import { useEffect, useState } from "react"
import useAuthorApi from '../../api/author';
import { Book } from "../../types/types";
const { Option } = Select;

interface NewBookDialogueProps {
  bookClue: string
  book: Book
  setBook: Function
}

const NewBookDialogue = ({bookClue, book, setBook}: NewBookDialogueProps) => {

  const { allAuthors, saveAuthor, deleteAuthor } = useAuthorApi()
  const [titleClue, authorClue] = bookClue?.split('(').map(clue => clue.slice(0, -1)) || []
  const [newAuthor, setNewAuthor] = useState<string>()

  useEffect(() => {
    setBook({...book, title: titleClue})
    setNewAuthor(authorClue)
  }, [titleClue, authorClue])

  return (
    <>
      <div className="flex items-center">
        <span className='mr-4'>
          Title:
        </span>
        <Input value={book.title} onChange={({ target }) => setBook({...book, title: target.value})}/>
      </div>
      <Space />
      <div className="flex items-center mt-4">
        <span className='mr-4'>
          Author:
        </span>
        <Select
          placeholder="Select Author"
          style={{flex: 1}}
          onChange={(id: number) => setBook({...book, author: allAuthors.data?.find(author => author.id === Number(id))})}
          optionLabelProp="label"
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="New Author"
                  value={newAuthor}
                  onChange={({ target }) => setNewAuthor(target.value)}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={() => saveAuthor({name: newAuthor})}>
                  Add Author
                </Button>
              </Space>
            </div>
          )}
        >
          {allAuthors.data?.map(({ name, id }) => (
            <Option key={id} value={id} label={name}>
              <div className="flex justify-between group">
                <span>
                  {name}
                </span>
                <Button
                  onClick={event => {event.stopPropagation(); if (id) deleteAuthor(id)}}
                  icon={<CloseOutlined />}
                  type="text"
                  danger
                  className="opacity-0 group-hover:opacity-100"/>
              </div>
            </Option>
          ))}
        </Select>
      </div>
    </>
  )
}

export default NewBookDialogue