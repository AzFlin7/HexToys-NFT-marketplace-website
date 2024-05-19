import React, { useState, useContext, useEffect, useRef } from 'react';
import { useActiveWeb3React } from "../../hooks";
import { Link, useLocation, useParams } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import { Dropdown } from "antd";
import SearchDrop from "../../components/Search/SearchDrop";

import { connectorLocalStorageKey } from "../../utils/connectors"
import "./header.scss";
import clsx from 'clsx';
import ThemeContext from '../../context/ThemeContext';
import MySelect from '../../components/Widgets/MySelect';
import NavButton from '../../components/Widgets/NavButton';
import Button from '../../components/Widgets/CustomButton';

import Logo_White from "../../assets/images/logo_white.png";
import Logo_Black from "../../assets/images/logo_black.png";
import menuicon_black from "../../assets/images/icons/icon-hamburger-menu.svg";
import menuicon from "../../assets/images/icons/icon-hamburger-menu_01.svg";
import messageiconBlack from "../../assets/images/icons/icon_message_alrt_black.svg";
import messageiconWhite from "../../assets/images/icons/icon_message_alrt.svg";
import curticonBlack from "../../assets/images/icons/icon_curt_black.svg";
import curticonWhite from "../../assets/images/icons/icon_curt.svg";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';

import { getUser, setUserByFetch, setAccount, getAccount } from "../../store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
// import styled from "styled-components";
import { Box, styled } from '@mui/material';
import { AddCircle } from '@styled-icons/material';


