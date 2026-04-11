import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './lib/context/authContext';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // optional: customize as needed
    },
  },
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider  client={queryClient}>
    <AuthProvider>
          <App />
    </AuthProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

