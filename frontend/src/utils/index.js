import { Contract } from '@ethersproject/contracts';
import { ethers } from "ethers";

import TokenABI from '../contracts/Token.json';
import SingleNFTABI from '../contracts/SingleNFT.json';
import MultipleNFTABI from '../contracts/MultipleNFT.json';
import NFTFactoryABI from '../contracts/NFTFactory.json';

import AddNFTCollectionABI from '../contracts/AddNFTCollection.json';

import DropERC1155ABI from '../contracts/DropERC1155.json';

import HexToysMarketV2ABI from '../contracts/HexToysMarketV2.json';

import MysteryBoxABI from '../contracts/MysteryBox.json';
import MysteryBoxFactoryABI from '../contracts/MysteryBoxFactory.json';

import SingleNFTStakingFactoryABI from '../contracts/SingleNFTStakingFactory.json';
import MultiNFTStakingFactoryABI from '../contracts/MultiNFTStakingFactory.json';
import MultiNFTStakingABI from '../contracts/MultiNFTStaking.json';
import SingleNFTStakingABI from '../contracts/SingleNFTStaking.json';

import SubscriptionABI from '../contracts/Subscription.json';
import ClaimABI from '../contracts/Claim.json';

export const pulsechain = {
  id: 369,
  network: 'pulsechain',
  name: 'PulseChain',
  nativeCurrency: { name: 'Pulse', symbol: 'PLS', decimals: 18 },
  testnet: false,
  rpcUrls: {
    default: {
      http: ['https://rpc.pulsechain.com'],
      webSocket: ['wss://ws.pulsechain.com'],
    },
    public: {
      http: ['https://rpc.pulsechain.com'],
      webSocket: ['wss://ws.pulsechain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PulseScan',
      url: 'https://scan.pulsechain.com',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
}

export const NetworkParams = {
  chainId: 369,
  chainName: 'PulseChain',
  nativeCurrency: {
    name: 'PulseChain',
    symbol: 'PLS',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.pulsechain.com'],
  blockExplorerUrls: ['https://scan.pulsechain.com']
}

export const CONTRACTS_BY_NETWORK = {
  DropERC1155: {
    address: "0xa35a6162eaecddcf571aeaa8edca8d67d815cee4",
    abi: DropERC1155ABI,
    tokenId: '15'
  },
  AddNFTCollection: {
    address: "0x8475f436f4331e1ae6f14bb305f8e7fa8ec764e3",
    abi: AddNFTCollectionABI,
  },
  NFTFactory: {
    address: "0xb8c7d9b99aeab335316803fae5fe3a0dbaca5dfe",
    abi: NFTFactoryABI,
  },
  HexToysMarketV2: {
    address: "0xc16d32ecf660290c9351a9c878d0d482235be233",
    abi: HexToysMarketV2ABI
  },
  MysteryBoxFactory: {
    address: "0xa89cd95a9ec5955558277244b60d223fd9291789",
    abi: MysteryBoxFactoryABI,
  },
  SingleNFTStakingFactory: {
    address: "0x87c6609855012c66c1cebae466fd7a383b09204c",
    abi: SingleNFTStakingFactoryABI,
  },
  MultiNFTStakingFactory: {
    address: "0x367db852ca41b4428d4b840608e2a5acb3e137e3",
    abi: MultiNFTStakingFactoryABI,
  },
  Subscription: {
    address: '0xafe5b80d3bbb58927a9acd2973bf59e96f8416bc',
    abi: SubscriptionABI,
  },
  Claim: {
    address: '0x888E954cecf07EFE249124A4f0434040001f4F1a',
    abi: ClaimABI
  }
}

export const Tokens = [
  {
    name: "PulseChain",
    symbol: "PLS",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
  },
  {
    name: "Wrapped Pulse",
    symbol: "WPLS",
    address: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png"
  },
  {
    name: "Dai Stablecoin from Ethereum",
    symbol: "DAI",
    address: "0xefd766ccb38eaf1dfd701853bfce31359239f305",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xefD766cCb38EaF1dfd701853BFCe31359239F305.png"
  },
  {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png"
  },
  {
    name: "PulseX",
    symbol: "PLSX",
    address: "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x95B303987A60C71504D99Aa1b13B4DA07b0790ab.png"
  },
  {
    name: "USD Coin from Ethereum",
    symbol: "USDC",
    address: "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
    decimals: 6,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07.png"
  },
  {
    name: "HEX",
    symbol: "HEX",
    address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
    decimals: 8,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39.png"
  },
  {
    name: "Wrapped Ether from Ethereum",
    symbol: "WETH",
    address: "0x02dcdd04e3f455d838cd1249292c58f3b79e3c3c",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C.png"
  },
  {
    name: "Incentive",
    symbol: "INC",
    address: "0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d.png"
  },
  {
    name: "Tether USD from Ethereum",
    symbol: "USDT",
    address: "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
    decimals: 6,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f.png"
  },
]


// get factory, single/multiple filxed, auction contract and info
export function getContractInfo(name) {
  return CONTRACTS_BY_NETWORK?.[name];
}
export function getContractObj(name, provider) {
  var newProvider;
  if (!!provider) {
    newProvider = provider;
  } else {
    newProvider = new ethers.providers.JsonRpcProvider(NetworkParams.rpcUrls[0]);;
  }

  const info = getContractInfo(name);
  return !!info && new Contract(info.address, info.abi, newProvider);
}


// get token contract
export function getTokenContract(address, provider) {
  if (!!provider) {
    return new Contract(address, TokenABI, provider);
  } else {
    const rpcProvider = new ethers.providers.JsonRpcProvider(NetworkParams.rpcUrls[0]);
    return new Contract(address, TokenABI, rpcProvider);
  }
}

// get single/multiple collection contract
export function getCollectionContract(type, address, provider) {
  var newProvider;
  if (!!provider) {
    newProvider = provider;
  } else {
    newProvider = new ethers.providers.JsonRpcProvider(NetworkParams.rpcUrls[0]);
  }
  if (type === 'single') {
    return new Contract(address, SingleNFTABI, newProvider);
  } else if (type === 'multi') {
    return new Contract(address, MultipleNFTABI, newProvider);
  }
  return new Contract(address, SingleNFTABI, newProvider);
}

// get mysterybox contract
export function getMysteryBoxContract(address, provider) {
  var newProvider;
  if (!!provider) {
    newProvider = provider;
  } else {
    newProvider = new ethers.providers.JsonRpcProvider(NetworkParams.rpcUrls[0]);
  }
  return new Contract(address, MysteryBoxABI, newProvider);
}

// get single/multiple staking contract
export function getStakingContract(type, address, provider) {
  var newProvider;
  if (!!provider) {
    newProvider = provider;
  } else {
    newProvider = new ethers.providers.JsonRpcProvider(NetworkParams.rpcUrls[0]);
  }
  if (type === 'single') {
    return new Contract(address, SingleNFTStakingABI, newProvider);
  } else if (type === 'multi') {
    return new Contract(address, MultiNFTStakingABI, newProvider);
  }
  return new Contract(address, SingleNFTStakingABI, newProvider);
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export async function registerToken(tokenAddress, tokenSymbol, tokenDecimals) {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
      },
    },
  })
  return tokenAdded
}


// get payment curreny information
export function getCurrencyInfoFromAddress(address) {
  let filtered = Tokens.filter(token => token.address.toLowerCase() === address.toLowerCase())
  if (filtered && filtered.length > 0) {
    return filtered[0];
  } else {
    return null;
  }  
}
export function getCurrencyInfoFromSymbol(symbol) {

  let filtered = Tokens.filter(token => token.symbol.toLowerCase() === symbol.toLowerCase())
  if (filtered && filtered.length > 0) {
    return filtered[0];
  } else {
    return null;
  } 
}

export function numberToString(n1) {
  if (n1) {
    // const cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    const cn1 = n1.toLocaleString('en-US');
    return cn1;
  } else {
    return '';
  }
}


export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value) {
  let intValue = Math.floor(value);
  if (intValue < 10) {
    return '' + parseFloat(value).toPrecision(2);
  } else if (intValue < 1000) {
    return '' + intValue;
  } else if (intValue < 1000000) {
    return parseFloat(intValue / 1000).toFixed(1) + 'K';
  } else if (intValue < 1000000000) {
    return parseFloat(intValue / 1000000).toFixed(1) + 'M';
  } else {
    return parseFloat(intValue / 1000000000).toFixed(1) + 'B';
  }
}

export const putCommas = (value) => {
  try {
    if (!value) return value
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (err) {
    return value
  }
}