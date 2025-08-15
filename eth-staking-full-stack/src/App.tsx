import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { config } from './config'
import { WagmiProvider } from 'wagmi'
import Appbar from './Appbar'
import Dashboard from './Dashboard'

const queryClient = new QueryClient()

function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Appbar />
        <Dashboard />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
