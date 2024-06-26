import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NewQuote from 'components/NewQuote'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import App from './App'
import Quotes from './components/Quotes'
import Random from './components/Random'
import UserSelect from './components/UserSelect'
import './index.css'
import reportWebVitals from './reportWebVitals'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
})

// TODO redirect to User Select if no user selected
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='random/:seed?' element={<Random />} />
      <Route path='user' element={<UserSelect />} />
      <Route path='new' element={<NewQuote />} />
      {/* <Route path='staging' element={<Staging />} /> */}
      <Route path=':bookId?' element={<Quotes />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster />
  </QueryClientProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
