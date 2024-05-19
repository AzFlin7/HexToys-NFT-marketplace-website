import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Querystring from 'query-string';
import Header from '../header/header';
import Footer from '../footer/footer';
import { useLoader } from '../../context/useLoader'
import "./collection.scss";
import clsx from 'clsx';
import ItemCard from "../../components/Cards/ItemCard";
import MySelect from '../../components/Widgets/MySelect';
import Expand from "react-expand-animated";
import Masonry from 'react-masonry-css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { formatNum, shorter, NetworkParams } from "../../utils";
import { useActiveWeb3React } from "../../hooks";
import InfiniteScroll from "react-infinite-scroll-component";

import toast from "react-hot-toast";
import { arrayify, hashMessage } from "ethers/lib/utils";
import ModalReport from "../../components/modals/modal-report";
import ModalSubscribe from "../../components/modals/modal-subscribe";
import { onCollectionSubscriptions } from "../../utils/contracts";
import goldTick from "../../assets/images/icons/gold_tick.png";
import ThemeContext from '../../context/ThemeContext';
import more_icon from '../../assets/images/icons/icon_more.svg';
import more_icon_black from '../../assets/images/icons/icon_more_black.svg';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import { useEnsName } from "wagmi";
import CheckBox from "../../components/Widgets/CheckBox";
import CopyIcon from "../../assets/images/icons/icon_copy.svg";
import CopyIcon_black from "../../assets/images/icons/icon_copy_black.svg";

import ActivityTable from "../../components/ActivityTable/ActivityTable";
import ShareMenu from "../../components/Widgets/ShareMenu/ShareMenu";

