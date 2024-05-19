import { useConnect, useAccount, useNetwork, useDisconnect, useSigner, useEnsName } from 'wagmi';
import { pulsechain } from '../utils';

export function useActiveWeb3React() {
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const { data: library, error } = useSigner();
    // console.log(address)
    if (address && isConnected && chain && (chain.id === pulsechain.id)) {
        return {
            activate: connect,
            deactivate: disconnect,
            account: address,
            chainId: chain.id,
            active: true,
            library: library,
            error: error
        }
    } else {
        return {
            activate: connect,
            deactivate: disconnect,
            account: null,
            chainId: null,
            active: false,
            library: null,
            error: null
        }
    }    
}