import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address } = useAccount();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  if (address) {
    return (
      <div>
        You are connected: {address}
        <button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          id={connector.uid}
          onClick={() => {
            connect({ connector: connector });
          }}
        >
          Connect via {connector.name}
        </button>
      ))}
    </div>
  );
}
