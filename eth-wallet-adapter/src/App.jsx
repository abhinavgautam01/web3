import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccount, useBalance, useConnect, useSendTransaction, WagmiProvider } from "wagmi";
import { config } from "./config";

const queryClient = new QueryClient();


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector />
        <EthSend />
        <ShowAddressAndBalance />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function ShowAddressAndBalance() {
  const { address } = useAccount()
  const balance = useBalance({address})

  return (
    <div>
      Address: {address}<br/>
      Balance: {balance?.data?.formatted}ETH
    </div>
  )
}

function WalletConnector() {
  const { connectors, connect } = useConnect()
  return connectors.map((connector)=>(
    <button key={connector.uid} onClick={()=>connect({connector})}>{connector.name}</button>
  ))
}

function EthSend() {
  const { sendTransaction } = useSendTransaction()

  function sendEth(){
    sendTransaction({
      to: document.getElementById("address").value, 
      value: "100000000000000000" // 17 0's => 0.1ETH
    })
  }

  return (
    <div>
      <input id="address" type="text" placeholder="Address.."></input>
      <button onClick={sendEth}>Send 0.1 ETH</button>
      {/* {hash && <div>{hash}</div>} */}
    </div>
  )
}

export default App;
