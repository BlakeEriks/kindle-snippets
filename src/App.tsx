import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import userAtom from './state/user';
import { useEffect } from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

/**
 * TODO
 * Clear form on save one off quote
 * Let's make a singular view for quotes to land on that you can randomize, or go to via /quotes/quote
 * Save uploads to reclick on later
 * Daily email feature
 *  */ 

function App() {

  const navigate = useNavigate()
  const user = useAtomValue(userAtom)

  useEffect(() => {
    if (!user) {
      navigate('/user')
    }
  }, [user, navigate])

  return (
    <Layout className='h-screen'>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default App;
