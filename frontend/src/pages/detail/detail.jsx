import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios';
import Querystring from 'query-string';
import { format } from "date-fns";
import { useLoader } from '../../context/useLoader'
import './detail.scss';
import { shorter, formatNum, getCurrencyInfoFromAddress, NetworkParams } from "../../utils";

import { Heart } from "@styled-icons/feather/Heart";
import { Heart as HeartFill } from "@styled-icons/fa-solid/Heart";
import { Helmet } from "react-helmet";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from '../header/header';
import Footer from '../footer/footer';
import ThemeContext from '../../context/ThemeContext';

import unknownImg from "../../assets/images/unknown.jpg";
import reloadBtn from "../../assets/images/icons/reload-btn.svg";
import shareLink from "../../assets/images/icons/share-link.svg";
import externalLink from "../../assets/images/icons/external-link.svg";
import menuIcn from "../../assets/images/icons/menu-icn.svg";
import heart from "../../assets/images/icons/icon_heart.svg";
import share from "../../assets/images/icons/icon_share.svg";

import heart_black from "../../assets/images/icons/icon_heart_black.svg";
import share_black from "../../assets/images/icons/icon_share_black.svg";


import ModalTransfer from "../../components/modals/modal-transfer";
import ModalList from "../../components/modals/modal-list";
import ModalDelist from "../../components/modals/modal-delist";
import ModalBuy from "../../components/modals/modal-buy";
import ModalBid from "../../components/modals/modal-bid";
import ModalEndAuction from "../../components/modals/modal-end-auction";
import MyChart from '../../components/MyChart';

import Button from '../../components/Widgets/CustomButton';
import MoreCollectionCard from '../../components/Cards/MoreCollectionCard';
import ItemCard from '../../components/Cards/ItemCard';
import toast from 'react-hot-toast';
import { approveNFTOnClaim } from '../../utils/contracts';
import ModalClaim from '../../components/modals/modal-claim';
import loadingImage from '../../assets/images/hextoysloading.gif';
import incIcon from '../../assets/images/icons/INC.svg';
import HolderItem from './HolderItem';
import EventItem from './EventItem';
import { Link } from "react-router-dom";
import ShareMenu from "../../components/Widgets/ShareMenu/ShareMenu";

