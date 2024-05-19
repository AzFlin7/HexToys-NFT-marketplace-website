import React, { useState,useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import { Input } from '@windmill/react-ui';
import ThemeContext from '../../context/ThemeContext';
import * as Element from "./style";
import { useEffect } from 'react';
import { getSubscriptionFee } from '../../utils/contracts';
import { formatNum } from '../../utils';
import Button from '../Widgets/CustomButton';

const ModalSubscribe = (props) => {
    const { account, library } = useActiveWeb3React();
    const { showSubscribeModal, setShowSubscribeModal, onSubscribe, coinPrice } = props;
    const [period, setPeriod] = useState(1);
    const [fee, setFee] = useState(0)
    const { theme } = useContext(ThemeContext)
    
    useEffect(() => {
        if (account && library)
        getSubscriptionFee(library)
            .then((result) => {
                // console.log(result)
                setFee(result)
            })
            .catch(error => {
                setFee(0)
            })
    }, [account, library])
    return (
        <>
            {
                account &&
                <Modal
                    isOpen={showSubscribeModal}
                    onRequestClose={() => {
                        setShowSubscribeModal(false);
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
                            <Element.ModalTitle className = {`text_color_1_${theme}`}>
                                Subscribe Collection
                            </Element.ModalTitle>
                            <Element.ModalCloseIcon  className = {`text_color_1_${theme}`} size={32} onClick={() => {
                                setShowSubscribeModal(false);
                            }} />
                        </Element.ModalHeader>
                        <span className = {`text_color_4_${theme}`} style={{marginLeft: '10px'}}>{fee} PLS (${formatNum(fee * coinPrice || 0)})/ Month</span>
                        <Element.InputBody>
                            <Input
                                onChange={event => setPeriod(parseInt(event.target.value))}
                                value={period}
                                type='number'
                                min={0}
                                placeholder="Enter Subscribe Period"
                                style={{ width: '100%', paddingLeft: '10px', paddingRight: '10px', lineHeight: '36px', borderRadius: '8px', }}
                                className = {`border_${theme}`}
                            />
                            <span className = {`text_color_4_${theme}`} style={{ paddingLeft: '5px', paddingRight: '5px', alignSelf: 'center' }}>Months</span>
                        </Element.InputBody>
                        <span style={{marginLeft: '10px'}}>Total : {fee * period} PLS (${formatNum(fee * period * coinPrice || 0)})</span>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => {setShowSubscribeModal(false)}}
                            />
                            <Button 
                                label = 'Subscribe'
                                fillBtn roundFull w_full
                                onClick={() => {
                                    if (period >= 1) onSubscribe(period)
                                }}
                            />
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalSubscribe;