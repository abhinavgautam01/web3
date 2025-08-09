import { http, createConfig, injected } from "wagmi";
import { mainnet } from "wagmi/chains";

export const config = createConfig({
  connectors: [injected()],
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      "https://eth-mainnet.g.alchemy.com/v2/Jdx7kejFF8h5mR4WqH0Ji"
    ),
  },
});
