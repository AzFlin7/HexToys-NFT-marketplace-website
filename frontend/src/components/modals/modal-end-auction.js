/* eslint-disable array-callback-return */
import React, { useState, useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios';
import Querystring from "query-string";
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';

import { finalizeAuction } from "../../utils/contracts";

import * as Element from "./style";
import ThemeContext from '../../context/ThemeContext';
import Button from '../Widgets/CustomButton';
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalEndAuction(props) {
    const { theme } = useContext(ThemeContext)
    const { account, library } = useActiveWeb3React();
    const { item, showEndAuction, setShowEndAuction } = props;

    const [endingAuctionStatus, setEndingAuctionStatus] = useState(false);
    async function endAuction() {
        setEndingAuctionStatus(true);

        if (item.auctionInfo.bids && item.auctionInfo.bids.length > 0) {
            // finalize auction

            // get signature from backend api
            const { data } = await axios.get(`${process.env.REACT_APP_API}/signature`, {
                params: {
                    account: account,
                    amount: 1,
                    productId: item.auctionInfo.auctionId,
                    type: 'auction'
                }
            });

            if (data.status) {
                const load_toast_id = toast.loading("Finalizing  Auction...");
                let royalties = item.collectionInfo.royalties || [];
                let _royaltyArray = [];
                let _receiverArray = [];
                royalties.map((royalty, index) => {
                    _royaltyArray.push(Math.floor(Number(royalty.percentage)*10));
                    _receiverArray.push(royalty.address);
                })

                finalizeAuction(
                    item.itemCollection,
                    item.tokenId,
                    item.auctionInfo.auctionId,
                    item.auctionInfo.bids[0].bidPrice,
                    item.auctionInfo.bids[0].tokenAdr,
                    item.auctionInfo.owner,
                    item.auctionInfo.bids[0].from,
                    _royaltyArray,
                    _receiverArray,
                    data.signature,
                    library
                ).then(async (result) => {
                    toast.dismiss(load_toast_id);
                    if (result) {
                        setEndingAuctionStatus(false);
                        setShowEndAuction(false);
                        toast.success("Auction Finalized! Data will be synced after some block confirmation...");
                        await sleep(2000);
                        window.location.reload();
                        return;
                    } else {
                        setEndingAuctionStatus(false);
                        toast.error("Failed Transaction!");
                        return;
                    }
                });
            } else {
                setEndingAuctionStatus(false);
                toast.error(data.message);
            }

        } else {
            // cancel auction

            // generate signature       
            const sign_toast_id = toast.loading("Signing...");
            const signature = await library.signMessage(
                `I want to cancel auction with this information: ${item.auctionInfo.auctionId}:${account}`
            );
            toast.dismiss(sign_toast_id);
            if (!signature) {
                toast.error("Signing failed!");
                setEndingAuctionStatus(false);
                return;
            }

            // call cancel_auction backend api 
            const api_toast_id = toast.loading("Canceling the auction...");
            const { data } = await axios.post(`${process.env.REACT_APP_API}/market/cancel_auction`,
                Querystring.stringify({
                    auctionId: item.auctionInfo.auctionId,
                    account: account,
                    signature: signature
                }));

            toast.dismiss(api_toast_id);
            if (data.status) {
                // success
                setEndingAuctionStatus(false);
                setShowEndAuction(false);
                toast.success("Auction Canceled!");
                await sleep(2000);
                window.location.reload();

            } else {
                setEndingAuctionStatus(false);
                toast.error(data.message);
            }
        }
    }
    return (
        <>
            {
                item && item.auctionInfo && account &&
                <Modal
                    isOpen={showEndAuction}
                    onRequestClose={() => setShowEndAuction(false)}
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
                            <Element.ModalCloseIcon  className = {`text_color_1_${theme}`} size={32} onClick={() => setShowEndAuction(false)} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className = {`text_color_1_${theme}`}>
                            End Auction
                            <Element.PayAmount>
                                <Element.Price className = {`text_color_4_${theme}`}>Are you sure you want to end this auction ?</Element.Price>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => setShowEndAuction(false)}
                            />
                            <Button 
                                label = {
                                    endingAuctionStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "End Auction"
                                }
                                fillBtn roundFull w_full
                                onClick={() => endAuction()}
                            />
                            
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalEndAuction;