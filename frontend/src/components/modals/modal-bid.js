import React, { useState, useEffect,useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios';
import Querystring from "query-string";
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';

import { formatNum, getCurrencyInfoFromAddress } from "../../utils";
import {
    getTokenBalance,
    approveTokenOnMarket    
} from "../../utils/contracts";

import * as Element from "./style";
import ThemeContext from '../../context/ThemeContext';
import Button from '../Widgets/CustomButton';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalBid(props) {
    const { theme } = useContext(ThemeContext)
    const { account, active, library } = useActiveWeb3React();
    const { item, showPlaceBidModal, setShowPlaceBidModal } = props;

    const [currencyInfo, setCurrencyInfo] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (item && item.auctionInfo) {
            setCurrencyInfo(getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr));
        }
    }, [item])
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

    const [bidPrice, setBidPrice] = useState(0);
    const [biddingStatus, setBiddingStatus] = useState(false);
    function closePlaceBidModal() {
        setShowPlaceBidModal(false);
        setBidPrice(0);
    }

    async function placeBid() {
        if (bidPrice < item.auctionInfo.price) {
            toast.error("Your bid must be higher than minimum bid price!");
            return;
        }

        if ((item.auctionInfo.bids?.length > 0) && (bidPrice - item.auctionInfo.price * 1.05 <= 0)) {
            toast.error("Your bid must be 5% higher than current bid!");
            return;
        }

        if (balance - bidPrice < 0) {
            toast.error("Your available balance is less than the bid price!");
            return;
        }

        setBiddingStatus(true);

        // check out token allowance status;
        const approve_toast_id = toast.loading("Checking token approval...");
        const approvedStatus = await approveTokenOnMarket(currencyInfo.address, bidPrice, account, library);
        toast.dismiss(approve_toast_id);
        if (!approvedStatus) {
            toast.error("Approval failed!");
            setBiddingStatus(false);
            return;
        }

        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to bid on auction with this information: ${item.auctionInfo.auctionId}:${bidPrice}:${account}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setBiddingStatus(false);
            return;
        }

        // call bid_on_auction backend api 
        const api_toast_id = toast.loading("Bid on auction...");
        const { data } = await axios.post(`${process.env.REACT_APP_API}/market/bid_on_auction`,
            Querystring.stringify({
                auctionId: item.auctionInfo.auctionId,
                bidPrice: bidPrice,
                account: account,
                signature: signature
            }));

        toast.dismiss(api_toast_id);
        if (data.status) {
            // success
            setBiddingStatus(false);
            closePlaceBidModal();
            toast.success("Bid Success!");
            sleep(2000);
            window.location.reload();

        } else {
            setBiddingStatus(false);
            toast.error(data.message);
        }
    }

    return (
        <>
            {
                item && item.auctionInfo && account && active && currencyInfo &&
                <Modal
                    isOpen={showPlaceBidModal}
                    onRequestClose={() => closePlaceBidModal()}
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
                            <Element.ModalCloseIcon className={`text_color_1_${theme}`} size={32} onClick={() => closePlaceBidModal()} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className={`text_color_1_${theme}`}>Your Bid</Element.ModalTitle>
                        <Element.ModalRow>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>Current bid</Element.ModalLabel>
                            <Element.ModalPrice className={`text_color_1_${theme}`}>{formatNum(item.auctionInfo.price)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.BidPrice>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>Your bid</Element.ModalLabel>
                            <Element.ModalMainPrice className={`text_color_1_${theme} border_${theme}`} type={"number"} value={bidPrice} onChange={event => setBidPrice(event.target.value)} />
                            <Element.UnitContainer>
                                <Element.CoinImage src={currencyInfo.logoURI} />
                                <Element.Unit className={`text_color_1_${theme}`}>{currencyInfo.symbol}</Element.Unit>
                            </Element.UnitContainer>
                        </Element.BidPrice>
                        <Element.ModalRow>
                            <Element.ModalLabel className={`text_color_4_${theme}`}>Available</Element.ModalLabel>
                            <Element.ModalPrice className={`text_color_1_${theme}`}>{formatNum(balance)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalAction>

                            <Button
                                label = {
                                    biddingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Place a Bid"
                                }
                                onClick={() => placeBid()}
                                fillBtn roundFull w_full
                            />
                        </Element.ModalAction>
                    </Element.ModalBody>
                </Modal>
            }
        </>

    );
}

export default ModalBid;