function Detail(props) {
  let { collection, tokenID } = useParams();
  const { theme } = useContext(ThemeContext)
  var slide_settings = {
    infinite: false,
    dots: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { account, library } = useActiveWeb3React();

  const [item, setItem] = useState(null);

  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [didLike, setDidLike] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [showSendNFTModal, setShowSendNFTModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showEndAuction, setShowEndAuction] = useState(false);
  const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false);
  const [showPutMarketPlace, setShowPutMarketPlace] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const [auctionStatus, setAuctionStatus] = useState(false);
  const [auctionStatusMessage, setAuctionStatusMessage] = useState('');
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // properties for owners list
  const [holding, setHolding] = useState(0);
  const [available, setAvailable] = useState(0);
  const [pairItem, setPairItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchItem() {
    try {
      if (isLoading) return;
      setIsLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_API}/item_detail/${collection}/${tokenID}`);
      setIsLoading(false);
      if (res.data.status) {
        setItem(res.data.item);
      }
    } catch (e) {
      setIsLoading(false);
      setItem(null);
    }
  }

  useEffect(() => {
    if (!item) {
      fetchItem();
    } else {
      if (account && item) {
        let holdingAmount = 0;
        let owned = item.holders.filter(holder => holder.address === account.toLowerCase());
        for (let index = 0; index < owned.length; index++) {
          let holder = owned[index];
          holdingAmount = holdingAmount + holder.balance;
        }
        setHolding(holdingAmount);

        if (item.auctionInfo) {
          setAvailable(0)
        } else if (item.pairs) {
          let ownedPairs = item.pairs.filter(pair => pair.owner === account.toLowerCase());
          let listedAmount = 0;
          for (let index = 0; index < ownedPairs.length; index++) {
            let ownedPair = ownedPairs[index];
            listedAmount = listedAmount + ownedPair.balance;
          }
          setAvailable(holdingAmount - listedAmount);
        } else {
          setAvailable(holdingAmount);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, account, collection, tokenID])

  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/activities?itemCollection=${collection}&tokenId=${tokenID}&limit=60`)
      .then(res => {
        if (res.data.status) {
          setEvents(res.data.events);
        }
      })
      .catch(err => {
        //show an error page that the item doesnt exist
        setEvents([]);
      })
  }, [collection, tokenID])

  useEffect(() => {
    if (item && account) {
      setLocalLikeCount(item.likes ? item.likes.length : 0);
      setDidLike(item.likes && item.likes.includes(account.toLowerCase()));
    }
  }, [item, account])

  useEffect(() => {
    if (item && item.auctionInfo) setInterval(() => setNewTime(), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const setNewTime = () => {
    const currentTimestamp = new Date().getTime();
    let countdownDate = 0;
    if (item.auctionInfo.startTime * 1000 > currentTimestamp) {
      setAuctionStatus(false);
      countdownDate = item.auctionInfo.startTime * 1000;
      setAuctionStatusMessage('Auction starts in');

    } else if (item.auctionInfo.endTime * 1000 > currentTimestamp) {
      setAuctionStatus(true);
      countdownDate = item.auctionInfo.endTime * 1000;
      setAuctionStatusMessage('Ends in');
    } else {
      setAuctionStatusMessage('Auction has ended');
      setAuctionStatus(false);
    }

    if (countdownDate) {
      const distanceToDate = countdownDate - currentTimestamp;

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (numbersToAddZeroTo.includes(days)) {
        days = `0${days}`;
      }
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      }
      if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      }
      if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }
      setState({ days: days, hours: hours, minutes: minutes, seconds: seconds });
    } else {
      setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  function clickFavorite() {
    if (account) {
      if (!isLiking) {
        setIsLiking(true);
        setLocalLikeCount(l => l + (didLike ? -1 : 1));
        setDidLike(i => !i);
        axios.post(`${process.env.REACT_APP_API}/item/like`, Querystring.stringify({ address: account.toLowerCase(), tokenId: item.tokenId, itemCollection: item.itemCollection }))
          .then(res => {
            if (res.data.status) {
              setIsLiking(false);
            }
          })
          .catch(err => {
            setIsLiking(false);
          })
      }
    }
  }

  function buyItem(pair) {
    setPairItem(pair);
    setShowBuyNowModal(true);
  }
  function delistPairItem(pair) {
    setPairItem(pair);
    setShowUnlistMarketPlace(true);
  }

  async function onRequestClaim(amount, delivery) {
    if (!account) {
      return toast.error("Please connect your wallet.")
    }
    if (amount <= 0) {
      return toast.error("Should be more than 1.")
    }
    if (delivery.length <= 0) {
      return toast.error("Enter the delivery contact address to claim.")
    }
    if (holding <= 0) {
      return toast.error("You are not owner of this NFT Item");
    }
    if (collection.toLowerCase() !== process.env.REACT_APP_HEXTOYS_ADDRESS) {
      return toast.error("You can claim for only Hex Toys Default Collection")
    }
    if (tokenID !== "4") {
      return toast.error("Not allowed to claim right now.")
    }

    const signature = await library.signMessage(
      `I want to request the claim with this information: ${item.itemCollection}:${item.tokenId}:${account.toLowerCase()}:${amount}:${delivery}`
    );
    if (!signature) {
      return toast.error("Signing failed!");
    }

    // call create_auction backend api 
    const api_toast_id = toast.loading("Requesting Claim...");

    const isApproved = await approveNFTOnClaim(item.type, item.itemCollection, account, library)
    if (!isApproved) {
      toast.dismiss(api_toast_id);
      return toast.error("Approving is failed")
    }

    const { data } = await axios.post(`${process.env.REACT_APP_API}/item/request_claim`,
      Querystring.stringify({
        itemCollection: item.itemCollection,
        tokenId: item.tokenId,
        from: account.toLowerCase(),
        amount: amount,
        delivery: delivery,
        signature: signature
      }));

    toast.dismiss(api_toast_id);
    if (data?.status) {
      // success
      toast.success("Your request is in under review");
    } else {
      return toast.error(data.message);
    }
  }

  const [setPageLoading, setMessage] = useLoader()
  useEffect(() => {
    setMessage('')
    setPageLoading(!item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])
  const [tabId, setTabId] = useState(0);
  const [isLoadingMainNft, setIsLoadingMainNft] = useState(true);
  const [isLoadingCollImg, setIsLoadingCollImg] = useState(true);
  return (
    <>
      <Helmet>
        <title>HEX TOYS - Item Details | NFT Marketplace on PulseChain</title>
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" name="title" />
        <meta content="Explore the details of a unique digital collectible on HEX TOYS. Learn more about this NFT and its creator on PulseChain." name="description" />
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" name="twitter:title" />
        <meta content={`https://marketplace.hex.toys/detail/${collection}/${tokenID}`} name="twitter:url" />
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" property="og:title" />
        <meta content="Explore the details of a unique digital collectible on HEX TOYS. Learn more about this NFT and its creator on PulseChain." property="og:description" />
        <meta content={`https://marketplace.hex.toys/detail/${collection}/${tokenID}`} property="og:url" />
        <meta content="HEX TOYS, NFT marketplace, PulseChain, digital collectible, NFT details, NFT creator" name="keywords" />
      </Helmet>

      <Header {...props} />
      {item &&
        <div className="detail">
          <div className="container">
            <div className='bull-info'>

              <div className="img_container">

                {
                  item?.asset_type === 'video' ?
                    <div className="img_div">
                      <video className='video' src={item.isThumbSynced ? item.animUrl : item.animation_url} autoPlay loop controls onLoadedData={() => setIsLoadingMainNft(false)} style={{ opacity: isLoadingMainNft ? 0 : 1 }} />
                      {isLoadingMainNft && <img src={loadingImage} alt="" className="img_cover" />}
                    </div>
                    :
                    item?.asset_type === 'audio' ?
                      <>
                        <div className="img_div">
                          <img src={(item.isThumbSynced ? item.highLogo : item.image) || unknownImg} alt='' onLoad={() => setIsLoadingMainNft(false)} style={{ opacity: isLoadingMainNft ? 0 : 1 }} />
                          {isLoadingMainNft && <img src={loadingImage} alt="" className="img_cover" />}
                        </div>
                        <audio className='audio' src={item.animation_url} autoPlay loop controls />
                      </> :
                      <div className="img_div">
                        <img src={(item.isThumbSynced ? item.highLogo : item.image) || unknownImg} alt='' onLoad={() => setIsLoadingMainNft(false)} style={{ opacity: isLoadingMainNft ? 0 : 1 }} />
                        {isLoadingMainNft && <img src={loadingImage} alt="" className="img_cover" />}
                      </div>
                }
              </div>


            </div>

            <div className='activity-section'>
              <div className='header'>
                {
                  item.type === 'single' &&
                  <div className='header-subtitle' onClick={(e) => {
                    window.open(`/profile/${item.ownerUser.address}`);
                  }}>
                    <span className={`owner-name text_color_1_${theme}`}>
                      <img src={item?.ownerUser?.lowLogo} alt={''} />
                      <div className='owner-info'>
                        <p className={`text_color_4_${theme}`}>Current Owner</p>
                        <p>
                          {
                            item?.ownerUser.name === 'NoName' ?
                              !item?.ownerUser.ensName || item?.ownerUser.ensName === '' ? shorter(item?.ownerUser.address) : item?.ownerUser.ensName :
                              item?.ownerUser.name
                          }
                        </p>
                      </div>

                    </span>
                  </div>
                }
                <div className="title">
                  <h2 className={`text_color_gradient`}>{item.name}</h2>
                </div>

                {item?.collectionInfo &&
                  <div className="header-links">
                    <Link to={`/collection/${item?.collectionInfo.address}`} className={`col_link text_color_4_${theme}`}>
                      <div className="img_div">
                        <img src={item?.collectionInfo.lowLogo} alt="" style={{ opacity: isLoadingMainNft ? 0 : 1 }} className='img_main' onLoad={() => setIsLoadingCollImg(false)} />
                        {isLoadingCollImg && <img src={loadingImage} alt="" style={{ opacity: isLoadingMainNft ? 0 : 1 }} className='img_cover' />}
                      </div>
                      {item?.collectionInfo.name}
                    </Link>
                  </div>
                }

                <div className='header-links' style={{ display: 'none' }}>
                  <ul>
                    <li><a href='/' className='primary-bg'>
                      <img src={reloadBtn} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='/'>
                      <img src={externalLink} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='/'>
                      <img src={shareLink} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='/'>
                      <img src={menuIcn} height="24" width="24" alt={''} />
                    </a></li>
                  </ul>
                </div>
                <div className={`line border_color_${theme}`}></div>

                {
                  collection.toLowerCase() === process.env.REACT_APP_HEXTOYS_ADDRESS && account && holding > 0 &&
                  <Button label='Claim' roundFull greyColor onClick={(e) => setShowClaimModal(true)} />
                }

              </div>

              <div className="state_div">
                {
                  item.auctionInfo &&
                  <div className='state_item'>
                    {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).symbol === 'INC' ?
                      <img className='icon-price' src={incIcon} alt={''} /> :
                      <img className='icon-price' src={getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).logoURI} alt={''} />
                    }
                    <h5 className={`text_color_3_${theme}`}>{formatNum(item.auctionInfo.price)}</h5>
                  </div>
                }
                {
                  item.pairs && item.pairs.length > 0 &&
                  <div className='state_item'>
                    {getCurrencyInfoFromAddress(item.pairs[0].tokenAdr).symbol === 'INC' ?
                      <img className='icon-price' src={incIcon} alt={''} /> :
                      <img className='icon-price' src={getCurrencyInfoFromAddress(item.pairs[0].tokenAdr).logoURI} alt={''} />
                    }
                    <h5 className={`text_color_3_${theme}`}>{formatNum(item.pairs[0].price)} {getCurrencyInfoFromAddress(item.pairs[0].tokenAdr).symbol}</h5>
                  </div>
                }
                <div className='btns_div'>
                  <div className="favorit_btn" onClick={() => clickFavorite()}>
                    {didLike ? <HeartFill color='red' size={20} /> : <Heart className={`text_color_3_${theme}`} size={20} />}
                    <p className={`text_color_3_${theme}`}>{localLikeCount}</p>
                  </div>
                  <ShareMenu />
                </div>

              </div>

              {/* view auction info */}
              {item.auctionInfo &&
                <div className='product-info'>

                  <div className={`productinfo-des bg_${theme}`}>
                    <div className='col_div'>
                      <h6 className={`text_color_4_${theme}`}>{(item.auctionInfo.bids && item.auctionInfo.bids.length > 0) ? 'Highest bid' : 'Minimum Bid'}</h6>
                      <h5 className={`text_color_4_${theme}`}><span className={`text_color_1_${theme}`}>{formatNum(item.auctionInfo.price)} {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).symbol}</span></h5>
                    </div>
                    <div className='col_div'>
                      <h6 className={`text_color_4_${theme}`}>Available</h6>
                      <h5 className={`text_color_4_${theme}`}><span className={`text_color_1_${theme}`}>482</span> of <span className={`text_color_1_${theme}`}>614</span></h5>
                    </div>
                  </div>
                  <p className={`text_color_1_${theme}`}>Last sale price 0.827 PLS</p>
                  {account && item.auctionInfo &&
                    <div className='productinfo-buttons'>
                      {
                        item.auctionInfo.owner.toLowerCase() === account?.toLowerCase() &&
                        <Button label='End Auction' fillBtn roundFull onClick={() => { setShowEndAuction(true) }} />
                      }
                      {item.auctionInfo.owner.toLowerCase() !== account?.toLowerCase() &&
                        <Button label='Place a bid' greyColor onClick={() => { setShowPlaceBidModal(true) }} />
                      }
                    </div>
                  }


                  {auctionStatus &&
                    <p className={`text_color_4_${theme}`}>{auctionStatusMessage} : {state.days || '00'}d {state.hours || '00'}h {state.minutes || '00'}m {state.seconds || '00'}s </p>
                  }
                  <div className='productinfo-buttons'>
                    <Button label='Message Owner' outlineBtnColor disabled={true} />
                  </div>
                </div>
              }


              {/* Not for Sale */}
              {!item.pairs && !item.auctionInfo && (!holding || holding === 0) &&
                <div className='product-info'>
                  <p className={`text_color_1_${theme}`}>Not for Sale</p>
                  <div className='productinfo-buttons'>
                    <Button label='Message Owner' outlineBtnColor disabled={true} />
                  </div>
                </div>
              }

              {
                account && holding > 0 && <div className='product-info'>
                  <div className='productinfo-buttons'>
                    {
                      available > 0 &&
                      <Button label='Put on sale' fillBtn w_full roundFull onClick={() => { setShowPutMarketPlace(true) }} />
                    }
                    <Button label='Send NFT' fillBtn w_full outlineBtnColor roundFull onClick={() => { setShowSendNFTModal(true) }} />

                  </div>
                </div>
              }

              {/* view minimum listing info */}
              {item.pairs && item.pairs.length > 0 &&
                <div className='product-info'>
                  <div className={`productinfo-des bg_${theme}`}>
                    <div className='col_div'>
                      <h6 className={`text_color_4_${theme}`}>Current Price</h6>
                      <h5 className={`text_color_4_${theme}`}><span className={`text_color_1_${theme}`}>{formatNum(item.pairs[0].price)} {getCurrencyInfoFromAddress(item.pairs[0].tokenAdr).symbol}</span></h5>
                    </div>
                    <div className='col_div'>
                      <h6 className={`text_color_4_${theme}`}>Available</h6>

                      {item.supply > 1 &&
                        <h5 className={`text_color_4_${theme}`}><span className={`text_color_1_${theme}`}>{item.pairs[0].balance}</span> of <span className={`text_color_1_${theme}`}>{item.supply}</span></h5>
                      }
                    </div>
                  </div>
                  {account &&
                    <div className='productinfo-buttons'>
                      {item.pairs[0].owner.toLowerCase() === account.toLocaleLowerCase() ?
                        <Button label='Unlist' fillBtn roundFull onClick={() => { delistPairItem(item.pairs[0]) }} /> :
                        <Button label='Buy Now' fillBtn roundFull onClick={() => { buyItem(item.pairs[0]) }} />
                      }
                    </div>
                  }

                </div>
              }

            </div>
          </div>

          <div className="container">
            <div className='bull-info'>

              <div className={`tab_list boder_color_${theme}`}>
                <div className={`tab text_color_4_${theme} ${tabId === 0 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(0)}>Overview</div>
                <div className={`tab text_color_4_${theme} ${tabId === 1 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(1)}>Properties</div>
                <div className={`tab text_color_4_${theme} ${tabId === 2 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(2)}>Price History</div>
                <div className={`tab text_color_4_${theme} ${tabId === 3 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(3)}>Owners</div>
                <div className={`tab text_color_4_${theme} ${tabId === 4 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(4)}>Activity</div>
              </div>

              {tabId === 0 &&
                <div className="tab_conent">
                  <div className={`row_div padding border_color_${theme}`}>
                    <h3 className={`sub_title text_color_1_${theme}`}>Description</h3>
                    <p className={`desc_text text_color_3_${theme}`}>{item.description}</p>
                  </div>

                  {/* Listings */}
                  {item.pairs && item.pairs.length > 0 &&
                    <div className={`row_div padding border_color_${theme}`}>
                      <h3 className={`sub_title text_color_1_${theme}`}>Listing</h3>
                      <div className='productinfo-des'>
                        <div className='activity-table-wrapper'>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <thead>
                              <tr>
                                <th>Price </th>
                                <th>Quantity</th>
                                <th>From</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item?.pairs.map((pair, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className='price-wrapper'>
                                        <img src={getCurrencyInfoFromAddress(pair.tokenAdr).logoURI} alt={''} />
                                        <p>{formatNum(pair.price)}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <p>{pair.balance}</p>
                                    </td>
                                    <td>
                                      <div className='price-wrapper'
                                        onClick={() => window.open(`/profile/${pair.ownerUser.address}`)}>
                                        <img src={pair.ownerUser.lowLogo} alt={''} />
                                        <p>{pair.ownerUser.name}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='action-container'>
                                        {
                                          account && pair.ownerUser.address.toLowerCase() === account.toLocaleLowerCase() &&
                                          <Button label='Unlist' outlineBtnColor roundFull onClick={() => delistPairItem(pair)} />
                                        }
                                        {
                                          account && pair.ownerUser.address.toLowerCase() !== account.toLocaleLowerCase() &&
                                          <Button label='Buy' outlineBtnColor roundFull onClick={() => buyItem(pair)} size='sm' />

                                        }
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  }

                  {/* Bids */}
                  {item.auctionInfo && item.auctionInfo.bids &&
                    <div className={`row_div padding border_color_${theme}`}>
                      <h3 className={`sub_title text_color_1_${theme}`}>Bid history</h3>
                      <div className='productinfo-des'>
                        <div className='activity-table-wrapper'>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <thead>
                              <tr>
                                <th>Price</th>
                                <th>From </th>
                                <th>Date </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item.auctionInfo.bids.map((bid, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className='price-wrapper'>
                                        <img src={getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).logoURI} alt={''} />
                                        <p>{formatNum(bid.bidPrice)}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='price-wrapper'
                                        onClick={() => window.open(`/profile/${bid.fromUser.address}`)}>
                                        <img src={bid.fromUser.lowLogo} alt={''} />
                                        <p>{bid.fromUser.name}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='date-wrapper'>
                                        <i className="icon-share-link"></i>
                                        <p>{format(bid.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  }

                  {/* Details */}
                  <div className='row_div'>
                    <h3 className={`sub_title padding text_color_1_${theme}`}>Details</h3>
                    <div className={`info-des border_color_${theme}`}>

                      <div className={`detail-item text_color_4_${theme}`}>
                        Contract Address
                        <span>
                          <a href={`${NetworkParams.blockExplorerUrls[0]}/address/${item.itemCollection}`} target="_blank" rel="noreferrer" className={`text_color_gradient_1`}>{shorter(item.itemCollection)}</a>
                        </span>
                      </div>
                      <div className={`detail-item text_color_4_${theme}`}>
                        Token ID
                        <span>{item.tokenId}</span>
                      </div>
                      <div className={`detail-item text_color_4_${theme}`}>
                        Token Standard
                        <span> {item.type === 'single' ? 'PRC-721' : 'PRC-1155'} </span>
                      </div>
                      <div className={`detail-item text_color_4_${theme}`}>
                        Blockchain
                        <span>{NetworkParams.chainName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {/* Properties */}
              {tabId === 1 &&
                <div className="tab_conent">
                  <div className={`row_div`}>
                    <h3 className={`sub_title padding text_color_1_${theme}`}>Properties</h3>
                    <div className={`info-property border_color_${theme}`}>
                      {item?.attributes.map((attribute, index) => (
                        <div className="item-property" key={index}>
                          <div className={`property-type text_color_4_${theme}`}>{attribute.trait_type}</div>
                          <div className={`property-value text_color_1_${theme}`}>{attribute.value}</div>
                        </div>
                      ))
                      }
                    </div>
                  </div>

                </div>
              }
              {/* Price History */}
              {tabId === 2 &&
                <div className="tab_conent">
                  <div className="row_div">
                    <h3 className={`sub_title text_color_1_${theme}`}>Price History</h3>
                    <div className='productinfo-des bg-dark'>
                      <MyChart params={{
                        itemCollection: collection,
                        tokenId: tokenID
                      }} />
                    </div>
                  </div>

                </div>
              }
              {/* Owners */}
              {tabId === 3 &&
                <div className="tab_conent">
                  <div className="row_div">
                    <h3 className={`sub_title text_color_1_${theme}`}>Owners</h3>
                    {item.holders && item.type === 'multi' &&
                      <div className='productinfo-des'>
                        <div className={`activity-table-wrapper padding border_color_${theme}`}>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <thead className={`border_color_${theme}`}>
                              <tr>
                                <th>Profile </th>
                                <th>Address</th>
                                <th>Quantity </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item?.holders.map((holder, index) => {
                                  return <HolderItem holder={holder} index={index} />
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    }
                  </div>

                </div>
              }
              {/* Activity */}
              {tabId === 4 &&
                <div className="tab_conent">
                  <div className="row_div">
                    <h3 className={`sub_title text_color_1_${theme}`}>Activity</h3>
                    <div className='productinfo-des'>
                      <div className={`activity-table-wrapper padding border_color_${theme}`}>
                        <table className={`activity-table text_color_1_${theme}`}>
                          <thead className={`border_color_${theme}`}>
                            <tr>
                              <th>Event </th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>From </th>
                              <th>To</th>
                              <th>Date </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              events.map((event, index) => (
                                <EventItem event={event} index={index} />
                              ))
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className='activity-section'>

            </div>
          </div>

          <div className="container">
            {item?.more && item?.more.length !== 0 &&
              <div className='cards-wrapper'>
                <h2 className={`sub_title text_color_1_${theme}`}>More from this collection</h2>
                <div className="carousel-wrapper">
                  <Slider {...slide_settings}>
                    {item?.more?.map((moreItem, index) => (
                      <ItemCard key={index} {...props} item={moreItem} />
                    ))}
                  </Slider>
                </div>

                <div className='more-content'>
                  <Button label='View Collection' router outlineBtnColor roundFull href={`/collection/${collection}`} />
                </div>

              </div>}
          </div>
        </div>
      }
      <Footer />
      {
        item && item.auctionInfo && account &&
        <ModalBid
          item={item}
          showPlaceBidModal={showPlaceBidModal}
          setShowPlaceBidModal={setShowPlaceBidModal}
        />
      }
      {
        item && pairItem && account &&
        <ModalBuy
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showBuyNowModal={showBuyNowModal}
          setShowBuyNowModal={setShowBuyNowModal}
        />
      }
      {
        item && pairItem && account &&
        <ModalDelist
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showUnlistMarketPlace={showUnlistMarketPlace}
          setShowUnlistMarketPlace={setShowUnlistMarketPlace}
        />
      }

      {
        item && item.auctionInfo && account &&
        <ModalEndAuction
          item={item}
          showEndAuction={showEndAuction}
          setShowEndAuction={setShowEndAuction}
        />
      }

      {
        item && (available > 0) && account &&
        <ModalList
          item={item}
          holding={holding}
          available={available}
          showPutMarketPlace={showPutMarketPlace}
          setShowPutMarketPlace={setShowPutMarketPlace}
        />
      }

      {
        item && (holding > 0) && account &&
        <ModalTransfer
          item={item}
          holding={holding}
          showSendNFTModal={showSendNFTModal}
          setShowSendNFTModal={setShowSendNFTModal}
        />
      }
      <ModalClaim
        holding={holding}
        onRequestClaim={onRequestClaim}
        showClaimModal={showClaimModal}
        setShowClaimModal={setShowClaimModal} />
    </>
  );
}

export default Detail;