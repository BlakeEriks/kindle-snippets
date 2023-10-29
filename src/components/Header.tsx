import { Tooltip, Upload } from 'antd'
import { useAtomValue } from 'jotai'
import { ArrowLeftRight, HomeIcon, PlusIcon, SmileIcon, UploadIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import userAtom from '../state/user'
import useFileUpload from '../util/fileUpload'
import { Button } from './ui/button'

const Header = () => {
  const user = useAtomValue(userAtom)
  const { handleUpload, dummyRequest } = useFileUpload()

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b'>
      {/* <Link to='/'> */}
      <div className='flex flex-1'>
        <h1 className='text-4xl italic font-semibold'>Quotes</h1>
        <h1 className='text-4xl italic font-light'>- the app</h1>
      </div>
      {/* </Link> */}
      <div className='flex items-center'>
        <Link to='/'>
          <Tooltip placement='bottom' title='Home'>
            <Button>
              <HomeIcon />
            </Button>
          </Tooltip>
        </Link>
        <Link to='random'>
          <Tooltip placement='bottom' title='Random Quote'>
            <Button>
              <ArrowLeftRight />
            </Button>
          </Tooltip>
        </Link>
        {/* <Link to='staging'>
          <Tooltip placement='bottom' title='Quote Staging'>
            <Button>
              <Edit />
            </Button>
          </Tooltip>
        </Link> */}
        <Tooltip placement='bottom' title='Upload Snippets'>
          <Upload
            beforeUpload={handleUpload}
            name='file'
            customRequest={dummyRequest}
            showUploadList={false}
          >
            <Button>
              <UploadIcon />
            </Button>
          </Upload>
        </Tooltip>
        <Link to='new'>
          <Tooltip placement='bottom' title='Add Quote'>
            <Button>
              <PlusIcon />
            </Button>
          </Tooltip>
        </Link>
        <Link to='user'>
          <Tooltip placement='bottom' title='Change User'>
            <Button className='w-12'>{user ? user.name[0].toUpperCase() : <SmileIcon />}</Button>
          </Tooltip>
        </Link>
      </div>
    </header>
  )
}

export default Header
