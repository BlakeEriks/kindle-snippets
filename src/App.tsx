import { PlusOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Tooltip, Select, Divider, Space, Pagination, Upload } from 'antd';
import { useEffect, useState } from 'react';
import useDeletedSnippets from './state/deletedSnippets';
import { Book, Quote, Snippet } from './types/types';
import FileDrop from './components/FileDrop';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import deletedSnippetsAtom from './state/deletedSnippets';
import { useAtom } from 'jotai';
import useQuotesApi from './api/quote';
import useModal from './state/modal';

/**
 * TODO
 * Create a quote without the source, so we can write one offs
 * Change primary key to id not created at, so we have an easier time deciding to put / post (also its a better convention)
 * { open, setModalContent } = useModal() (for the current user swapping)
 * Let's make a singular view for quotes to land on that you can randomize, and then another view for looking at many quotes + filtering them
 *  */ 

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allQuotes } = useQuotesApi()
  const { openModal } = useModal()

  const openUserModal = () => {
    // openModal(
    //   <div>
    //     Pick a user, bitch
    //   </div>,
    //   {
    //     title: "Pick one!!!!"
    //   }
    // )
  }

  return (
    <div className="App flex p-20">
      <div className='flex w-full flex-col'>
        <header className='flex w-full justify-between'>
          <h1 className='text-4xl'>Quoatz</h1>
          <div className='flex w-36 justify-between'>
            <Tooltip placement="bottom" title="Upload Snippets">
              <Upload>
                <Button size='large' icon={<UploadOutlined />} className='flex items-center justify-center' />
              </Upload>
            </Tooltip>
            <Tooltip placement="bottom" title="Add Quote">
              <Button size='large' icon={<PlusOutlined />} className='flex items-center justify-center'/>
            </Tooltip>
            <Tooltip placement="bottom" title="Change User">
              <Button size='large' icon={<SmileOutlined />} className='flex items-center justify-center' onClick={openUserModal}/>
            </Tooltip>
          </div>
        </header>
        {allQuotes.data?.slice(0,10).map((quote, index) => (
          <div className='my-3'>
            <div key={index} className={'border-l-2 border-black pl-4'}>
              <span className='italic font-light'>"{quote.content}"</span><span className='whitespace-nowrap'> - {quote.quotee}</span>
            </div>
          </div>
        ))}
      </div>
      {/* <NewBookModal open={isModalOpen} setOpen={setIsModalOpen} createAndSetBook={createAndSetBook} bookClue={currentSnippet?.source}/> */}
    </div>
  );
}

export default App;
