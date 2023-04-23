import { Input, Modal } from 'antd'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserApi, { User } from '../api/user'
import userAtom from '../state/user'

const UserSelect = () => {
  const { allUsers, createUser } = useUserApi()
  const [, setUser] = useAtom(userAtom)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onModalConfirm = async () => {
    if (!name) {
      return
    }
    await createUser({ name })
    setOpen(false)
  }

  const selectUser = (userId: number) => {
    setUser(allUsers.data?.find(({ id }) => id === userId))
    navigate('/')
  }

  return (
    <div className='m-[10%]'>
      <h1 className='text-2xl text-center my-6'>Who's Using Quoats?</h1>
      <div className='flex justify-center'>
        {allUsers.data?.map(({ name, id }: User) => (
          <div
            key={id}
            className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => selectUser(id)}
          >
            {name}
          </div>
        ))}
        <div
          className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
          onClick={() => setOpen(true)}
        >
          +
        </div>
      </div>
      <Modal
        title='New User'
        open={open}
        onOk={onModalConfirm}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: !name }}
      >
        <div className='flex items-center'>
          <div className='pr-2'>Name:</div>
          <Input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
      </Modal>
    </div>
  )
}

export default UserSelect
