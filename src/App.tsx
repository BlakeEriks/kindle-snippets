import { PlusOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import { useAtomValue } from 'jotai';
import { Link, Outlet } from 'react-router-dom';
import userAtom from './state/user';
import useFileUpload from './util/fileUpload';

/**
 * TODO
 * Create a quote without the source, so we can write one offs
 * Let's make a singular view for quotes to land on that you can randomize, and then another view for looking at many quotes + filtering them
 * Move the source map into local storage and use as a hook
 *  */ 

function App() {

  const { handleUpload, dummyRequest } = useFileUpload()
  const user = useAtomValue(userAtom)

  const openUserModal = () => {}

  return (
    <div className="App flex">
      <div className='flex w-full flex-col'>
        <header className='flex w-full justify-between bg-gray-200 p-10'>
          <Link to="/">
            <h1 className='text-4xl'>Quotes</h1>
          </Link>
          <div className='flex w-36 justify-between'>
            <Tooltip placement="bottom" title="Upload Snippets">
              <Upload beforeUpload={handleUpload} name='file' customRequest={dummyRequest} showUploadList={false}>
                <Button size='large' icon={<UploadOutlined />} className='flex items-center justify-center' />
              </Upload>
            </Tooltip>
            <Tooltip placement="bottom" title="Add Quote">
              <Button size='large' icon={<PlusOutlined />} className='flex items-center justify-center'/>
            </Tooltip>
            <Tooltip placement="bottom" title="Change User">
              <Link to="user">
                <Button size='large' icon={!user && <SmileOutlined />} className='flex items-center justify-center' onClick={openUserModal}>
                  {user && user.name[0].toUpperCase()}  
                </Button>
              </Link>
            </Tooltip>
          </div>
        </header>
        <Outlet />
      </div>
      {/* <NewBookModal open={isModalOpen} setOpen={setIsModalOpen} createAndSetBook={createAndSetBook} bookClue={currentSnippet?.source}/> */}
    </div>
  );
}

export default App;
