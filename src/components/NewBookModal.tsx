import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Divider, Input, Modal, Select, Space } from "antd"
import { useEffect, useState } from "react"
import { Author } from "../types/types"
const { Option } = Select;

type NewBookModalProps = {
  open: boolean,
  setOpen: Function, 
  bookClue?: string,
  createAndSetBook: Function 
}

const NewBookModal = ({open, setOpen, bookClue, createAndSetBook}: NewBookModalProps) => {
  console.log(bookClue)

  const [authors, setAuthors] = useState<Author[]>()
  const [titleClue, authorClue] = bookClue?.split('(').map(clue => clue.slice(0, -1)) || []
  const [author, setAuthor] = useState<Author>()
  const [title, setTitle] = useState<string>()
  const [newAuthor, setNewAuthor] = useState<string>()

  useEffect(() => {
    fetch("http://localhost:8000/authors").then(async response => {
      const data = await response.json()
      setAuthors(data)
    })
  }, [])

  useEffect(() => {
    setTitle(titleClue)
    setNewAuthor(authorClue)
  }, [titleClue, authorClue])

  const createAuthor = () => {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name: newAuthor})
    }

    fetch("http://localhost:8000/authors", requestOptions).then(async response => {
      const data = await response.json()
      setAuthors([...authors || [], data])
    })
  }

  const deleteAuthor = (id: number) => {
    fetch(`http://localhost:8000/authors/${id}`, { method: "DELETE" }).then(async response => {
      await response.json()
      setAuthors(authors?.filter(author => author.id !== id))
    })
  }

  return (
    <Modal title="New Book" open={open} onOk={() => createAndSetBook({title, author})} onCancel={() => setOpen(false)} className="z-50 rounded-md">
      <div className="flex items-center">
        <span className='mr-4'>
          Title:
        </span>
       <Input value={title} onChange={({ target }) => setTitle(target.value)}/>
      </div>
      <Space />
      <div className="flex items-center mt-4">
        <span className='mr-4'>
          Author:
        </span>
        <Select
          placeholder="Select Author"
          style={{flex: 1}}
          onChange={(id: number) => setAuthor(authors?.find(author => author.id === Number(id)))}
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
                <Button type="text" icon={<PlusOutlined />} onClick={createAuthor}>
                  Add Author
                </Button>
              </Space>
            </div>
          )}
        >
          {authors?.map(({ name, id }) => (
            <Option key={id} value={id} label={name}>
              <div className="flex justify-between group">
                <span>
                  {name}
                </span>
                <Button
                  onClick={event => {event.stopPropagation(); deleteAuthor(id)}}
                  icon={<CloseOutlined />}
                  type="text"
                  danger
                  className="opacity-0 group-hover:opacity-100"/>
              </div>
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  )
}

export default NewBookModal