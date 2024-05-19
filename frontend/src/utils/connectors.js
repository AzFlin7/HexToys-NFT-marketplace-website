import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector  } from '@wagmi/core/connectors/walletConnect';
import { pulsechain } from "./index";
import { mainnet } from 'wagmi/chains'
import Metamask from "../icons/Metamask";
import WalletConnect from "../icons/WalletConnect";

export const injectedConnector = new InjectedConnector({ 
  chains: [pulsechain, mainnet],
  options: {
    shimDisconnect: false,
  }, 
});

export const walletconnect = new WalletConnectConnector({
  chains: [pulsechain, mainnet],
  options: {
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECTID,
    isNewChainsStale: false,
  },
})

export function getConnector(connectorId) {
  switch (connectorId) {
    case "injectedConnector":
      return injectedConnector;
    case "walletconnect":
      return walletconnect;
    default:
      return injectedConnector;
  }
}

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: injectedConnector,
    key: "injectedConnector",
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: walletconnect,
    key: "walletconnect",
  },
]

export const connectorLocalStorageKey = "connectorId";