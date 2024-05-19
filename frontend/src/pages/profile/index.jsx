/* eslint-disable no-fallthrough */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Querystring from "query-string";
import toast from 'react-hot-toast';
import { useLoader } from '../../context/useLoader'
import Expand from "react-expand-animated";
import { format } from "date-fns";
import { useActiveWeb3React } from "../../hooks";
import { shorter, NetworkParams, formatNum, getCurrencyInfoFromAddress } from "../../utils";
import './profile.scss';
import ThemeContext from '../../context/ThemeContext';

import Masonry from 'react-masonry-css';
import ItemCard from "../../components/Cards/ItemCard";
import CollectionCard from "../../components/Cards/CollectionCard";
import MySelect from '../../components/Widgets/MySelect';
import clsx from 'clsx';
import CopyIcon from "../../assets/images/icons/icon_copy.svg";
import CopyIcon_black from "../../assets/images/icons/icon_copy_black.svg";
import banditproofIcon from "../../assets/images/banditproof.png";
import socialImg4 from "../../assets/images/icons/social-icon-4_white.svg";
import more_icon from '../../assets/images/icons/icon_more.svg';
import more_icon_black from '../../assets/images/icons/icon_more_black.svg';
import unknownImg from "../../assets/images/unknown.jpg";
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import ActivityTable from "../../components/ActivityTable/ActivityTable";


import Header from '../header/header';
import Footer from '../footer/footer';
import Button from "../../components/Widgets/CustomButton";
import MyChart from "../../components/MyChart";
import { getUser, getAccount } from "../../store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useEnsName } from "wagmi";
import ModalFollow from "../../components/modals/modal-follow";

