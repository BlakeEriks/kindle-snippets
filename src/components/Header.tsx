import { Tooltip, Upload } from 'antd'
import { useAtomValue } from 'jotai'
import { cn } from 'lib/utils'
import { ArrowLeftRight, PlusIcon, SmileIcon, UploadIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import userAtom from '../state/user'
import useFileUpload from '../util/fileUpload'
import { Button } from './ui/button'

const Header = () => {
  const user = useAtomValue(userAtom)
  const { handleUpload, dummyRequest } = useFileUpload()
  const location = window.location.pathname

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b'>
      {/* <Link to='/'> */}
      <div className='flex flex-1'>
        <Link to='/' className='flex'>
          <h1 className='text-4xl italic font-semibold'>Quotes</h1>
          <h1 className='text-4xl italic font-light opacity-50'> - the app</h1>
        </Link>
      </div>
      {/* </Link> */}
      <div className='flex items-center'>
        {/* <Tooltip placement='bottom' title='Home'>
            <Button className={cn(location === '/' && 'border')}>
              <HomeIcon />
            </Button>
          </Tooltip>
        </Link> */}
        <Link
          to={`random/${new Date().getTime()}`}
          className={cn(location.includes('random') && 'border')}
        >
          <Tooltip placement='bottom' title='Random Quote'>
            <Button className=''>
              <ArrowLeftRight />
            </Button>
          </Tooltip>
        </Link>
        {/* <Link to='staging'>
          <Tooltip placement='bottom' title='Quote Staging'>
            <Button className=''>
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
            <Button className=''>
              <UploadIcon />
            </Button>
          </Upload>
        </Tooltip>
        <Link to='new'>
          <Tooltip placement='bottom' title='Add Quote'>
            <Button className=''>
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
