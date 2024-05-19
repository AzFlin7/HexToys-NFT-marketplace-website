import React, { useState, useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import { Input } from '@windmill/react-ui';
import ThemeContext from '../../context/ThemeContext';
import * as Element from "./style";
import Button from '../Widgets/CustomButton';

const ModalClaim = (props) => {
    const { account } = useActiveWeb3React();
    const { showClaimModal, setShowClaimModal, onRequestClaim, holding } = props;
    const [amount, setAmount] = useState(1)
    const [delivery, setDelivery] = useState("")
    const { theme } = useContext(ThemeContext)
    return (
        <>
            {
                account &&
                <Modal
                    isOpen={showClaimModal}
                    onRequestClose={() => {
                        setShowClaimModal(false);
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
                            <Element.ModalTitle className={`text_color_1_${theme}`}>
                                Request Claim
                            </Element.ModalTitle>
                            <Element.ModalCloseIcon  className={`text_color_1_${theme}`}size={32} onClick={() => {
                                setShowClaimModal(false);
                            }} />
                        </Element.ModalHeader>
                        <span  className={`text_color_4_${theme}`}>Balance : {holding}</span>
                        <Element.InputBody>
                            <Input
                                onChange={event => setAmount(parseInt(event.target.value))}
                                value={amount}
                                type='number'
                                min={0}
                                placeholder="Enter Amount to claim"
                                style={{ width: '100%', paddingLeft: '10px', paddingRight: '10px', lineHeight: '36px', borderRadius: '8px', }}
                                className={`border_${theme}`}
                            />
                        </Element.InputBody>
                        <Element.InputBody>
                            <Input
                                onChange={event => setDelivery(event.target.value)}
                                value={delivery}
                                type='text'
                                placeholder="Enter Delivery Address to claim"
                                style={{ width: '100%', marginTop: '10px', paddingLeft: '10px', paddingRight: '10px', lineHeight: '36px', borderRadius: '8px', }}
                                className={`border_${theme}`}
                            />
                        </Element.InputBody>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => {
                                    setShowClaimModal(false);
                                }}
                            />
                            <Button 
                                label = 'Claim'
                                fillBtn roundFull w_full
                                onClick={() => {
                                    if (amount >= 1 && amount <= holding && delivery.length > 0) onRequestClaim(amount, delivery)
                                }}
                            />
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalClaim;