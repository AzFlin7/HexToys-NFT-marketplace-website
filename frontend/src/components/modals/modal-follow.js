import React, { useContext } from 'react';
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import ThemeContext from '../../context/ThemeContext';

import * as Element from "./style";
import Button from '../Widgets/CustomButton';
import { shorter } from '../../utils';

function ModalFollow(props) {
    const { account } = useActiveWeb3React();
    const { title, users, myFollowing, showModal, setShowModal, clickFollow } = props;
    const { theme } = useContext(ThemeContext)

    return (
        <>
            {
                account &&
                <Modal
                    isOpen={showModal}
                    onRequestClose={() => setShowModal(false)}
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
                            <Element.ModalCloseIcon className={`text_color_1_${theme}`} size={32} onClick={() => setShowModal(false)} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className={`text_color_1_${theme}`}>{title}</Element.ModalTitle>
                        {users.map((userItem, index) =>
                            <Element.FollowingElement>
                                <div className="img-container"
                                    onClick={() => window.open(`/profile/${userItem.address}`)}>
                                    <img src={userItem.lowLogo ? userItem.lowLogo : "/profile.png"} alt="" className="w-full" />
                                </div>

                                <div className="user-name">
                                    <h5 className={`text_color_1_${theme}`}>
                                        {
                                            userItem.name === 'NoName' ?
                                                !userItem.ensName || userItem.ensName === "" ? shorter(userItem.address) : userItem.ensName :
                                                userItem.name
                                        }
                                    </h5>
                                </div>
                                {
                                    account && userItem.address !== account.toLowerCase() &&
                                    <Button label={myFollowing.findIndex(followingUser => (followingUser.address === userItem.address)) > -1 ? "Unfollow" : "Follow"}
                                        size='sm'
                                        outlineBtnColor
                                        onClick={() => clickFollow(userItem.address)} />
                                }
                            </Element.FollowingElement>
                        )
                        }

                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalFollow;