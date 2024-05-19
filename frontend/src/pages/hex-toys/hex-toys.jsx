import { Helmet } from "react-helmet";
import Header from "../header/header";
import Footer from "../footer/footer";
import './style.scss';
import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import axios from "axios";
import { useLoader } from "../../context/useLoader";
import { formatNum } from "../../utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import RecentNFTCard from "../../components/Cards/RecentNFTCard";
import Masonry from "react-masonry-css";
import ExclusiveCard from "../../components/Cards/ExclusiveCard";
import RecentActivityTable from "../../components/RecentActivityTable/RecentActivityTable";
import CustomCarousel from "../../components/Carousel/CustomCarousel";

import hex_toy_background from "../../assets/images/HEX_Toys_6_Seconds_YouTube_Intro_60_V1.mp4";

ChartJS.register(ArcElement, Tooltip, Legend);

const HexToys = (props) => {
    const { connectAccount } = props;
    const { theme } = useContext(ThemeContext);
    const [setPageLoading] = useLoader();

    const [collectionInfo, setCollectionInfo] = useState(null);
    const [recentNFTs, setRecentNFTs] = useState([]);
    const [recentNFTCards, setRecentNFTCards] = useState([]);
    const [exclusiveItems, setExclusiveItems] = useState([]);
    const [featuredCollections, setFeaturedCollections] = useState([]);

    const [events, setEvents] = useState([]);

    const breakpoint = {
        default: 4,
        1840: 4,
        1440: 4,
        1280: 4,
        1080: 3,
        768: 2,
        450: 2,
    };

    useEffect(async () => {
        setPageLoading(true);
        await loadCollectionInfo();
        await loadFeaturedCollections();
        await loadResentSold();
        await loadExclusiveItems();
        await loadEvents();
    }, [])


    const loadCollectionInfo = async () => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/collection/detail?address=${process.env.REACT_APP_HEXTOYS_ADDRESS}`);
            if (res.data.status) {
                setPageLoading(false);
                setCollectionInfo(res.data.collection);
            }
        } catch (e) {
            setPageLoading(false);
            setCollectionInfo(null);
        }
    }
    const loadFeaturedCollections = async () => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/featured_collections`);
            setPageLoading(false);
            if (res.data.status) {
                setFeaturedCollections(res.data.collections);
            }
        } catch (e) {
            setPageLoading(false);
            setFeaturedCollections([]);
        }
    }
    const loadResentSold = async () => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/recently_sold?collection=${process.env.REACT_APP_HEXTOYS_ADDRESS}`);
            setPageLoading(false);
            if (res.data.status) {
                setPageLoading(false);
                setRecentNFTs(res.data.items);
                let items = res.data.items;
                let results = [];
                for (let i = 0; i < items.length; i++) {
                    if (i < 5) {
                        results.push({
                            key: i,
                            content: <RecentNFTCard key={i} item={items[i]} />
                        })
                    }
                }
                setRecentNFTCards(results);
            }
        } catch (e) {
            setPageLoading(false);
            setRecentNFTs([]);
            setRecentNFTCards([]);
        }
    }
    const loadEvents = async () => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/activities?itemCollection=${process.env.REACT_APP_HEXTOYS_ADDRESS}&limit=20`);
            setPageLoading(false);
            if (res.data.status) {
                setPageLoading(false);
                setEvents(res.data.events);                
            }
        } catch (e) {
            setPageLoading(false);
            setEvents([]);        
        }
    }

    const loadExclusiveItems = async () => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/exclusive_items?collection=${process.env.REACT_APP_HEXTOYS_ADDRESS}`);
            setPageLoading(false);
            if (res.data.status) {
                setExclusiveItems(res.data.items);
            }
        } catch (e) {
            setPageLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>HEX TOYS - The Ultimate NFT Marketplace on PulseChain</title>
                <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="title" />
                <meta
                    content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles."
                    name="description" />
                <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="twitter:title" />
                <meta content="https://marketplace.hex.toys" name="twitter:url" />
                <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" property="og:title" />
                <meta
                    content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles."
                    property="og:description" />
                <meta content="https://marketplace.hex.toys" property="og:url" />
                <meta content="HEX TOYS, NFT marketplace, PulseChain, digital collectibles, buy NFTs, sell NFTs"
                    name="keywords" />
            </Helmet>
            <Header {...props} />

            <div className="hex-toys-page">
                <div className='top-home'>
                    <div className='banner'>
                        <div className='banner-container'>
                            <div className='background-container'>
                            <video src={hex_toy_background} autoPlay muted loop playsInline controls = {false} allowFullScreen = {false}/>
                            </div>
                            
                        </div>
                        {/* <Slider {...banner_settings}> */}
                           
                            {/* pulse kitten collection */}
                            {/* {
                                featuredCollections && featuredCollections.length > 0 && featuredCollections.filter(collection => collection.address === '0x7896814143a2e8b86d58e702a072a3e2c8937d75') &&
                                <div className='banner-container'>
                                    <div className='background-container'>
                                    <video src={hex_toy_background} autoPlay muted loop playsInline controls = {false} allowFullScreen = {false}/>
                                    </div>
                                    
                                </div>
                            } */}

                            {/* PulsePhunks collection */}
                            {/* {
                                featuredCollections && featuredCollections.length > 0 && featuredCollections.filter(collection => collection.address === '0x7593b3521bf263817d8447480960aac73d854a7d') &&
                                <div className='banner-container'>
                                    <div className='background-container opaciy-60'>
                                    <video src={pulsephunks_background} autoPlay muted loop playsInline controls = {false} allowFullScreen = {false}/>
                                    </div>
                                    <div className='flex bg_1'>
                                    <div className='left-con'>
                                        <VideoImageContentCard url={featuredCollections.filter(collection => collection.address === '0x7593b3521bf263817d8447480960aac73d854a7d')[0].image} type='image' />
                                    </div>
                                    <div className='right-con'>
                                        <h1>{featuredCollections.filter(collection => collection.address === '0x7593b3521bf263817d8447480960aac73d854a7d')[0].name}</h1>
                                        <p className={clsx('subtitle', `text_color_2_${theme}`)}>{featuredCollections.filter(collection => collection.address === '0x7593b3521bf263817d8447480960aac73d854a7d')[0].description} </p>
                                        <Button href={`/collection/0x7593b3521bf263817d8447480960aac73d854a7d`} label='View Collection' roundFull fillBtn />
                                    </div>
                                    </div>
                                </div>
                            } */}

                            {/* PulsePunks collection */}
                            {/* {
                                featuredCollections && featuredCollections.length > 0 && featuredCollections.filter(collection => collection.address === '0xf886f928e317cfd4085137a7a755c23d87f81908') &&
                                <div className='banner-container'>
                                    <div className='background-container opaciy-60'>
                                    <video src={pulsepunks_background} autoPlay muted loop playsInline controls = {false} allowFullScreen = {false} />
                                    </div>
                                    <div className='flex bg_2'>
                                    <div className='left-con'>
                                        <VideoImageContentCard url={featuredCollections.filter(collection => collection.address === '0xf886f928e317cfd4085137a7a755c23d87f81908')[0].image} type='image' />
                                    </div>
                                    <div className='right-con'>
                                        <h1>{featuredCollections.filter(collection => collection.address === '0xf886f928e317cfd4085137a7a755c23d87f81908')[0].name}</h1>
                                        <p className={clsx('subtitle', `text_color_2_${theme}`)}>{featuredCollections.filter(collection => collection.address === '0xf886f928e317cfd4085137a7a755c23d87f81908')[0].description} </p>
                                        <Button href={`/collection/0xf886f928e317cfd4085137a7a755c23d87f81908`} label='View Collection' roundFull fillBtn />
                                    </div>
                                    </div>
                                </div>
                            }   */}
                        {/* </Slider> */}
                    </div>
                </div>

                {
                    collectionInfo &&
                    <div className="collection-infos-container">
                        <div className="state_div">
                            <div className="state_item">
                                <h3>{formatNum(collectionInfo.tradingVolume / collectionInfo.coinPrice)} PLS</h3>
                                <p>Total Volume</p>
                            </div>
                            <div className="state_item">
                                <h3>{formatNum((collectionInfo.tradingCount > 0 ? collectionInfo.tradingVolume / collectionInfo.tradingCount : 0) / collectionInfo.coinPrice)} PLS</h3>
                                <p>Floor Price</p>
                            </div>
                            <div className="state_item">
                                <h3>{formatNum(collectionInfo.highestSale / collectionInfo.coinPrice)} PLS</h3>
                                <p>Highest Sale</p>
                            </div>
                            <div className="state_item">
                                <h3>{collectionInfo.totalItemCount}</h3>
                                <p>Items</p>
                            </div>
                            <div className="state_item">
                                <h3>{collectionInfo.totalOwners}</h3>
                                <p>Owners</p>
                            </div>
                        </div>
                    </div>
                }

                {/* <div className={"chart-container " + theme}>
                    <div className={"chart-box " + theme}>
                        <div className="row">
                            <div className="col-6 mining-chart">
                                <div className={"legend-box " + theme}>
                                    <div>
                                        <p><div className="color-label pulsechain"></div> <b>11%</b>&nbsp; PulseChain </p>
                                        <p><div className="color-label ethereum"></div> <b>39%</b>&nbsp; Ethereum </p>
                                        <p><div className="color-label remaining"></div> <b>50%</b>&nbsp; Remaining </p>
                                    </div>
                                </div>
                                <div className="chart">
                                    <Doughnut data={chartData} options={options}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <SemiSlider value={72}/>

                                <div className={"slider-info " + theme}>
                                    <div className="info-item" style={{textAlign: 'left'}}>
                                        <p className="top">Total</p>
                                        <p className="bottom">30,000</p>
                                    </div>
                                    <div className="info-item" style={{textAlign: 'right'}}>
                                        <p className="top">Remaining</p>
                                        <p className="bottom">8,809</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            !account && (
                                <div className={"btn-container"}>
                                    <button className="btn-connect" onClick={connectAccount}>Connect Wallet</button>
                                </div>
                            )
                        }
                    </div>
                </div> */}

                {/* Recently Sold */}
                <div className="home">
                    <div className="full_contaniner">
                        {recentNFTs && recentNFTs.length > 0 && (
                            <>
                                <h2 className={`section_title text_color_gradient_${theme}`}>Recently Sold</h2>
                                <div className="carousel-container">
                                    <CustomCarousel items={recentNFTCards} />
                                </div>
                            </>
                        )}
                        <div className={`effect effect_${theme}`}></div>
                    </div>
                </div>

                {
                    exclusiveItems.length > 0 && (
                        <div className='collection-container'>
                            <div className='title'>
                                <h1 className={`text_color_gradient_${theme}`}>Exclusive HEX TOYS Series</h1>
                            </div>
                            <div className="tab_content">
                                <Masonry
                                    breakpointCols={breakpoint}
                                    className={'masonry'}
                                    columnClassName={'gridColumn'}
                                >
                                    {exclusiveItems.map((item, index) => (
                                        <ExclusiveCard key={index} {...props} item={item} />
                                    ))}
                                </Masonry>
                            </div>
                        </div>
                    )
                }

                <div className="recent-activity-table">
                    <RecentActivityTable events={events}/>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default HexToys;