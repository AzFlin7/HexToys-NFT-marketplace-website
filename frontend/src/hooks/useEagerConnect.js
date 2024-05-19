/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { pulsechain } from "../utils";
import { connectorLocalStorageKey, getConnector } from "../utils/connectors";
import { useConnect, useNetwork, useSwitchNetwork, useAccount } from 'wagmi';

export function useEagerConnect() {    
    const { connect, error, isLoading } = useConnect();
    useEffect(() => {
        if (error && !isLoading) {
            // console.log('error:', error);
            window.localStorage.setItem(connectorLocalStorageKey, "");
        }
    }, [error, isLoading])

    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    const { switchNetwork } = useSwitchNetwork({
        onError(error) {
            // console.log('switchNetwork error :', error.message);
            // toast.error(error.message);
        },
        onSuccess(data) {
            // console.log('switchNetwork Success:');
        },
    })

    useEffect(() => {
        const connector = window.localStorage.getItem(connectorLocalStorageKey);
        if (connector && connector !== "") {
            const currentConnector = getConnector(connector);
            if (isConnected) {
                if (chain && (chain.id !== pulsechain.id)) {
                    // toast.error("Invalid network. Please switch to the network.");
                    switchNetwork?.(pulsechain.id);
                }
            } else {
                connect({ connector: currentConnector });
            }
        }
    }, [connect, chain, isConnected]) // intentionally only running on mount (make sure it's only mounted once :))
}
