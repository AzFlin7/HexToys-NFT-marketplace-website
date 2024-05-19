/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { useActiveWeb3React } from "../../hooks";
import { useParams } from "react-router-dom";
import { Image } from "antd";
import axios from 'axios';
import toast from "react-hot-toast";
import ReadMoreReact from "read-more-react";
import { PlusCircleOutlined } from "@ant-design/icons";
import CircularProgress from '@material-ui/core/CircularProgress';
import Masonry from 'react-masonry-css';

import * as Element from "./styles";
import CardNode from "../../components/Cards/CardNode";
import { getTokenBalance, spin } from "../../utils/contracts";
import { formatNum, getCurrencyInfoFromAddress } from "../../utils";
import unknownImg from "../../assets/images/unknown.jpg";
import loadingVideo from "../../assets/images/HEX_TOYS_Hypercube_Floating_Loop2.mp4";
import ThemeContext from '../../context/ThemeContext';
import ModalAddCard from "../../components/modals/modal-add-card";
import Header from '../header/header';
import Footer from '../footer/footer';
import Button from "../../components/Widgets/CustomButton";

function MysteryBoxDetail(props) {
    let { address } = useParams();
    const history = useHistory();
    const { theme } = useContext(ThemeContext)
    const breakpoint = {
        default: 4,
        1840: 4,
        1440: 4,
        1280: 3,
        1080: 2,
        768: 2,
        450: 1,
    };
    const [mysteryBoxInfo, setMysteryBoxInfo] = useState(null);
    useEffect(() => {
        if (address) {
            // console.log('get info');
            axios.get(`${process.env.REACT_APP_API}/mysterybox/detail?address=${address}`)
                .then((res) => {
                    if (res.data.status) {
                        setMysteryBoxInfo(res.data.mysterybox);
                    }
                })
        }
    }, [address])

    const { account, active, library } = useActiveWeb3React();
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (account && library && mysteryBoxInfo) {
            getTokenBalance(account, mysteryBoxInfo.tokenAddress, library)
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
    }, [account, library, active, mysteryBoxInfo])

    const [cards, setCards] = useState([])
    const [giftCard, setGiftCard] = useState([])
    const [giftGotStatus, setGiftGotStatus] = useState(false)
    const [page, setPage] = useState(1)
    const [noCards, setNoCards] = useState(false)
    const [initialCardsLoaded, setInitialCardsLoaded] = useState(false)
    const [cardLoading, setCardLoading] = useState(false)
    useEffect(() => {
        setCards([])
        setNoCards(false)
        setInitialCardsLoaded(false)
        setCardLoading(true)
        setPage(1)
        fetchCards(true)
    }, [address])
    useEffect(() => {
        setCardLoading(true)
        if (initialCardsLoaded) {
            fetchCards(false);
        }
    }, [page])
    function fetchCards(reset) {
        let query = `${process.env.REACT_APP_API}/cards?mysteryboxAddress=${address}&sortBy=amount`
        let queryUrl = `${query}&page=${reset ? 1 : page}`
        axios.get(queryUrl)
            .then(res => {
                setCardLoading(false);
                if (res.data.status) {
                    if (res.data.cards.length === 0) setNoCards(true)
                    // setGiftCard(res.data.cards[0])
                    // setGiftGotStatus(true)
                    // setUnlocking(true)
                    if (reset) {
                        setCards(res.data.cards)
                        setInitialCardsLoaded(true)
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(cards))
                        prevArray.push(...res.data.cards)
                        setCards(prevArray)
                    }
                }
            })
            .catch(err => {
                setCardLoading(false)
                if (err.response.data.message === 'No cards found') {
                    setNoCards(true)
                }
            })
    }

    function loadMore() {
        if (!cardLoading) {
            setPage(page => { return (page + 1) })
        }
    }

    const [unlocking, setUnlocking] = useState(false);
    const unlockMysteryBox = async () => {
        if (unlocking) {
            return
        }
        if (!mysteryBoxInfo) {
            return
        }

        if (balance < mysteryBoxInfo.price) {
            toast.error("Insufficient funds!");
            return
        }

        setUnlocking(true);
        spin(
            account,
            address,
            mysteryBoxInfo.tokenAddress,
            library
        ).then((key) => {
            if (key) {
                axios.get(`${process.env.REACT_APP_API}/card/detail?key=${key}`)
                    .then(res => {
                        if (res.data.status) {
                            if (res.data.card) {
                                setGiftCard(res.data.card);
                                setGiftGotStatus(true);
                            } else {
                                toast.error("Can not catch nft card from the server!");
                                setUnlocking(false);
                            }
                        } else {
                            toast.error("Can not catch nft card from the server!");
                            setUnlocking(false);
                        }
                    })
                    .catch(err => {
                        toast.error("Can not catch nft card from the server!");
                        setUnlocking(false);
                    })
            } else {
                toast.error("Failed Transaction");
                setUnlocking(false);
            }
        });

    };
    const [searchTxt, setSearchTxt] = useState("");
    const [searchKey, setSearchKey] = useState('');
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchKey(searchTxt);
        }
    }

    const [showAddCardModal, setShowAddCardModal] = useState(false);

    return (
        <div>
            <Header {...props} />
            {
                mysteryBoxInfo &&
                <Element.Container>

                    <div className="mysterybox-header">

                    </div>
                    <div className="mysterybox-header-user-context">
                        <Image
                            preview={false}
                            src={mysteryBoxInfo.image ? mysteryBoxInfo.image : "/white-background.png"}
                        />
                        <div className="mysterybox-content-box">
                            <div className={`mysterybox-content ${theme}`}>
                                <h1 className={`text_color_1_${theme}`}>{mysteryBoxInfo.name}</h1>
                                <ReadMoreReact
                                    text={`${mysteryBoxInfo.description}`}
                                    min={1}
                                    ideal={50}
                                    max={100}
                                    readMoreText="Read more"
                                />
                                <>
                                    <div className={`price-content border_${theme}`}>
                                        <div className={`price-sub-content border_${theme}`}>
                                            <h2 className={`inline-block text_color_1_${theme}`}>
                                                {formatNum(mysteryBoxInfo.price)} {getCurrencyInfoFromAddress(mysteryBoxInfo.tokenAddress).symbol}
                                            </h2>
                                            <p className={`price-detail  text_color_3_${theme}`}>Unlock Price</p>
                                        </div>
                                        <div className="price-middle-content">
                                            <div className={theme}></div>
                                        </div>
                                        {
                                            account && active && library &&
                                            <div className="price-sub-content">
                                                <h2 className={`inline-block text_color_1_${theme}`}>
                                                    {formatNum(balance)} {getCurrencyInfoFromAddress(mysteryBoxInfo.tokenAddress).symbol}
                                                </h2>
                                                <p className={`price-detail text_color_3_${theme}`}>Your Balance</p>
                                            </div>
                                        }
                                    </div>
                                    {
                                        account && active && library &&
                                        <div className="action-container">
                                            <Button
                                                label={
                                                    unlocking ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                                                        :
                                                        <> Unlock Hypercubes </>
                                                }
                                                onClick={unlockMysteryBox}
                                                fillBtn roundFull w_full
                                            />

                                        </div>
                                    }
                                </>

                            </div>
                            {
                                account && account.toLowerCase() === mysteryBoxInfo.owner.toLowerCase() &&
                                <div className="user-setting-container" onClick={() => setShowAddCardModal(true)}>
                                    <div className="user-setting">
                                        <PlusCircleOutlined />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="search_div">
                        <button><i className="fas fa-search"></i></button>
                        <input type='text' placeholder="Search Hypercubes" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} className={`bg_${theme} text_color_1_${theme}`} onKeyPress={handleKeyPress} />
                    </div>

                    <div className="cards-content">
                        <Masonry
                            breakpointCols={breakpoint}
                            className={'masonry'}
                            columnClassName={'gridColumn'}
                        >
                            {
                                cards.map((card, index) => (
                                    <CardNode {...props} card={card} key={index} totalSupply={mysteryBoxInfo.cardAmount} />
                                ))
                            }
                        </Masonry>
                        <div className="load-more" style={{ display: noCards ? "none" : "" }}>
                            <Button
                                label={cardLoading ? "Loading..." : "Load more"}
                                onClick={() => loadMore()}
                                fillBtn
                            />
                        </div>
                    </div>

                    {
                        account && account.toLowerCase() === mysteryBoxInfo.owner.toLowerCase() &&
                        <ModalAddCard
                            showAddCardModal={showAddCardModal}
                            setShowAddCardModal={setShowAddCardModal}
                            mysteryboxAddress={address}
                        />
                    }
                    <div className="ant-modal-root" style={{ display: unlocking ? '' : 'none' }}>
                        <div className="ant-modal-mask" style={{ background: 'rgba(0, 0, 0, 0.9)' }}></div>
                        <div tabIndex="-1" className="ant-modal-wrap" role="dialog">
                            <div className='ant_container' >
                                <div className="ant_modal_content" style={{ display: giftGotStatus ? 'none' : '' }}>
                                    <h2 className={`title text_color_gradient_${theme}`}>Opening Hypercubes</h2>
                                    <div >
                                        <div className="video_div">
                                            <video src={loadingVideo} autoPlay muted loop playsInline controls={false} allowFullScreen={false} />
                                            {/* <img src="/processing_unlock.gif"
                                                style={{ maxWidth: '100%', borderRadius: '10px' }} alt="img" /> */}
                                        </div>
                                    </div>
                                    <p style={{ color: 'white' }}>Please wait it will take several seconds</p>
                                </div>
                                {
                                    giftGotStatus && giftCard &&
                                    <div>
                                        <h2 style={{ color: 'yellow', fontWeight: '700' }}>CONGRATULATIONS!</h2>
                                        <p style={{ color: 'white' }}>You won
                                            {
                                                giftCard.itemInfo && giftCard.itemInfo.name &&
                                                <span style={{ color: 'lightgreen', paddingLeft: '5px' }}>{giftCard.itemInfo.name}</span>
                                            }

                                        </p>
                                        <div>
                                            <div>
                                                {
                                                    giftCard.itemInfo &&
                                                    <img src={giftCard.itemInfo.image ? giftCard.itemInfo.image : unknownImg}
                                                        style={{ maxWidth: '100%', borderRadius: '10px' }} alt="img" />
                                                }

                                            </div>
                                        </div>
                                        <div onClick={() => history.push(`/detail/${giftCard.collectionId}/${giftCard.tokenId}`)}
                                            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                            <div style={{ padding: '5px 15px', color: 'white', background: 'var(--buttonColor)', width: 'fit-content', borderRadius: '10px', cursor: 'pointer' }}>
                                                View NFT Detail
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                                            <div onClick={() => window.location.reload()}
                                                style={{ padding: '5px 15px', color: 'white', background: 'var(--buttonColor)', width: 'fit-content', borderRadius: '10px', cursor: 'pointer' }}>
                                                Back
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </Element.Container>
            }

            <Footer />
        </div>

    )
}

export default MysteryBoxDetail
