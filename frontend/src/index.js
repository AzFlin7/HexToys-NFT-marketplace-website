import React from 'react';
import ReactDOM from 'react-dom';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { mainnet } from 'wagmi/chains'
import { pulsechain, NetworkParams } from './utils';
import { ThemeProvider } from "./context/ThemeContext";
import {Provider} from 'react-redux';
import {store} from "./store/store";

import App from './App';

import reportWebVitals from './reportWebVitals';
import { LoadingProvider } from "./context/useLoader";

const { provider, webSocketProvider } = configureChains(
  [pulsechain, mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: NetworkParams.rpcUrls[0]
      }),
    }),
  ],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <LoadingProvider>
        <WagmiConfig client={client}>
          <App />
        </WagmiConfig>
      </LoadingProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();