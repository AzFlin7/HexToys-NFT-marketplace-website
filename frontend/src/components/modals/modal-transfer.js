import React, { useState,useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';
import {
    isAddress,
    sendNFT
} from "../../utils/contracts";
import * as Element from "./style";
import Button from '../Widgets/CustomButton';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalTransfer(props) {
    const { account, active, library } = useActiveWeb3React();
    const { item, holding, showSendNFTModal, setShowSendNFTModal } = props;
    const { theme } = useContext(ThemeContext)
    
    const [quantity, setQuantity] = useState('1');
    const [toAddress, setToAddress] = useState('');
    const [sendingStatus, setSendingStatus] = useState(false);

    async function transferNFT() {

        if (((quantity < 1) || (quantity > holding))) {
            toast.error("Please input quantity correctly!");
            return;
        }
        if (!toAddress) {
            toast.error("Please input receiver wallet address!");
            return;
        }
        if (!isAddress(toAddress)) {
            toast.error("Please input receiver address correctly!");
            return;
        }

        setSendingStatus(true);
        const load_toast_id = toast.loading("Please wait for sending nft...");
        sendNFT(
            item.itemCollection,
            item.type,
            account,
            toAddress,
            item.tokenId,
            quantity,
            library
        ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
                setSendingStatus(false);
                setShowSendNFTModal(false);
                toast.success("NFT was sent! Data will be synced after some block confirmation...");
                await sleep(2000);
                window.location.reload();
                return;
            } else {
                setSendingStatus(false);
                toast.error("Failed Transaction!");
                return;
            }
        });
    }

    return (
        <>
            {
                item && (holding > 0) && account && active &&
                <Modal
                    isOpen={showSendNFTModal}
                    onRequestClose={() => {
                        setShowSendNFTModal(false);
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
                            <Element.ModalCloseIcon className = {`text_color_1_${theme}`} size={32} onClick={() => {
                                setShowSendNFTModal(false);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className = {`text_color_1_${theme}`}>Transfer NFT</Element.ModalTitle>                        

                        <Element.Field>
                            <Element.Label className = {`text_color_4_${theme}`}>Transfer "{item.name}" to:</Element.Label>
                            <Element.Input
                                value={toAddress}
                                type={"text"}
                                onChange={(e) => { setToAddress(e.target.value) }}
                                placeholder={"e.g. 0x0BF373dBbEe2AC7Af7028Ae8027a090EACB9b596"} 
                                className = {`border_${theme}`}/>
                        </Element.Field>

                        {item.type === 'multi' &&
                            <Element.Field>
                                <Element.Label className = {`text_color_4_${theme}`}>Enter quantity <span>({holding} available)</span></Element.Label>
                                <Element.Input
                                    value={quantity}
                                    type={"number"}
                                    onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
                                    placeholder={"Enter quantity"} className = {`border_${theme}`}/>
                                     
                            </Element.Field>
                        }

                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => {setShowSendNFTModal(false)}}
                            />
                            <Button 
                                label = {
                                    sendingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                                fillBtn roundFull w_full
                                disabled={sendingStatus} 
                                onClick={() => transferNFT()}
                            />
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>

    );
}

export default ModalTransfer;