function Header(props) {
  const usetheme = useTheme();
  const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
  const [pricesData, setPricesData] = useState({})
  const userProfile = useSelector(getUser);
  const userAccount = useSelector(getAccount);
  const dispatch = useDispatch();
  const { theme, setTheme } = useContext(ThemeContext)
  const { connectAccount } = props;
  const { account, deactivate } = useActiveWeb3React();
  useEffect(() => {
    if (account) {
      if (!userProfile || userAccount !== account) {
        dispatch(setUserByFetch(account));
        dispatch(setAccount(account));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const [navId, setNavId] = useState('');
  const { id } = useParams();
  const search = useLocation();
  useEffect(() => {
    const path = search.pathname.replace('/', '');
    setNavId(path);
  }, [search]);


  const [searchTxt, setSearchTxt] = useState("");
  const [searchKey, setSearchKey] = useState('');
  const searchDrop = <SearchDrop searchTxt={searchKey} />;

  function signOut() {
    deactivate();
    window.localStorage.setItem(connectorLocalStorageKey, "");
  }
  function connectWallet() {
    // connect account
    closeMenu();
    connectAccount();
  }

  function disConnectWallet() {
    // disconnect account
    closeMenu();
    signOut();
  }

  function openMenu() {
    var element = document.getElementById('menuExp');
    element.classList.add('menu-open');
  }
  function closeMenu() {
    var element = document.getElementById('menuExp');
    element.classList.remove('menu-open');
  }

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    var element = document.getElementById('searchExp');
    if (showSearch === true) {
      element.classList.add('show-search');
    } else {
      element.classList.remove('show-search');
    }
  }, [showSearch]);

  const color_option = [
    { label: <><i className="fas fa-moon" /> Dark</>, value: 'dark' },
    { label: <><i className="fas fa-sun" /> Light</>, value: 'light' }
  ]
  const explore_option = [
    { label: "Collections", url: '/explore-collections' },
    { label: "NFTs", url: '/explore-items' },
    { label: "Leader Board", url: '/leaderboard' },
    { label: "HEX TOYS", url: '/hex-toys', class: 'specific-menu' },
    { label: "Hypercubes", url: '/mysteryboxes', },

  ]
  const create_option = [
    { label: "Single", url: '/create-single' },
    { label: "Multiple", url: '/create-multiple' }
  ]

  const user_option = [
    {
      label: <><img src={userProfile?.lowLogo || 'https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67'}
        alt="userpicture" style={{ width: 18, height: 18, borderRadius: 24 }} /> View Profile</>, url: `/profile/${account}`
    },
    { label: <><i className="fas fa-edit"></i> Edit Profile</>, url: '/edit_profile' },
    { label: <><i className="fas fa-sign-out-alt"></i> Disconnect</>, url: '#' }
  ]

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchKey(searchTxt);
    }
  }

  const moveLeftRef = useRef(true)
  const increaseRef = useRef(null)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  const getPrices = async () => {
    const prices = await (await fetch('https://v.gopulse.com/api/prices')).json()
    const response = await (await fetch('https://v.gopulse.com/api')).json()
    const changes = {
      hexChange: response?.HEX?.timed?.priceChange?.h24,
      incChange: response?.INC?.timed?.priceChange?.h24,
      plsChange: response?.PLS?.timed?.priceChange?.h24,
      plsxChange: response?.PLSX?.timed?.priceChange?.h24,
    }
    const data = {
      prices, changes
    }
    if (data) setPricesData(data)
  }

  useEffect(() => {
    getPrices()
  }, [])


  const TopBannerContainer = styled('div')`
    height: fit-content;
    min-height: 61px;
    width: 100%;
    border-bottom: 1px solid ${props => props.isDark ? '#383943' : '#e2e2e2'};
    background: ${props => props.isDark ? '#2a2f36' : 'white'};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 10%;
    @media screen and (max-width: 900px) {
      padding: 0px 5%;
    }
    @media screen and (max-width: 852px) {
      padding: 0px 20px;
    }
    @media screen and (max-width: 577px) {
      padding: 0px 10px;
    }
    max-width: 100%;
  `;

  const SubContainer = styled('div')`
    display: flex;
    width: 100%;
    max-width: 100%;
    gap: 20px;
    margin-top: 6px;
    margin-bottom: 6px;
    justify-content: space-between;
    ::-webkit-scrollbar {
      display: none;
    }
    overflow-x: auto;
    white-space: nowrap;
    @media screen and (max-width: 853px) {
      width: 100%;
      gap: 45px;
    }
  `;
  const Flex = styled('div')`
    display: flex;
    width: max-content;
    align-items: center;
    justify-content: center;
    width: ${props => props.full === true ? '100%' : ''};;
  `
  const Text = styled('div')`
    width: 100%;
    margin-left: ${props => props.ml};
    margin-right: ${props => props.mr};
    font-size: ${props => props.fontSize}px;
    text-align: center;
    color: ${props => props.color};
    font-weight: ${props => props.bold ? '600' : '400'};
  `
  const BuyPlusGradientButton = styled('button')`
    padding: 0;
    background: linear-gradient(90deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);
    width: 100%;
    justify-content: center;
    color: black;
    padding: 6px 16px;
    align-items: center;
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    border-radius: 100px;
    border: 0px;
    cursor: pointer;
    &:hover {
      opacity: 0.75;
    }
  `;
  return (
    <div className={clsx('header_container')}>
      <TopBannerContainer isDark={theme === 'dark'}>
        <SubContainer ref={increaseRef}>
          <Box display={['flex', 'flex', 'flex', 'block', 'block']}>
            <Flex alignItems="center" width="max-content">
              <img src="/assets/icons/pls-icon.png" width="24" alt="hex" />
              <Text fontSize={15} bold color={theme === 'dark' ? 'white' : 'black'} ml="4px" mr="2px">${pricesData?.prices?.PLS}</Text>
              <Text color={theme === 'dark' ? '#9b9ca1' : '#666'} fontSize={15} bold>PLS</Text>
            </Flex>
            <Flex full alignItems="center" justifyContent="center" marginLeft="4px">
              <Text color={pricesData?.changes?.plsChange > 0 ? '#27ae60' : '#EA4242'} fontSize={15} textAlign="center">
                {pricesData?.changes?.plsChange}%
              </Text>
            </Flex>
          </Box>
          <Box display={['flex', 'flex', 'flex', 'block', 'block']}>
            <Flex alignItems="center" width="max-content">
              <img src="/assets/icons/hex-icon.png" alt="hex" />
              <Text fontSize={15} bold color={theme === 'dark' ? 'white' : 'black'} ml="4px" mr="2px">${pricesData?.prices?.HEX}</Text>
              <Text color={theme === 'dark' ? '#9b9ca1' : '#666'} fontSize={15} bold>HEX</Text>
            </Flex>
            <Flex full alignItems="center" justifyContent="center" marginLeft="4px">
              <Text color={pricesData?.changes?.hexChange > 0 ? '#27ae60' : '#EA4242'} fontSize={15} textAlign="center">
                {pricesData?.changes?.hexChange}%
              </Text>
            </Flex>
          </Box>
          <Box display={['flex', 'flex', 'flex', 'block', 'block']}>
            <Flex alignItems="center" width="max-content">
              <img src="/assets/icons/plsx-icon.png" alt="hex" />
              <Text fontSize={15} bold color={theme === 'dark' ? 'white' : 'black'} ml="4px" mr="2px">${pricesData?.prices?.PLSX}</Text>
              <Text color={theme === 'dark' ? '#9b9ca1' : '#666'} fontSize={15} bold>PLSX</Text>
            </Flex>
            <Flex full alignItems="center" justifyContent="center" marginLeft="4px">
              <Text color={pricesData?.changes?.plsxChange > 0 ? '#27ae60' : '#EA4242'} fontSize={15} textAlign="center">
                {pricesData?.changes?.plsxChange}%
              </Text>
            </Flex>
          </Box>
          <Box display={['flex', 'flex', 'flex', 'block', 'block']}>
            <Flex alignItems="center" width="max-content">
              <img src="/assets/icons/inc-icon.png" alt="hex" />
              <Text fontSize={15} bold color={theme === 'dark' ? 'white' : 'black'} ml="4px" mr="2px">${pricesData?.prices?.INC}</Text>
              <Text color={theme === 'dark' ? '#9b9ca1' : '#666'} fontSize={15} bold>INC</Text>
            </Flex>
            <Flex full alignItems="center" justifyContent="center" marginLeft="4px">
              <Text color={pricesData?.changes?.incChange > 0 ? '#27ae60' : '#EA4242'} fontSize={15} textAlign="center">
                {pricesData?.changes?.incChange}%
              </Text>
            </Flex>
          </Box>
        </SubContainer>
      </TopBannerContainer>
      <div className={clsx('header_bar', theme, showSearch === true ? 'expand' : '')}>

        <div className='container'>
          <div className={clsx('wrapper')}>
            <div className='row'>
              <Link to="/">
                <div className='img-content'>
                  {theme === 'dark' ? <img src={Logo_White} alt='' /> : <img src={Logo_Black} alt='' />}
                </div>
              </Link>
              <div className="menu_list" id='menuExp'>
                <div className="closeContainer">
                  <CloseIcon className="fa" fontSize="small" onClick={() => { closeMenu() }} />
                </div>
                <NavButton
                  label='Store'
                  url='https://store.hex.toys/'
                  external
                />
                <NavButton
                  label='Explore'
                  isMenu
                  menuList={explore_option}
                  isActive={navId.indexOf('explore') >= 0}
                />
                <Flex alignItems="center" width="110px" justifyContent='space-between'>
                  <BuyPlusGradientButton onClick={() => window.open(`http://howtobuypulse.com/`, '_blank')}>
                    <AddCircle width="18px" marginRight="4px" color="black" />
                    Buy PLS
                  </BuyPlusGradientButton>
                </Flex>
                {account &&
                  <>
                    {/* <NavButton 
                    label = 'Hypercubes' 
                    url = '/mysteryboxes' 
                    router
                    isActive = {navId.indexOf('mysteryboxes') >= 0}
                  /> */}

                    {/* <NavButton 
                    label = 'Create'
                    isMenu
                    menuList = {create_option}
                    isActive = {navId.indexOf('create') >= 0}
                  /> */}
                    <NavButton
                      label='Create'
                      url='/create'
                      router
                      isActive={navId.indexOf('create') >= 0}
                    />

                    <NavButton
                      label='Import'
                      url='/import'
                      router
                      isActive={navId.indexOf('import') >= 0}
                    />

                    <NavButton
                      label='My Items'
                      url={`/profile/${account}`}
                      router
                      isActive={navId.indexOf('profile') >= 0 && id === userAccount}
                    />
                  </>
                }
                <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'} />
              </div>

            </div>
            <div className="row">
              <button className={`search_btn text_color_1_${theme}`} onClick={() => setShowSearch(!showSearch)}><i className="fas fa-search"></i></button>
              <div className={`search_div ${showSearch ? 'show-search' : ''}`}>
                <Dropdown placement="bottom" overlay={searchDrop}>
                  <div className={`search`} id='searchExp'>
                    <input className={`bg_${theme} text_color_1_${theme}`} type="text" placeholder="Search for collections, NFTs or users" onChange={e => setSearchTxt(e.target.value)} onKeyPress={handleKeyPress} value={searchTxt} />
                    <button className={`bg_${theme} text_color_3_${theme}`} onClick={() => { setSearchKey(searchTxt); }}><i className="fas fa-search"></i></button>
                  </div>
                </Dropdown>
              </div>

            </div>
            <div className="row">
              <div className="btn_div">


                {account ?
                  <NavButton
                    label={<img src={userProfile?.lowLogo || 'https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67'}
                      alt="userpicture" />}
                    isMenu
                    menuList={user_option}
                    disconnect={disConnectWallet}
                  />
                  :
                  <Button label='Connect Wallet' onClick={connectWallet} roundFull fillBtn />

                }
                <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'} />
                {/* <NavButton
                label = {<img src={theme === 'dark' ? messageiconWhite : messageiconBlack} alt="" className='nav_icon' onClick = {() => window.open('https://chat.hex.toys/')}/>}
              /> */}
                <NavButton
                  label={<img src={theme === 'dark' ? curticonWhite : curticonBlack} alt="" className='nav_icon' />}
                />
                {theme === 'dark' ?
                  <img src={menuicon} className="fa" alt='' onClick={() => { openMenu() }} /> :
                  <img src={menuicon_black} className="fa" alt='' onClick={() => { openMenu() }} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