function Profile(props) {
  const { theme } = useContext(ThemeContext);
  const { account } = useActiveWeb3React();
  const userInfo = useSelector(getUser);
  const userAccount = useSelector(getAccount);

  const [userProfile, setUserProfile] = useState(null);
  const usetheme = useTheme();
  const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
  const breakpoint = {
    default: 4,
    1840: 4,
    1440: 4,
    1280: 3,
    768: 2,
    450: 2,
  };
  const styles = {
    open: { width: "100%" },
    close: { width: "100%" }
  };
  const transitions = ["height", "opacity", "background"];
  const [showFilter, setShowFilter] = useState(false);
  const [isExpandStatus, setIsExpandStatus] = useState(true);
  const [saleStatus, setSaleStatus] = useState(''); // owned, sale, created, liked

  const [isExpandItems, setIsExpandItems] = useState(true);

  function changeStatus(newStatus) {
    if (saleStatus === newStatus) {
      setSaleStatus('');
    } else {
      setSaleStatus(newStatus);
    }
  }

  let { id } = useParams();
  // const { account } = useActiveWeb3React();
  const ensName = useEnsName({ address: id })

  const [curTab, setCurTab] = useState('owned'); // owned, sale, liked

  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const typeOptions = [
    { label: 'All items', value: '' },
    { label: 'Single items', value: 'single' },
    { label: 'Multiple items', value: 'multi' },
  ];
  const [type, setType] = useState("");

  const sortOptions = [
    { label: 'Recently Listed', value: 'timestamp' },
    { label: 'Price: low to high', value: 'price1' },
    { label: 'Price: high to low', value: 'price2' },
    { label: 'Most Favorited', value: 'likeCount' },
    { label: 'Name', value: 'name' },
  ];
  const [sortBy, setSortBy] = useState("timestamp");

  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [noCollections, setNoCollections] = useState(false);
  const [initialCollectionsLoaded, setInitialCollectionsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setPageLoading] = useLoader();

  useEffect(() => {
    if (id) {
      // if (id !== userAccount) {
      //   loadUserInfo();
      // } else {
      //   setUserProfile(userInfo);
      // }
      loadUserInfo();
    }
    if ((curTab !== 'activity') && curTab !== 'metrics') {
      if (curTab === 'collections') {
        setCollections([]);
        setNoCollections(false)
        setInitialCollectionsLoaded(false);
        setPage(1);
        fetchCollections(true);
      } else {
        setItems([]);
        setNoItems(false)
        setInitialItemsLoaded(false);
        setPage(1);
        fetchItems(true);
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchKey, sortBy, curTab, type, saleStatus])

  useEffect(() => {
    if (initialItemsLoaded) {
      fetchItems(false);
    }
    if (initialCollectionsLoaded) {
      fetchCollections(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function loadUserInfo() {
    try {
      setPageLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_API}/user_info/${id}`);
      setPageLoading(false);
      if (res.data.status) {
        setUserProfile(res.data.user);
      }
    } catch (e) {
      setPageLoading(false);
    }
  }

  async function fetchItems(reset) {
    let paramData = { sortDir: 'desc' };

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
      paramData.searchTxt = searchKey;
    }
    if (type) {
      paramData.type = type;
    }
    if (saleStatus) {
      paramData.saleType = saleStatus
    }

    switch (curTab) {
      case 'owned':
        // Owned
        paramData.owner = id;
        break;
      case 'sale':
        // On sale
        paramData.owner = id;
        paramData.saleType = 'all';
        if (saleStatus === 'fixed') {
          paramData.saleType = 'fixed';
        } else if (saleStatus === 'auction') {
          paramData.saleType = 'auction';
        }
        break;
      case 'liked':
        // Liked
        paramData.likes = id;
        break;
      case 'airdrop':
        // airdrop
        paramData.owner = id;
        paramData.isETH = true;
      default:
        break;
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page;
    }

    try {
      setLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_API}/items`, { params: paramData });
      setLoading(false)
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

    } catch (e) {
      setLoading(false)
      // console.log(e)
      setNoItems(true)
    }
  }

  async function fetchCollections(reset) {
    let paramData = { owner: id };
    if (searchKey) {
      paramData.searchTxt = searchKey;
    }
    if (type) {
      paramData.type = type;
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page;
    }

    try {
      setLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_API}/collection`, { params: paramData });
      setLoading(false)
      if (res.data.status) {
        if (res.data.collections.length === 0) setNoCollections(true)
        if (reset) {
          setCollections(res.data.collections)
          setInitialCollectionsLoaded(true)
        } else {
          let prevArray = JSON.parse(JSON.stringify(collections))
          prevArray.push(...res.data.collections)
          setCollections(prevArray)
        }
      }

    } catch (e) {
      setLoading(false)
      // console.log(e)
      setNoCollections(true)
    }
  }

  function loadMore() {
    if (!loading) {
      setPage(page => { return (page + 1) })
    }
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchKey(searchTxt);
    }
  }

  const [isLoadingBanner, setIsLoadingBanner] = useState(true);


  // follow 
  const [isFollow, setIsFollow] = useState(false);
  useEffect(() => {
    if (id && account) {
      getIsFollow();
    }
  }, [id, account])
  function getIsFollow() {
    axios.get(`${process.env.REACT_APP_API}/user/following_status?from=${account}&to=${id}`)
      .then(res => {
        setIsFollow(res.data.following);
      })
      .catch(err => {
        setIsFollow(false);
      })
  }

  function clickFollow(toAddress) {
    if (account) {
      axios.post(`${process.env.REACT_APP_API}/user/follow`, Querystring.stringify({ from: account.toLowerCase(), to: toAddress.toLowerCase() }))
        .then(res => {
          loadUserInfo();
          getFollowers();
          getFollowing();
          getMyFollowing();
          getIsFollow();
        })
        .catch(err => {
          console.log('err', JSON.stringify(err));
        })
    }
  }

  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    if (id) {
      getFollowers();
    }
  }, [id])

  function getFollowers() {
    axios.get(`${process.env.REACT_APP_API}/user/get_followers?address=${id}&limit=1000`)
      .then(res => {
        setFollowers(res.data.users);
      })
      .catch(err => {
        setFollowers([]);
      })
  }


  const [following, setFollowing] = useState([]);
  useEffect(() => {
    if (id) {
      getFollowing();
    }
  }, [id])

  function getFollowing() {
    axios.get(`${process.env.REACT_APP_API}/user/get_following?address=${id}&limit=1000`)
      .then(res => {
        setFollowing(res.data.users);
      })
      .catch(err => {
        setFollowing([]);
      })
  }

  const [myFollowing, setMyFollowing] = useState([]);
  useEffect(() => {
    if (account) {
      getMyFollowing();
    }
  }, [account])

  function getMyFollowing() {
    axios.get(`${process.env.REACT_APP_API}/user/get_following?address=${account}&limit=1000`)
      .then(res => {
        setMyFollowing(res.data.users);
      })
      .catch(err => {
        setMyFollowing([]);
      })
  }

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);


  return (
    <>
      <Header {...props} />
      <div className="profile">
        <div className="banner">
          <div className="banner_content">
            {isLoadingBanner && <div className="background-cover"></div>}
            <div className="inner-wrap">
              <img src={userProfile?.bannerUrl || '/hextoysmarketplace.jpg'} alt="" onLoad={() => setIsLoadingBanner(false)} />
            </div>

          </div>
          <div className="content-box">
            <div className="row_div">
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div className="profile-box">
                  <img
                    className="profileimg"
                    src={userProfile && userProfile.mediumLogo ? userProfile.mediumLogo : "/profile.png"}
                    alt="ProfileImage"
                  />
                </div>
                {
                  account && (account.toLowerCase() !== id.toLowerCase()) &&
                  <Button label={isFollow ? "Unfollow" : "Follow"} size='sm' fillBtn onClick={() => clickFollow(id)} />
                }
              </div>

              <div className="badges_div">
                {
                  userProfile && userProfile.email &&
                  <a href={`mailto:${userProfile.email}`} target="_blank" rel="noreferrer"> <i className="fas fa-envelope"></i></a>
                }
                <a href={`https://banditproof.org/address/${id}?chainId=369`} target="_blank" rel="noreferrer">
                  <div className="img_div">
                    <img
                      className="profileimg"
                      src={banditproofIcon}
                      alt="banditproofIcon"
                    />
                  </div>
                </a>
                <a href="https://discord.gg/hextoys" target="_blank" rel="noreferrer" className={`text_color_1_${theme}`}>
                  <i className="fab fa-discord"></i>
                </a>
                {/* <a  href="https://www.instagram.com/hextoysofficial" target="_blank" rel="noreferrer">
                  
              <div className="img_div">
                <img src={socialImg1} alt=''/></div>
              </a> */}
                {/* <a  href="https://twitter.com/HEXTOYSOFFICIAL" target="_blank" rel="noreferrer">
              <div className="img_div"><img src={socialImg2} alt=''/></div>
              </a> */}

                {
                  userProfile && userProfile.instagram &&
                  <a href={userProfile.instagram} target="_blank" rel="noreferrer"> <i className="fab fa-instagram"></i></a>
                }
                <a href="https://t.me/hextoys" target="_blank" rel="noreferrer">
                  <div className="img_div"><i className="fab fa-telegram"></i></div>
                </a>
                {
                  userProfile && userProfile.twitter &&
                  <a href={userProfile.twitter} target="_blank" rel="noreferrer"> <i className="fab fa-twitter"></i> </a>
                }
                <a href="https://scan.pulsechain.com/token/0x158e02127C02Dce2a9277bdc9F1815C91F08E812/token-transfers" target="_blank" rel="noreferrer">
                  <div className="img_div"><img src={socialImg4} alt='' /></div>
                </a>
              </div>
            </div>
            <div className="row_div column">
              <div className="left">
                <div className="profile-box">
                  <div className="profileInfo-box">
                    <h1 className={`text_color_1_${theme}`}>{userProfile && userProfile.name ? userProfile.name : "NoName"}</h1>
                    <div className="pinId">
                      <p className={`text_color_4_${theme}`}>
                        Address :
                        <span className="uid text_color_gradient_1" onClick={() => window.open(`${NetworkParams.blockExplorerUrls[0]}/address/${id}`)}>{`${ensName?.data || shorter(id)}`}</span>
                        <span className="copy-button">
                          {theme === 'dark' ?
                            <img src={CopyIcon} alt="ProfileImage" onClick={() => copyToClipboard(id)} /> :
                            <img src={CopyIcon_black} alt="ProfileImage" onClick={() => copyToClipboard(id)} />
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="right">
                {
                  userProfile &&
                  <div className={`state_div  border_${theme}`}>
                    <div className="row_div" onClick={() => setShowFollowersModal(!showFollowersModal)}>
                      <p className={`text_color_4_${theme}`}>Followers</p>
                      <p className={`text_color_1_${theme}`}>{userProfile.followCount.follower}</p>
                    </div>
                    <div className={`row_div border_${theme}`} onClick={() => setShowFollowingModal(!showFollowingModal)}>
                      <p className={`text_color_4_${theme}`}>Following</p>
                      <p className={`text_color_1_${theme}`}>{userProfile.followCount.following}</p>
                    </div>
                    <div className="row_div">
                      <p className={`text_color_4_${theme}`}>Address</p>
                      <p className={`text_color_1_${theme}`}>{`${ensName?.data || shorter(id)}`}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
        <div className="container">
          <div className={`tab_list boder_color_${theme}`}>
            <div className={`tab text_color_4_${theme} ${curTab === 'owned' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('owned')}>Owned</div>
            <div className={`tab text_color_4_${theme} ${curTab === 'sale' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('sale')}>Sale</div>
            <div className={`tab text_color_4_${theme} ${curTab === 'liked' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('liked')}>Liked</div>
            <div className={`tab text_color_4_${theme} ${curTab === 'activity' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('activity')}>Activity</div>
            <div className={`tab text_color_4_${theme} ${curTab === 'metrics' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('metrics')}>Metrics</div>
            <div className={`tab text_color_4_${theme} ${curTab === 'collections' ? `active_tab_${theme}` : ''}`} onClick={() => setCurTab('collections')}>Collections</div>
            <Button label='Airdrop' size='sm' fillBtn roundFull onClick={() => setCurTab('airdrop')} />
          </div>
          {(curTab === 'owned' || curTab === 'liked' || curTab === 'sale' || curTab === 'airdrop' || curTab === 'collections') &&
            <div className="wrapper">
              <div className="left_div">
                <div className={`filter_label bg_${theme} text_color_1_${theme}`}>Filters</div>
                <div className={`filter_div bg_${theme}`}>
                  {/* sale status */}
                  {
                    curTab !== 'collections' &&
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
                          <button className={`filter_btn ${saleStatus === 'not_sale' ? 'active_btn' : ''} text_color_1_${theme}`} style={{ display: curTab === 'sale' ? 'none' : '' }} onClick={() => changeStatus('not_sale')}>Not for Sale</button>
                        </div>
                      </Expand>
                    </div>
                  }

                  {/* item type */}
                  <div className="row_div">
                    <button onClick={() => setIsExpandItems(!isExpandItems)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                      {type === '' ? 'All items' : type === 'single' ? 'Single items' : 'Multiple items'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandItems ? 0 : 180}deg)` }}></i>
                    </button>
                    <Expand
                      open={isExpandItems}
                      duration={300}
                      styles={styles}
                      transitions={transitions}
                    >
                      <div className="btn_list">
                        {typeOptions.map((d, k) => (
                          <button className={`filter_btn ${d.value === type ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => setType(d.value)} key={k}>{d.label}</button>
                        ))}

                      </div>
                    </Expand>
                  </div>

                </div>
              </div>
              <div className="right_div">
                <div className="filter_div">
                  <div className={`filter_label bg_${theme} text_color_1_${theme}`} onClick={() => { setShowFilter(true) }}>Filters</div>
                  <div className={`fiter_mob_div ${showFilter === true ? 'show_div' : ''} bg_${theme}`}>
                    <div className="content_div">
                      <div className={`close_btn text_color_1_${theme}`}>
                        <CloseIcon className="fa" fontSize="small" onClick={() => { setShowFilter(false) }} />
                      </div>
                      <div className={`col_div bg_${theme}`}>

                        {/* sale status */}
                        {
                          curTab !== 'collections' && <div className="row_div">
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
                                <button className={`filter_btn ${saleStatus === 'not_sale' ? 'active_btn' : ''} text_color_1_${theme}`} style={{ display: curTab === 'sale' ? 'none' : '' }} onClick={() => changeStatus('not_sale')}>Not for Sale</button>
                              </div>
                            </Expand>
                          </div>
                        }

                        {/* item type */}
                        <div className="row_div">
                          <button onClick={() => setIsExpandItems(!isExpandItems)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                            {type === '' ? 'All items' : type === 'single' ? 'Single items' : 'Multiple items'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandItems ? 0 : 180}deg)` }}></i>
                          </button>
                          <Expand
                            open={isExpandItems}
                            duration={300}
                            styles={styles}
                            transitions={transitions}
                          >
                            <div className="btn_list">
                              {typeOptions.map((d, k) => (
                                <button className={`filter_btn ${d.value === type ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => setType(d.value)} key={k}>{d.label}</button>
                              ))}

                            </div>
                          </Expand>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="search_div">
                    <button><i className="fas fa-search"></i></button>
                    <input type='text' placeholder="Search" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} className={`bg_${theme} text_color_1_${theme}`} onKeyPress={handleKeyPress} />

                  </div>
                  {
                    curTab !== 'collections' && <div className="myselect">
                      <MySelect
                        value={isMobileOrTablet ? '' : sortBy}
                        options={sortOptions}
                        onChange={setSortBy}
                        className={clsx('filter_select', 'light')}
                      />
                      <img src={theme === 'dark' ? more_icon : more_icon_black} alt="" className="mob_icon" />
                    </div>
                  }

                </div>
                <div className="tab_content">
                  <Masonry
                    breakpointCols={breakpoint}
                    className={'masonry'}
                    columnClassName={'gridColumn'}
                  >
                    {
                      curTab === 'collections' ?
                        collections.map((collection, index) => <CollectionCard key={index} {...props} collection={collection} />) :
                        items.map((item, index) => <ItemCard key={index} {...props} item={item} />)
                    }
                  </Masonry>
                  <div className="btn_div" style={{ display: noItems || noCollections ? "none" : "" }}>
                    <Button label={loading ? "Loading..." : "Load more"} outlineBtnColor onClick={() => loadMore()} />
                  </div>
                </div>
              </div>

            </div>}

          {(curTab === 'activity' || curTab === 'metrics') &&
            <div className="wrapper">
              {
                (curTab === 'activity') &&
                <div className="tab_content">
                  <ActivityTable baselink={`${process.env.REACT_APP_API}/activities?address=${id}`} />
                </div>
              }
              {(curTab === 'metrics') &&
                <div className="tab_content">
                  <div className="row_div">
                    <div className={`col_div border_color_${theme}`}>
                      <h5 className={`text_color_4_${theme}`}>Volume</h5>
                      <h4 className={`text_color_1_${theme}`}>{userProfile?.tradingInfo ? `${formatNum(userProfile?.tradingInfo?.tradingVolume / userProfile?.tradingInfo?.coinPrice)}` : `0.00`} PLS</h4>
                    </div>
                    <div className={`col_div border_color_${theme}`}>
                      <h5 className={`text_color_4_${theme}`}>Sales</h5>
                      <h4 className={`text_color_1_${theme}`}>{userProfile?.tradingInfo ? `${userProfile?.tradingInfo?.tradingCount}` : `00`}</h4>
                    </div>
                    <div className={`col_div border_color_${theme}`}>
                      <h5 className={`text_color_4_${theme}`}>Floor price</h5>
                      <h4 className={`text_color_1_${theme}`}>{userProfile?.tradingInfo ? `${formatNum((userProfile?.tradingInfo?.floorPrice) / userProfile?.tradingInfo?.coinPrice)}` : `0.00`} PLS</h4>
                    </div>
                  </div>
                  <h3 className={`sub_title text_color_1_${theme}`}>Price History</h3>
                  <div className="row_div">
                    <MyChart params={{
                      seller: id
                    }} />
                  </div>

                  <div className="row_div column">
                    {/* {
                      userProfile?.auctionInfo &&
                      <div className={`col_div border_color_${theme}`}>
                        <h4 className={`text_color_1_${theme}`}>Auction</h4>
                        <div className='activity-table-wrapper'>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <tbody>
                              <tr>
                                <td style={{ width: '60%' }}>
                                  <div className='price-wrapper'>
                                    <img src={userProfile?.auctionInfo?.itmeInfo?.image} alt={''} className="avatar_img" 
                                      onClick={() => window.open(`/detail/${userProfile?.auctionInfo?.itemCollection}/${userProfile?.auctionInfo?.tokenId}`, "_self")}/>
                                    <div className='name_div'>
                                      <h4 className={`text_color_1_${theme}`}>{userProfile?.auctionInfo?.itmeInfo?.name}</h4> 
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='name_div'>
                                    <h4 className={`text_color_1_${theme}`}>{formatNum(userProfile?.auctionInfo?.startPrice)} {getCurrencyInfoFromAddress(userProfile?.auctionInfo?.tokenAdr)?.symbol}</h4>
                                    <p className={`text_color_4_${theme}`}>{format(userProfile?.auctionInfo?.endTime * 1000, "yyyy-MM-dd HH:mm")}</p>       
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    } */}
                    {
                      userProfile?.pairInfo &&
                      <div className={`col_div border_color_${theme}`}>
                        <h4 className={`text_color_1_${theme}`}>Listing</h4>
                        <div className='activity-table-wrapper'>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <tbody>
                              <tr>
                                <td style={{ width: '60%' }}>
                                  <div className='price-wrapper'>
                                    <img src={(userProfile?.pairInfo?.itmeInfo.isThumbSynced ? userProfile?.pairInfo?.itmeInfo.lowLogo : userProfile?.pairInfo?.itmeInfo?.image) || unknownImg} alt={''} className="avatar_img"
                                      onClick={() => window.open(`/detail/${userProfile?.pairInfo?.itemCollection}/${userProfile?.pairInfo?.tokenId}`, "_self")} />
                                    <div className='name_div'>
                                      <h4 className={`text_color_1_${theme}`}>{userProfile?.pairInfo?.itmeInfo?.name}</h4>
                                      <p className={`text_color_4_${theme}`}>{format(userProfile?.pairInfo?.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='name_div'>
                                    <h4 className={`text_color_1_${theme}`}>{formatNum(userProfile?.pairInfo?.price)} {getCurrencyInfoFromAddress(userProfile?.pairInfo?.tokenAdr)?.symbol}</h4>
                                    <p className={`text_color_4_${theme}`}>{userProfile?.pairInfo?.balance} entities</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    }
                    {
                      userProfile?.soldInfo &&
                      <div className={`col_div border_color_${theme}`}>
                        <h4 className={`text_color_1_${theme}`}>Last Sold</h4>
                        <div className='activity-table-wrapper'>
                          <table className={`activity-table text_color_1_${theme}`}>
                            <tbody>
                              <tr>
                                <td style={{ width: '60%' }}>
                                  <div className='price-wrapper'>
                                    <img src={(userProfile?.soldInfo?.itmeInfo.isThumbSynced ? userProfile?.soldInfo?.itmeInfo.lowLogo : userProfile?.soldInfo?.itmeInfo.image) || unknownImg} alt={''} className="avatar_img"
                                      onClick={() => window.open(`/detail/${userProfile?.soldInfo?.itemCollection}/${userProfile?.soldInfo?.tokenId}`, "_self")} />
                                    <div className='name_div'>
                                      <h4 className={`text_color_1_${theme}`}>{userProfile?.soldInfo?.itmeInfo?.name}</h4>
                                      <p className={`text_color_4_${theme}`}>{format(userProfile?.soldInfo?.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='name_div'>
                                    <h4 className={`text_color_1_${theme}`}>{formatNum(userProfile?.soldInfo?.price)} {getCurrencyInfoFromAddress(userProfile?.soldInfo?.tokenAdr)?.symbol}</h4>
                                    <p className={`text_color_4_${theme}`}>{userProfile?.soldInfo?.amount} entities</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    }

                  </div>
                </div>}
            </div>}
        </div>
      </div>

      <ModalFollow
        title="Followers"
        users={followers}
        myFollowing={myFollowing}
        showModal={showFollowersModal}
        setShowModal={setShowFollowersModal}
        clickFollow={clickFollow}
      />

      <ModalFollow
        title="Following"
        users={following}
        myFollowing={myFollowing}
        showModal={showFollowingModal}
        setShowModal={setShowFollowingModal}
        clickFollow={clickFollow}
      />

      <Footer />
    </>
  );

}

export default Profile;