function Collection(props) {
  let { collection } = useParams();
  const { account, library } = useActiveWeb3React();
  const usetheme = useTheme();
  const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
  const { theme } = useContext(ThemeContext)

  const breakpoint = {
    default: 4,
    1840: 4,
    1440: 4,
    1280: 3,
    1080: 2,
    768: 2,
    450: 2,
  };
  const styles = {
    open: { width: "100%" },
    close: { width: "100%" }
  };
  const transitions = ["height", "opacity", "background"];
  const review_status = ["Verify", "Under Review", "Subscribe", "Subscribed"]
  const [curTab, setCurTab] = useState('items'); // items, activity
  const [showFilter, setShowFilter] = useState(false);

  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const [collectionInfo, setCollectionInfo] = useState(null);
  useEffect(() => {
    if (!collectionInfo) {
      axios.get(`${process.env.REACT_APP_API}/collection/detail?address=${collection}`)
        .then(res => {
          if (res.data.status) {
            setCollectionInfo(res.data.collection);
          }
        })
        .catch(err => {
          setCollectionInfo(undefined);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection])

  const ensName = useEnsName({ address: collectionInfo?.ownerUser?.address })
  const [items, setItems] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isExpandStatus, setIsExpandStatus] = useState(true);
  const [saleStatus, setSaleStatus] = useState(''); // owned, sale, liked

  const [isExpandTraits, setIsExpandTraits] = useState(false);

  const [traitsTypes, setTraitsTypes] = useState([]);
  useEffect(() => {
    if (collectionInfo) {
      setTraitsTypes(collectionInfo.traitsTypes ? collectionInfo.traitsTypes : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionInfo])

  const [colIdx, setColIdx] = useState([])
  const [selectedTraitList, setSelectedTraitList] = useState([])
  const handleTraitsChange = (traitsType, traitsValue) => {
    let arrayData = [...selectedTraitList];
    let selectedTraitIndex = arrayData.findIndex(selectedTrait => ((selectedTrait.trait_type === traitsType.name) && selectedTrait.values.includes(traitsValue.value)));

    if (selectedTraitIndex > -1) {
      let selectedTraitData = arrayData[selectedTraitIndex];
      if (selectedTraitData.values.length === 1) {
        arrayData.splice(selectedTraitIndex, 1);
      } else {
        let valueIndex = selectedTraitData.values.findIndex(value => value === traitsValue.value)
        selectedTraitData.values = selectedTraitData.values.splice(valueIndex, 1);
        arrayData[selectedTraitIndex] = selectedTraitData;
      }
    } else {
      let traitTypeIndex = arrayData.findIndex(selectedTrait => (selectedTrait.trait_type === traitsType.name));
      if (traitTypeIndex > -1) {
        let selectedTraitData = arrayData[traitTypeIndex];
        let values = selectedTraitData.values || [];
        values.push(traitsValue.value);
        selectedTraitData.values = values;
        arrayData[traitTypeIndex] = selectedTraitData;

      } else {
        arrayData.push({ trait_type: traitsType.name, values: [traitsValue.value] });
      }
    }
    setSelectedTraitList(arrayData);
  }

  const handExpand = (val) => {
    const idx = colIdx.indexOf(val);
    if (idx > -1) colIdx.splice(idx, 1) //isExist
    else colIdx.push(val);
    setColIdx([...colIdx]);
  }

  const sortOptions = [
    { label: 'Recently Listed', value: 'timestamp' },
    { label: 'Price: low to high', value: 'price1' },
    { label: 'Price: high to low', value: 'price2' },
    { label: 'Most Favorited', value: 'likeCount' },
    { label: 'Name', value: 'name' },
  ];
  const [sortBy, setSortBy] = useState("price2");

  useEffect(() => {
    setItems([]);
    setNoItems(false)
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, searchKey, saleStatus, sortBy, selectedTraitList])

  useEffect(() => {
    setLoading(true)
    if (initialItemsLoaded) {
      fetchItems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchItems(reset) {
    let paramData = {
      itemCollection: collection,
      sortDir: 'desc'
    }

    if (sortBy) {
      switch (sortBy) {
        case 'timestamp':
          paramData.sortBy = 'timestamp';
          paramData.sortDir = 'desc';
          break;
        case 'price1':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'asc';
          break;
        case 'price2':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'desc';
          break;
        case 'likeCount':
          paramData.sortBy = 'likeCount';
          paramData.sortDir = 'desc';
          break;
        case 'name':
          paramData.sortBy = 'name';
          paramData.sortDir = 'asc';
          break;

        default:
          break;
      }
    }
    if (searchKey) {
      paramData.searchTxt = searchKey
    }

    if (saleStatus) {
      paramData.saleType = saleStatus
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page;
    }

    if (selectedTraitList && selectedTraitList.length > 0) {
      paramData.attributes = JSON.stringify(selectedTraitList);
    }

    axios.get(`${process.env.REACT_APP_API}/items`, {
      params: paramData
    })
      .then(res => {
        setLoading(false);
        if (res.data.status) {
          if (res.data.items.length === 0) setNoItems(true)
          if (reset) {
            setItems(res.data.items)
            setInitialItemsLoaded(true)
          } else {
            let prevArray = JSON.parse(JSON.stringify(items))
            prevArray.push(...res.data.items)
            setItems(prevArray)
          }
        }
      })
      .catch(err => {
        setLoading(false)
        // console.log(err)
        setNoItems(true)
      })
  }

  function loadMore() {
    if (!loading) {
      setPage(page => { return (page + 1) })
    }
  }

  function changeStatus(newStatus) {
    if (saleStatus === newStatus) {
      setSaleStatus('');

    } else {
      setSaleStatus(newStatus);
    }
  }
  const [setPageLoading, setMessage] = useLoader()
  useEffect(() => {
    setMessage('')
    setPageLoading(!collectionInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, collectionInfo, noItems])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchKey(searchTxt);
    }
  }

  const handleProcess = async () => {
    if (collectionInfo?.ownerAddress.toLowerCase() === account?.toLowerCase() || (collectionInfo?.whitelist && collectionInfo?.whitelist.includes(account?.toLowerCase()))) {
      if (!collectionInfo?.reviewStatus || collectionInfo?.reviewStatus === 0) { //Verify Request
        onRequestVerify()
      } else if (collectionInfo?.reviewStatus === 2) { //Subscribe
        setShowSubscribeModal(true);
      }
    } else { //Report
      setShowReportModal(true);
    }
  }

  const onRequestVerify = async () => {
    if (!account) {
      return toast.error("Please connect your wallet correctly!")
    }
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const msg = await library.signMessage(arrayify(hashMessage(account?.toLowerCase() + "-" + timestamp)));
    if (!msg) return toast.error("Failed");
    const paramsData = {
      account: account?.toLowerCase(),
      owner: collectionInfo?.ownerAddress?.toLowerCase(),
      itemCollection: collectionInfo?.address,
      timestamp: timestamp,
      message: msg,
    }
    axios.post(`${process.env.REACT_APP_API}/collection/request_verify`, Querystring.stringify(paramsData))
      .then((res) => {
        if (res.data.status) {
          setCollectionInfo({ ...collectionInfo, reviewStatus: res.data.collection.reviewStatus })
        }
      }).catch((e) => {
        // console.log(e);
        toast.error(e.message)
      })
  }

  const onSubscribe = async (period) => {
    if (!account) {
      return toast.error("Please connect your wallet correctly!")
    }
    const load_toast_id = toast.loading("Processing...")
    const isPaid = await onCollectionSubscriptions(collectionInfo?.address, period, library)
    toast.dismiss(load_toast_id)
    if (isPaid) {
      toast.success("Subscribed Successfully.")
      setShowSubscribeModal(false);
      window.location.reload()
    } else {
      toast.error("Failed");
    }
  }

  const onReport = async (content) => {
    if (!account) {
      return toast.error("Please connect your wallet correctly!")
    }
    if (collectionInfo.ownerAddress.toLowerCase() === account?.toLowerCase()) {
      return toast.error("You can not report about your own collection")
    }
    if (collectionInfo?.whitelist && collectionInfo?.whitelist.includes(account?.toLowerCase())) {
      return toast.error("You are included into the whitelist")
    }
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const msg = await library.signMessage(arrayify(hashMessage(account?.toLowerCase() + "-" + content + "-" + timestamp)));
    if (!msg) return;
    const paramsData = {
      from: account?.toLowerCase(),
      itemCollection: collectionInfo?.address,
      timestamp: timestamp,
      content: content,
      message: msg,
    }
    const load_toast_id = toast.loading("Waiting...")
    axios.post(`${process.env.REACT_APP_API}/collection/report_scam`, Querystring.stringify(paramsData))
      .then((res) => {
        setShowReportModal(false);
        if (res.data.status) {
          toast.dismiss(load_toast_id)
          toast.success("Your report is in review now.")
        }
      }).catch((e) => {
        // console.log(e);
        toast.dismiss(load_toast_id)
        toast.error(e.message)
      })
  }

  const copyToClipboard = (text) => {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    toast.success("Copied");
  }

  return (
    <>
      <Header {...props} />
      {
        collectionInfo &&
        <InfiniteScroll
          dataLength={items.length} //This is important field to render the next data
          next={loadMore}
          hasMore={!noItems}
          scrollThreshold={0.5}
        >
          <div className="collection">
            <div className="banner">
              <img src={collectionInfo?.coverUrl || '/hextoysmarketplace.jpg'} alt={''} onLoad={() => setIsBannerLoading(false)} />
              {isBannerLoading && <div className="img_cover"></div>}
            </div>

            <div className="profile_div">
              <div className="row_div">

                <div style={{ display: 'flex' }}>
                  <div className="avatar_div">
                    <div className="avatar_info">
                      <img src={collectionInfo?.image} alt='' onLoad={() => setIsAvatarLoading(false)} />
                      {isAvatarLoading && <div className="img_cover"></div>}
                    </div>
                    {collectionInfo?.reviewStatus === 3 && <img src={goldTick} className="subscribe-tick" alt='' />}
                  </div>
                  <ShareMenu />
                </div>
                {(collectionInfo.website || collectionInfo.telegram || collectionInfo.discord || collectionInfo.twitter || collectionInfo.facebook || collectionInfo.instagram || (account && ((account.toLowerCase() === collectionInfo.ownerAddress) || collectionInfo.whitelist?.includes(account.toLowerCase())))) && 
                <div className={`social-link bg_${theme}`}>
                  {
                    collectionInfo.website &&
                    <a href={collectionInfo.website} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fas fa-globe"></i>
                    </a>
                  }
                  {
                    collectionInfo.telegram &&
                    <a href={collectionInfo.telegram} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fab fa-telegram-plane"></i>
                    </a>
                  }
                  {
                    collectionInfo.discord &&
                    <a href={collectionInfo.discord} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fab fa-discord"></i>
                    </a>
                  }
                  {
                    collectionInfo.twitter &&
                    <a href={collectionInfo.twitter} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  }
                  {
                    collectionInfo.facebook &&
                    <a href={collectionInfo.facebook} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fab fa-facebook"></i>
                    </a>
                  }
                  {
                    collectionInfo.instagram &&
                    <a href={collectionInfo.instagram} target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                      <i className="fab fa-instagram-square"></i>
                    </a>
                  }
                  {
                    account && ((account.toLowerCase() === collectionInfo.ownerAddress) || collectionInfo.whitelist?.includes(account.toLowerCase())) &&
                    <a href={`/edit_collection/${collection}`} className={`text_color_1_${theme}`}>
                      <i className="fas fa-edit"></i>
                    </a>
                  }
                </div>}
              </div>
              <div className="row_div">
                <div className="propic-wrap">

                  <div className="collection-info">
                    <div className="col-address">
                      <h2 className={`text_color_1_${theme}`}>{collectionInfo?.name}</h2>
                      <p className={`owner text_color_4_${theme}`}>
                        (Address:
                        <span className={`owner text_color_1_${theme}`} onClick={(e) => window.open(`${NetworkParams.blockExplorerUrls[0]}/address/${collection}`)}>
                          {shorter(collection)}
                        </span>
                        {theme === 'dark' ?
                          <img src={CopyIcon} alt="" onClick={() => copyToClipboard(collection)} /> :
                          <img src={CopyIcon_black} alt="" onClick={() => copyToClipboard(collection)} />
                        })
                      </p>
                    </div>

                    {collectionInfo && collectionInfo.ownerUser && collectionInfo.ownerUser.address !== '0x0000000000000000000000000000000000000000' &&
                      <p className={`owner text_color_4_${theme}`}>
                        Owner:
                        <span className={`owner text_color_1_${theme}`} onClick={(e) => { window.open(`/profile/${collectionInfo?.ownerUser?.address}`) }}>
                          {collectionInfo?.ownerUser?.name}
                        </span>
                        Address :
                        <span className={`owner text_color_1_${theme}`}>
                          {
                            collectionInfo?.ownerUser.name === 'NoName' ?
                              !collectionInfo?.ownerUser.ensName || collectionInfo?.ownerUser.ensName === '' ? shorter(collectionInfo?.ownerUser.address) : collectionInfo?.ownerUser.ensName :
                              collectionInfo?.ownerUser.name
                          }
                        </span>
                      </p>
                    }

                    <p className={`desc text_color_4_${theme}`}>{collectionInfo?.description}</p>
                  </div>
                </div>
                <div className={`value_detail bg_${theme}`}>
                  <div className="row_div">
                    <p className={`text_color_4_${theme}`}>Floor</p>
                    <h5 className={`text_color_1_${theme}`}><span>{formatNum((collectionInfo.tradingCount > 0 ? collectionInfo.tradingVolume / collectionInfo.tradingCount : 0) / collectionInfo.coinPrice)} PLS</span>(${formatNum(collectionInfo.tradingCount > 0 ? collectionInfo.tradingVolume / collectionInfo.tradingCount : 0)})</h5>
                  </div>
                  <div className="row_div">
                    <p className={`text_color_4_${theme}`}>Volume</p>
                    <h5 className={`text_color_1_${theme}`}><span>{formatNum(collectionInfo.tradingVolume / collectionInfo.coinPrice)} PLS</span>(${formatNum(collectionInfo.tradingVolume)})</h5>
                  </div>
                  <div className={`row_div border border_${theme}`}>
                    <p className={`text_color_4_${theme}`}>Items</p>
                    <h5 className={`text_color_1_${theme}`}>{collectionInfo.totalItemCount}</h5>
                  </div>
                  <div className="row_div">
                    <p className={`text_color_4_${theme}`}>Owners</p>
                    <h5 className={`text_color_1_${theme}`}>{collectionInfo.totalOwners}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className={`tab_list boder_color_${theme}`}>
                <div className={`tab text_color_4_${theme} ${curTab === 'items' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('items')}>Items</div>
                <div className={`tab text_color_4_${theme} ${curTab === 'activity' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('activity')}>Activity</div>

                {
                  account && <div className="verify_btn" onClick={handleProcess}>
                    {
                      collectionInfo?.ownerUser?.address.toLowerCase() === account?.toLowerCase() || (collectionInfo?.whitelist && collectionInfo?.whitelist?.includes(account?.toLowerCase())) ?
                        review_status[collectionInfo?.reviewStatus || 0] :
                        "Report"
                    }
                  </div>
                }
              </div>
              {curTab === 'items' &&
                <>
                  {collectionInfo.isSynced ?
                    <div className="wrapper">

                      <div className="left">
                        <div className={`filter_label bg_${theme} text_color_1_${theme}`}>Filters</div>
                        <div className={`filter_div bg_${theme}`}>

                          {/* sale status */}
                          <div className="row_div">
                            <button onClick={() => setIsExpandStatus(!isExpandStatus)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                              Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i>
                            </button>
                            <Expand
                              open={isExpandStatus}
                              duration={300}
                              styles={styles}
                              transitions={transitions}
                            >
                              <div className="btn_list">
                                <button className={`filter_btn ${saleStatus === 'fixed' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('fixed')}>Buy Now</button>
                                <button className={`filter_btn ${saleStatus === 'auction' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('auction')}>On Auction</button>
                                <button className={`filter_btn ${saleStatus === 'not_sale' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('not_sale')}>Not for Sale</button>
                              </div>

                            </Expand>
                          </div>

                          {/* Traits */}
                          {
                            traitsTypes && traitsTypes.length > 0 &&
                            <div className="row_div">
                              <button onClick={() => setIsExpandTraits(!isExpandTraits)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                                {'Traits'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandTraits ? 0 : 180}deg)` }}></i>
                              </button>
                              <Expand
                                open={isExpandTraits}
                                duration={300}
                                styles={styles}
                                transitions={transitions}
                              >
                                <div className="btn_list">
                                  {traitsTypes.map((traitsType, typeIndex) => (
                                    <div className="traits_check_list" key={typeIndex}>
                                      <span className="main_label" onClick={() => handExpand(typeIndex)}>
                                        <h4 className={`text_color_1_${theme}`}>{traitsType.name} </h4>
                                        <h4 className={`text_color_4_${theme}`}>{traitsType.count} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i></h4>
                                      </span>
                                      <Expand
                                        open={colIdx.indexOf(typeIndex) > -1}
                                        duration={300}
                                        styles={styles}
                                        transitions={transitions}
                                      >
                                        {traitsType.traitsValues.map((traitsValue, valueIndex) => (
                                          <div className="traits_check_div" key={valueIndex}>
                                            <CheckBox label={traitsValue.value} checked={selectedTraitList && selectedTraitList.findIndex(selectedTrait => ((selectedTrait.trait_type === traitsType.name) && selectedTrait.values.includes(traitsValue.value))) > -1} onChange={(event) => handleTraitsChange(traitsType, traitsValue)} />
                                            <p className={`text_color_3_${theme}`}>{traitsValue.count}</p>
                                          </div>
                                        ))}
                                      </Expand>
                                    </div>

                                  ))}
                                </div>
                              </Expand>
                            </div>
                          }


                        </div>

                      </div>
                      <div className="right">
                        <div className="filter_div">
                          <div className={`filter_label bg_${theme} text_color_1_${theme}`} onClick={() => { setShowFilter(true) }}>Filters</div>
                          <div className={`fiter_mob_div ${showFilter === true ? 'show_div' : ''} bg_${theme}`}>
                            <div className="content_div">
                              <div className={`close_btn text_color_1_${theme}`}>
                                <CloseIcon className="fa" fontSize="small" onClick={() => { setShowFilter(false) }} />
                              </div>
                              <div className={`col_div bg_${theme}`}>

                                {/* sale status */}
                                <div className="row_div">
                                  <button onClick={() => setIsExpandStatus(!isExpandStatus)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                                    Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i>
                                  </button>
                                  <Expand
                                    open={isExpandStatus}
                                    duration={300}
                                    styles={styles}
                                    transitions={transitions}
                                  >
                                    <div className="btn_list">
                                      <button className={`filter_btn ${saleStatus === 'fixed' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('fixed')}>Buy Now</button>
                                      <button className={`filter_btn ${saleStatus === 'auction' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('auction')}>On Auction</button>
                                      <button className={`filter_btn ${saleStatus === 'not_sale' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('not_sale')}>Not for Sale</button>
                                    </div>
                                  </Expand>
                                </div>

                                {/* Traits */}
                                <div className="row_div">
                                  <button onClick={() => setIsExpandTraits(!isExpandTraits)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                                    {'Traits'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandTraits ? 0 : 180}deg)` }}></i>
                                  </button>
                                  <Expand
                                    open={isExpandTraits}
                                    duration={300}
                                    styles={styles}
                                    transitions={transitions}
                                  >
                                    <div className="btn_list">
                                      {traitsTypes.map((traitsType, typeIndex) => (
                                        <div className="traits_check_list" key={typeIndex}>
                                          <span className="main_label" onClick={() => handExpand(typeIndex)}>
                                            <h4 className={`text_color_1_${theme}`}>{traitsType.name} </h4>
                                            <h4 className={`text_color_4_${theme}`}>{traitsType.count} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i></h4>
                                          </span>
                                          <Expand
                                            open={colIdx.indexOf(typeIndex) > -1}
                                            duration={300}
                                            styles={styles}
                                            transitions={transitions}
                                          >
                                            {traitsType.traitsValues?.map((traitsValue, valueIndex) => (
                                              <div className="traits_check_div" key={valueIndex}>
                                                <CheckBox label={traitsValue.value} checked={selectedTraitList && selectedTraitList.findIndex(selectedTrait => ((selectedTrait.trait_type === traitsType.name) && selectedTrait.values.includes(traitsValue.value))) > -1} onChange={(event) => handleTraitsChange(traitsType, traitsValue)} />
                                                <p className={`text_color_3_${theme}`}>{traitsValue.count}</p>
                                              </div>
                                            ))}
                                          </Expand>
                                        </div>

                                      ))}
                                    </div>
                                  </Expand>
                                </div>

                              </div>
                            </div>
                          </div>
                          <div className="search_div">
                            <button><i className="fas fa-search"></i></button>
                            <input type='text' placeholder="Search by NFTs" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} className={`bg_${theme} text_color_1_${theme}`} onKeyPress={handleKeyPress} />
                          </div>
                          <div className="myselect">
                            <MySelect
                              value={isMobileOrTablet ? '' : sortBy}
                              options={sortOptions}
                              onChange={setSortBy}
                              className={clsx('filter_select', 'light')}
                            />
                            <img src={theme === 'dark' ? more_icon : more_icon_black} alt="" className="mob_icon" />
                          </div>

                        </div>
                        {items.length !== 0 &&
                          <Masonry
                            breakpointCols={breakpoint}
                            className={'masonry'}
                            columnClassName={'gridColumn'}
                          >
                            {items.map((item, index) => (
                              <ItemCard key={index} {...props} item={item} />
                            ))}
                          </Masonry>}
                        {loading &&
                          <div className="loadingContainer">
                            <div className={`loadin_text text_color_1_${theme}`}><CircularProgress style={{ width: "24px", height: "24px", marginRight: 8, color: theme === 'dark' ? '#fff' : '#000' }} />Loading...</div>
                          </div>}
                      </div>
                    </div>
                    :
                    <div className="loadingContainer">
                      <p>This collection is not synced yet.</p>
                      <p>Fetching previous transactions now...</p>
                      <CircularProgress className={`text_color_1_${theme}`} style={{ width: "50px", height: "50px", marginTop: '20px' }} />
                    </div>
                  }
                </>}

              {curTab === 'activity' &&
                <>
                  <ActivityTable baselink={`${process.env.REACT_APP_API}/activities?itemCollection=${collection}`} />
                  {/* <div className="wrapper column">
                    <h3 className={`sub_title text_color_1_${theme}`}>Activity</h3>
                    <div className={`activity-table-wrapper padding border_color_${theme}`}>
                      <table className={`activity-table text_color_1_${theme}`}>
                        <thead className={`border_color_${theme}`}>
                          <tr>
                            <th>Status </th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>From </th>
                            <th>To</th>
                            <th>Date </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <p>Buy</p>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src={'/icons/social-icon-4_white.svg'} alt={''} />
                                <p>3.0M</p>
                              </div>
                            </td>
                            <td>
                              <p>02</p>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src='/profile.png' onClick={() => window.open(`/profile/`)} alt={''} />
                                <p>Hey Toys</p>
                              </div>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src='/profile.png' onClick={() => window.open(`/profile/`)} alt={''} />
                                <p>Unknown</p>
                              </div>
                            </td>
                            <td>
                              <div className='date-wrapper'>
                                <p>{format(1689282111 * 1000, "yyyy-MM-dd HH:mm")}</p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p>Sell</p>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src={'/icons/social-icon-4_white.svg'} alt={''} />
                                <p>3.0M</p>
                              </div>
                            </td>
                            <td>
                              <p>02</p>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src='/profile.png' onClick={() => window.open(`/profile/`)} alt={''} />
                                <p>Hey Toys</p>
                              </div>
                            </td>
                            <td>
                              <div className='price-wrapper'>
                                <img src='/profile.png' onClick={() => window.open(`/profile/`)} alt={''} />
                                <p>Unknown</p>
                              </div>
                            </td>
                            <td>
                              <div className='date-wrapper'>
                                <p>{format(1689282111 * 1000, "yyyy-MM-dd HH:mm")}</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                </>
              }


            </div>
          </div>
        </InfiniteScroll>
      }
      <Footer />

      <ModalReport
        onReport={onReport}
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal} />
      <ModalSubscribe
        onSubscribe={onSubscribe}
        coinPrice={collectionInfo?.coinPrice}
        showSubscribeModal={showSubscribeModal}
        setShowSubscribeModal={setShowSubscribeModal} />
    </>
  );

}

export default Collection;