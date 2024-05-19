import React, { useState, useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios';
import Querystring from "query-string";
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';

import * as Element from "./style";
import Button from '../Widgets/CustomButton';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalDelist(props) {
    const { theme } = useContext(ThemeContext)
    const { account, library } = useActiveWeb3React();
    const { item, pairItem, setPairItem, showUnlistMarketPlace, setShowUnlistMarketPlace } = props;

    const [delistingStatus, setDelistingStatus] = useState(false);
    async function unlistItem() {
        setDelistingStatus(true);

        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to cancel pair with this information: ${pairItem.pairId}:${account}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setDelistingStatus(false);
            return;
        }

        // call delist_pair backend api 
        const api_toast_id = toast.loading("Delisting nft from market...");
        const { data } = await axios.post(`${process.env.REACT_APP_API}/market/delist_pair`,
            Querystring.stringify({
                pairId: pairItem.pairId,
                account: account,
                signature: signature
            }));

        toast.dismiss(api_toast_id);
        if (data.status) {
            // success
            setDelistingStatus(false);
            setShowUnlistMarketPlace(false);
            setPairItem(null);
            toast.success("Delist Success!");
            await sleep(2000);
            window.location.reload();

        } else {
            setDelistingStatus(false);
            toast.error(data.message);
        }
    }

    return (
        <>
            {
                account && item && pairItem &&
                <Modal
                    isOpen={showUnlistMarketPlace}
                    onRequestClose={() => {
                        setShowUnlistMarketPlace(false);
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
                            <Element.ModalCloseIcon  className = {`text_color_1_${theme}`} size={32} onClick={() => {
                                setShowUnlistMarketPlace(false);
                                setPairItem(null);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className = {`text_color_1_${theme}`}>
                            Unlist Item
                            <Element.PayAmount>
                                <Element.Price  className = {`text_color_3_${theme}`}>Are you sure you want to unlist this item ?</Element.Price>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => {
                                    setShowUnlistMarketPlace(false);
                                    setPairItem(null);
                                }}
                            />
                            <Button 
                                label = {
                                    delistingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Unlist"
                                }
                                fillBtn roundFull w_full
                                onClick={() => unlistItem()}
                            />
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalDelist;