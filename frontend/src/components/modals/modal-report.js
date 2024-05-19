import React, { useState,useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import { Textarea } from '@windmill/react-ui';
import ThemeContext from '../../context/ThemeContext';
import * as Element from "./style";
import Button from '../Widgets/CustomButton';

const ModalReport = (props) => {
    const { account } = useActiveWeb3React();
    const { showReportModal, setShowReportModal, onReport } = props;
    const [content, setContent] = useState('');
    // const limit = 100;
    const { theme } = useContext(ThemeContext)
    
    return (
        <>
            {
                account &&
                <Modal
                    isOpen={showReportModal}
                    onRequestClose={() => {
                        setShowReportModal(false);
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
                                Report Collection
                            </Element.ModalTitle>
                            <Element.ModalCloseIcon  className = {`text_color_1_${theme}`}size={32} onClick={() => {
                                setShowReportModal(false);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalBody>
                            <Textarea
                                rows="3"
                                onChange={event => setContent(event.target.value.slice(0, 250))}
                                value={content}
                                placeholder="Enter content"
                                style={{ width: '100%', borderRadius: '8px', paddingLeft: '10px', paddingRight: '10px' }}
                                className = {`border_${theme}`}
                            />
                            <p style={{ textAlign: 'right' }}>
                                {content ? content.length : 0}/ {250}
                            </p>
                        </Element.ModalBody>
                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => {setShowReportModal(false)}}
                            />
                            <Button 
                                label = 'Report'
                                fillBtn roundFull w_full
                                onClick={() => {
                                    if (content && content.length) onReport(content)
                                }}
                            />
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalReport;