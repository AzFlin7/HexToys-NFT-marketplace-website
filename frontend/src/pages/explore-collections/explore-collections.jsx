import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../header/header';
import Footer from '../footer/footer';
import './explore_collection.scss';
import { useLoader } from '../../context/useLoader'
import { Helmet } from "react-helmet";
import ThemeContext from '../../context/ThemeContext';
import { useInterval } from "react-use";
import NewCollectionCard from '../../components/Cards/NewCollectionCard';
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Masonry from 'react-masonry-css';
import CollectionCard from "../../components/Cards/CollectionCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from '../../components/Widgets/CustomButton';
import { formatNum } from '../../utils';
import CustomCarousel from "../../components/Carousel/CustomCarousel";

function ExploreCollections(props) {

    const { theme } = useContext(ThemeContext)
    const breakpoint = {
        default: 5,
        1840: 5,
        1440: 5,
        1280: 4,
        1080: 3,
        768: 2,
        450: 2,
    };
    // var slide_settings = {
    //     infinite: false,
    //     dots: true,
    //     speed: 500,
    //     slidesToShow: 5,
    //     slidesToScroll: 1,
    //     responsive: [
    //         {
    //             breakpoint: 1280,
    //             settings: {
    //                 slidesToShow: 5,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1080,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 450,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // };
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    function fetchCategories() {
        axios.get(`${process.env.REACT_APP_API}/categories`)
            .then((res) => {
                if (res.data.status) {
                    setCategories(res.data.categories);
                }
            })
            .catch((err) => {
                // console.log("err: ", err.message);
                setCategories([]);
            });
    }

    const [collections, setCollectioins] = useState([]);

    const [page, setPage] = useState(1);
    const [noCollectioins, setNoCollectioins] = useState(false);
    const [initialCollectioinsLoaded, setInitialCollectioinsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newCollections, setNewCollections] = useState([]);
    const [newCollectionCards, setNewCollectionCards] = useState([]);
    const [recentNFTSlideIndex, setRecentNFTSlideIndex] = useState(0);

    const [topCollections, setTopCollections] = useState([]);
    const [topCollectionCards, setTopCollectionCards] = useState([]);    
    const [topCollectionSlideIndex, setTopCollectionSlideIndex] = useState(0);

    const [overView, setOverView] = useState(null);
    useEffect(() => {
        setCollectioins([]);
        setNoCollectioins(false)
        setInitialCollectioinsLoaded(false);
        setLoading(true);
        setPage(1);
        fetchCollectioins(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps   		   
    }, [category])

    useEffect(() => {
        setLoading(true)
        if (initialCollectioinsLoaded) {
            fetchCollectioins(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchCollectioins(reset) {
        let paramData = {};
        if (category) {
            paramData.category = category;
        }
        if (reset) {
            paramData.page = 1;
        } else {
            paramData.page = page;
        }

        axios.get(`${process.env.REACT_APP_API}/collection`, {
            params: paramData
        })
            .then(res => {
                setLoading(false);
                if (res.data.status) {
                    if (res.data.collections.length === 0) setNoCollectioins(true)
                    if (reset) {
                        setCollectioins(res.data.collections)
                        setInitialCollectioinsLoaded(true)
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(collections))
                        prevArray.push(...res.data.collections)
                        setCollectioins(prevArray)
                    }
                }
            })
            .catch(err => {
                setLoading(false)
                // console.log(err)
                setNoCollectioins(true)
            })
    }

    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) })
        }
    }
    const [setPageLoading, setMessage] = useLoader()
    useEffect(() => {
        setMessage('')
        setPageLoading(!noCollectioins && collections.length === 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections, noCollectioins])

    // const goToNextRecentNFT = () => {
    //     let newIndex = recentNFTSlideIndex + 1;
    //     setRecentNFTSlideIndex(newIndex);
    // }

    // const goToPrevRecentNFT = () => {
    //     let newIndex = recentNFTSlideIndex - 1;
    //     setRecentNFTSlideIndex(newIndex);
    // }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/top_selling_collection`)
            .then(res => {
                if (res.data.status) {
                    setTopCollections(res.data.collections);
                    let collections = res.data.collections;
                    let results = [];
                    for (let i = 0; i < collections.length; i++) {
                        if(i < 5){
                            results.push({
                                key: i,
                                content: <NewCollectionCard key={i} collection={collections[i]} />
                            })
                        }
                    }                             
                    setTopCollectionCards(results)
                }
            })
            .catch(err => {
                setTopCollections([]);                
            })

        axios.get(`${process.env.REACT_APP_API}/overview`)
            .then(res => {
                if (res.data.status) {
                    setOverView(res.data.overview);
                } else {
                    setOverView(null);
                }
            })
            .catch(err => {
                setOverView(null);
            })

        axios.get(`${process.env.REACT_APP_API}/new_collection`)
            .then(res => {
                if (res.data.status) {
                    setNewCollections(res.data.collections);
                    let collections = res.data.collections;
                    let results = [];
                    for (let i = 0; i < collections.length; i++) {
                        if(i < 5){
                            results.push({
                                key: i,
                                content: <NewCollectionCard key={i} collection={collections[i]} />
                            })
                        }
                    }
                    setNewCollectionCards(results);
                }
            })
            .catch(err => {
                setNewCollections([]);
                setNewCollectionCards([]);
            })
    }, [])
    useInterval(() => {
        if (topCollections.length > 0) {
            let newIndex = topCollectionSlideIndex + 1;
            setTopCollectionSlideIndex(newIndex);
        }
        if (newCollectionCards.length > 0) {
            let newIndex = recentNFTSlideIndex + 1;
            setRecentNFTSlideIndex(newIndex);
        }
    }, 3000)

    return (
        <>
            <Helmet>
                <title>HEX TOYS - Collections | NFT Marketplace on PulseChain</title>
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" name="title" />
                <meta content="Explore the diverse collections of unique digital collectibles on HEX TOYS. Buy, sell, and trade NFTs from various creators." name="description" />
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" name="twitter:title" />
                <meta content="https://marketplace.hex.toys/explore-collections" name="twitter:url" />
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" property="og:title" />
                <meta content="Explore the diverse collections of unique digital collectibles on HEX TOYS. Buy, sell, and trade NFTs from various creators." property="og:description" />
                <meta content="https://marketplace.hex.toys/explore-collections" property="og:url" />
                <meta name="keywords" content="HEX TOYS, Collections, NFT marketplace, PulseChain, buy NFTs, sell NFTs, digital collectibles" />
            </Helmet>

            <Header {...props} />
            <div className='explore_collection'>

                {/* <div className='container'>
                    <div className={`effect1 effect_${theme}`}></div>
                    {topCollections && topCollections.length > 0 && (
                        <>
                            <div className='title'>
                                <h1 className={`text_color_gradient`}>Top Selling Collections</h1>
                            </div>
                            <div className="carousel-container">
                                <div className='wrapper carousel-wrapper'>
                                    <Slider {...slide_settings}>
                                        {topCollections.map((item, k) => (
                                            <CollectionCard collection={item} key={k} />
                                        ))}

                                    </Slider>
                                </div>

                            </div>
                        </>
                    )
                    }
                </div> */}

                {
                    topCollections && topCollections.length > 0 && (
                        <div className='container'>
                            <div className='title'>
                                <h1 className={`text_color_gradient_${theme}`}>Top Selling Collections</h1>
                            </div>
                            <div className={`effect effect_${theme}`}></div>
                            <div className="carousel-container">
                                <div className="wrapper carousel-wrapper min-500">
                                    <CustomCarousel items={topCollectionCards} />
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    newCollections && newCollections.length > 0 && (
                        <div className='container'>
                            <div className='title'>
                                <h1 className={`text_color_gradient_${theme}`}>New Collections</h1>
                            </div>
                            <div className={`effect effect_${theme}`}></div>
                            <div className="carousel-container">
                                <div className="wrapper carousel-wrapper min-500">
                                    <CustomCarousel items={newCollectionCards} />
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    overView &&
                    <div className="state_div">
                        <div className="state_item">
                            <h3>{overView.collectionCount}</h3>
                            <p>Total Collections</p>
                        </div>
                        <div className="state_item">
                            <h3>{formatNum(overView.itemCount)}</h3>
                            <p>Total Items</p>
                        </div>
                        <div className="state_item">
                            <h3>{overView.userCount}</h3>
                            <p>Total Users</p>
                        </div>
                        <div className="state_item">
                            <h3>{formatNum(overView.tradingVolume/overView.coinPrice)} PLS</h3>
                            <p>Trading Volume</p>
                        </div>
                        <div className="state_item">
                            <h3>{formatNum((overView.tradingVolume/overView.tradingCount)/overView.coinPrice)} PLS</h3>
                            <p>Floor Price</p>
                        </div>
                        <div className="state_item">
                            <h3>{formatNum(overView.gasUsed)} PLS</h3>
                            <p>PLS Burned</p>
                        </div>
                    </div>
                }
                <div className='container'>
                    <div className='title'>
                        <h1 className={`text_color_gradient_${theme}`}>Explore Collections</h1>
                    </div>
                    <div className="tab_list">
                        <Button label='All' outlineBtn={category !== ''} outlineBtnColor={category === ''} size='sm' onClick={() => setCategory('')} />
                        {categories.map((categoryItem, index) => {
                            return (
                                <Button key={index} label={categoryItem.name} outlineBtn={category !== categoryItem.name} outlineBtnColor={category === categoryItem.name} size='sm' onClick={() => setCategory(categoryItem.name)} />
                            );
                        })
                        }
                    </div>
                    <div className="tab_content">
                        <InfiniteScroll
                            dataLength={collections.length} //This is important field to render the next data
                            next={loadMore}
                            hasMore={!noCollectioins}
                            scrollThreshold={0.7}
                        >
                            <Masonry
                                breakpointCols={breakpoint}
                                className={'masonry'}
                                columnClassName={'gridColumn'}
                            >
                                {collections.map((collectionItem, index) => (
                                    <CollectionCard key={index} {...props} collection={collectionItem} />
                                ))}
                            </Masonry>
                        </InfiniteScroll>
                    </div>
                </div>

                
            </div>
            <Footer />
        </>
    );

}

export default ExploreCollections;
