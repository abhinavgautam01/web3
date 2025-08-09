import { WagmiProvider } from "wagmi";
import "./App.css";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectWallet from "./components/ConnectWallet";
import TotalSupply from "./components/TotalSupply";
import Balance from "./components/Balance";
import AllowUSDT from "./components/AllowUSDT";

const client = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ConnectWallet/>
        <Balance />
        <TotalSupply />
        <AllowUSDT />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
