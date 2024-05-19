/* eslint-disable array-callback-return */
import React, { useState, useEffect,useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';

import { formatNum, getCurrencyInfoFromAddress } from "../../utils";
import {
    getTokenBalance,
    buyNFT
} from "../../utils/contracts";

import * as Element from "./style";
import Button from '../Widgets/CustomButton';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalBuy(props) {
    const { theme } = useContext(ThemeContext)
    const { account, active, library } = useActiveWeb3React();
    const { item, pairItem, setPairItem, showBuyNowModal, setShowBuyNowModal } = props;

    const [currencyInfo, setCurrencyInfo] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (item && pairItem) {
            setCurrencyInfo(getCurrencyInfoFromAddress(pairItem.tokenAdr));
        }
    }, [item, pairItem])
    useEffect(() => {
        if (account && library && currencyInfo) {
            getTokenBalance(account, currencyInfo.address, library)
                .then((balance) => {
                    setBalance(balance)
                })
                .catch(() => {
                    setBalance(0)
                })
        }
        return () => {
            setBalance(0)
        }
    }, [account, library, active, currencyInfo])

   
    const [buyQuantity, setBuyQuantity] = useState('1');
    const [buyingStatus, setBuyingStatus] = useState(false);

    async function buyNFTItem() {        
        if (balance < pairItem.price) {
            setShowBuyNowModal(false);
            toast.error("Your available balance is less than the price!");
            return;
        }
        if (((buyQuantity < 1) && (item?.type === 'multi')) || buyQuantity > pairItem.balance) {
            toast.error("Please input quantity correctly!");
            return;
        }

        setBuyingStatus(true);
        // get signature from backend api
        const { data } = await axios.get(`${process.env.REACT_APP_API}/signature`, {
            params: {
                account: account,
                amount: buyQuantity,
                productId: pairItem.pairId,
                type: 'pair'
            }
        });

        if (data.status) {
            const load_toast_id = toast.loading("Buying nft...");
            let royalties = item.collectionInfo.royalties || [];
            let _royaltyArray = [];
            let _receiverArray = [];
            royalties.map((royalty, index) => {
                _royaltyArray.push(Math.floor(Number(royalty.percentage)*10));
                _receiverArray.push(royalty.address);
            })

            let nftType = 0;
            if (item.type === 'multi') {
                nftType = 1;
            }

            buyNFT(
                account, 
                item.itemCollection,
                item.tokenId,
                pairItem.pairId,
                buyQuantity,
                pairItem.price, 
                pairItem.tokenAdr, 
                pairItem.owner, 
                nftType, 
                _royaltyArray, 
                _receiverArray, 
                data.signature,
                library
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setBuyingStatus(false);
                    setShowBuyNowModal(false);
                    setPairItem(null);
                    toast.success("Buy Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();                    
                } else {
                    setBuyingStatus(false);
                    toast.error("Failed Transaction!");                    
                }
            });
        } else {
            setBuyingStatus(false);
            toast.error(data.message);
        }
    }

    return (
        <>
            {
                item && pairItem && account && active && currencyInfo &&                
                <Modal
                    isOpen={showBuyNowModal}
                    onRequestClose={() => {
                        setShowBuyNowModal(false);
                        setPairItem(null);
                    }}
                    ariaHideApp={false}
                    style={{
                        overlay: {
                            position: "fixed",
                            display: "flex",
                            justifyContent: "center",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0, .8)",
                            overflowY: "auto",
                            zIndex: 99,
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '95%',
                            maxWidth: '500px',
                            maxHeight: '600px',
                            borderRadius: '20px',
                            backgroundColor: theme === 'dark' ? '#060714' : '#fff',
                            borderColor: theme === 'dark' ? '#060714' : '#fff',
                            zIndex: 9999
                        },
                    }}
                >
                    <Element.ModalBody>
                        <Element.ModalHeader>
                            <Element.ModalCloseIcon size={32} onClick={() => {
                                setShowBuyNowModal(false);
                                setPairItem(null);
                            }} className={`text_color_1_${theme}`}/>
                        </Element.ModalHeader>
                        <Element.ModalTitle>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>Price : </Element.ModalLabel>
                            <Element.PayAmount>
                                <Element.CoinImage src={currencyInfo.logoURI} />
                                <Element.Price className={`text_color_1_${theme}`}>{formatNum(pairItem.price)}</Element.Price>
                                <Element.Unit className={`text_color_4_${theme}`}>{currencyInfo.symbol}</Element.Unit>
                                <Element.ModalLabel className={`text_color_4_${theme}`}>for each</Element.ModalLabel>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        {item.type === 'multi' &&
                            <Element.Field>
                                <Element.Label className={`text_color_4_${theme}`}>Enter quantity <span>({pairItem.balance} available)</span></Element.Label>
                                <Element.Input
                                    value={buyQuantity}
                                    type={"number"}
                                    onChange={(e) => { setBuyQuantity(Math.floor(e.target.value)) }}
                                    placeholder={"Enter quantity"} 
                                    className={`border_${theme}`}
                                />
                            </Element.Field>
                        }
                        <Element.ModalRow>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>Your balance</Element.ModalLabel>
                            <Element.ModalPrice className={`text_color_1_${theme}`}>{formatNum(balance)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalRow>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>You will pay</Element.ModalLabel>
                            <Element.ModalPrice className={`text_color_1_${theme}`}>{formatNum((pairItem.price * buyQuantity))} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel' 
                                greyColor roundFull w_full
                                onClick={() => {
                                setShowBuyNowModal(false);
                                setPairItem(null)
                            }}/>
                            <Button 
                                label = {
                                    buyingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                                fillBtn roundFull w_full
                                onClick={() => buyNFTItem()}
                            />
                            
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }            
        </>

    );
}

export default ModalBuy;