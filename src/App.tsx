import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import userAtom from './state/user';
import { useEffect } from 'react';

/**
 * TODO
 * Create a quote without the source, so we can write one offs
 * Let's make a singular view for quotes to land on that you can randomize, and then another view for looking at many quotes + filtering them
 * Move the source map into local storage and use as a hook
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
    <div className="App flex w-full flex-col items-center">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
