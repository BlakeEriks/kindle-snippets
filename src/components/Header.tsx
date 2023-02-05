
import { PlusOutlined, SmileOutlined, UploadOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Layout, Tooltip, Upload } from 'antd';
import { useAtomValue } from 'jotai';
import { Link } from 'react-router-dom';
import userAtom from '../state/user';
import useFileUpload from '../util/fileUpload';
import Button from './Button';

const Header = () => {
  const { handleUpload, dummyRequest } = useFileUpload()
  const user = useAtomValue(userAtom)

  return (
    <Layout.Header className='flex w-full justify-between pt-2'>
      <Link to="/">
        <h1 className='text-4xl text-white'>Quotes</h1>
      </Link>
      <div className='flex'>
        <Link to="random">
          <Tooltip placement="bottom" title="Random Quote">
            <Button size='large' icon={<UserSwitchOutlined />} />
          </Tooltip>
        </Link>
        <Tooltip placement="bottom" title="Upload Snippets">
          <Upload beforeUpload={handleUpload} name='file' customRequest={dummyRequest} showUploadList={false} disabled={!user}>
            <Button size='large' icon={<UploadOutlined />} />
          </Upload>
        </Tooltip>
        <Link to="new">
          <Tooltip placement="bottom" title="Add Quote">
            <Button size='large' icon={<PlusOutlined />} />
          </Tooltip>
        </Link>
        <Tooltip placement="bottom" title="Change User">
          <Link to="user">
            <Button size='large' className='w-12'>
              {user ? user.name[0].toUpperCase() : <SmileOutlined />}  
            </Button>
          </Link>
        </Tooltip>
      </div>
    </Layout.Header>
  )
}

export default Header
