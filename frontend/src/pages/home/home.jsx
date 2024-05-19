import { useState, useEffect, useContext, useRef } from 'react';
import { useActiveWeb3React } from "../../hooks";
import clsx from 'clsx';
import Header from '../header/header';
import "./home.scss";
import { useLoader } from '../../context/useLoader';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { getMintingInfo, claimNFT, toEth, onAddItem } from '../../utils/contracts';
import { useInterval } from "react-use";
import Footer from '../footer/footer';
import ThemeContext from '../../context/ThemeContext';
import VideoImageContentCard from '../../components/Cards/VideoImageContentCard';
import RecentNFTCard from '../../components/Cards/RecentNFTCard';
import BlogCard from "../../components/Cards/BlogCard";
import CollectionTable from '../../components/CollectionTable/CollectionTable';
import CountUp from "react-countup";

import Button from '../../components/Widgets/CustomButton';
import TopCollection3Card from '../../components/Cards/TopCollection3Card';



import dextoys_background from "../../assets/images/DEXTOYS.mp4";
import hextoys_background from "../../assets/images/hextoys_background.mp4";
import hexflex_heart_bg from "../../assets/images/hexflex_heart.png";
import hextoys_loading from "../../assets/images/hextoys_minting_now.gif";
import hextoys_15_background from "../../assets/images/15.mp4";
import hextoys_16_background from "../../assets/images/16.mp4";
import pulsekittens_background from "../../assets/images/pulsekittens_background.mp4";
import pulsephunks_background from "../../assets/images/pulsephunks_background.mp4";
import pulsepunks_background from "../../assets/images/pulsepunks_background.mp4";

import User from '../../assets/images/icons/icon_User.png';
import Collections from '../../assets/images/icons/icon_Artworks.png';
import Items from '../../assets/images/icons/icon_Artists.png';
import PLS from '../../assets/images/icons/icon_Wallet.png';
import CustomCarousel from "../../components/Carousel/CustomCarousel";
import { formatNum } from '../../utils';

function getStateValue(val) {
   if (val > 999999) {
      return (
         <>
            <CountUp duration={10} className="counter" end={parseInt(val / 1000000)} />.{(val / 1000000 - parseInt(val / 1000000)).toFixed(1).replace('0.', '')}M
         </>
      );
   }
   else {
      if (val > 999) {
         return (
            <>
               <CountUp duration={10} className="counter" end={parseInt(val / 1000)} />.{(val / 1000 - parseInt(val / 1000)).toFixed(1).replace('0.', '')}K
            </>
         );
      }
      else {
         return (
            <>
               <CountUp duration={10} className="counter" end={val} />
            </>
         );
      }
   }

}

const sleep = (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function Home(props) {

   const { theme } = useContext(ThemeContext)
   const { account, library } = useActiveWeb3React();

   var banner_settings = {
      infinite: true,
      dots: true,
      autoplay: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: `slick-dots dots_${theme}`,
      responsive: [
         {
            breakpoint: 1280,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 1080,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   var bolg_settings = {
      infinite: false,
      dots: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      dotsClass: `slick-dots dots_${theme}`,
      responsive: [
         {
            breakpoint: 1280,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 1080,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };

   const [setPageLoading] = useLoader();

   //--------NFT Minting--------------
   const [mintCount, setMintCount] = useState(1);
   const [mintInfo, setMintInfo] = useState(null);
   const carouselRef = useRef(null);
   const { connectAccount } = props;

   useEffect(() => {
      getMintingInfo(null)
         .then((result) => {
            // console.log('mintinfo:', result);
            setMintInfo(result);
         })
         .catch(error => {
            // console.log('mintinfo error:', error);
            setMintInfo(null);
         })
   }, [])

   const decreaseHandle = () => {
      if (mintCount > 0) {
         setMintCount(mintCount - 1)
      }
   }
   const increaseHandle = () => {
      console.log(mintCount + 1)
      setMintCount(mintCount + 1);
   }
   const mintTokens = async () => {
      if (account && library) {
         const load_toast_id = toast.loading("Please wait for minting nft...");
         onAddItem(
            mintInfo,
            mintCount,
            library
         ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
               toast.success("NFT Minting success!");
               await sleep(2000);
               window.location.reload();
            } else {
               toast.error("Failed Transaction!");
               return;
            }
         });
         // claimNFT(
         //    account,
         //    mintInfo,
         //    mintCount,
         //    library
         // ).then(async (result) => {
         //    toast.dismiss(load_toast_id);
         //    if (result) {
         //       toast.success("NFT Minting success!");
         //       await sleep(2000);
         //       window.location.reload();
         //    } else {
         //       toast.error("Failed Transaction!");
         //       return;
         //    }
         // });
      }
   };

   useInterval(() => {
      if (recentNFTCards.length > 0) {
         let newIndex = recentNFTSlideIndex + 1;
         setRecentNFTSlideIndex(newIndex);
      }
   }, 3000)

   //--------Featured Collection-----
   const [featuredCollections, setFeaturedCollections] = useState([]);

   //--------Banner Scroll----
   // const [showScroll, setShowScroll] = useState(true);

   //-------------- Blog ----------------
   const [blogs, setBlogs] = useState([]);
   useEffect(() => {
      setPageLoading(true);
      axios.get(`${process.env.REACT_APP_API}/articles`)
         .then(res => {
            setPageLoading(false);
            if (res.data.status) {
               setBlogs(res.data.items)
            }
         })
         .catch(err => {
            setPageLoading(false);
            setBlogs([]);
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const [top3Collections, setTop3Collections] = useState([]);
   const [recentNFTs, setRecentNFTs] = useState([]);
   const [recentNFTCards, setRecentNFTCards] = useState([]);
   const [recentNFTSlideIndex, setRecentNFTSlideIndex] = useState(0);

   useEffect(() => {
      setPageLoading(true);
      axios.get(`${process.env.REACT_APP_API}/featured_collections`)
         .then(res => {

            if (res.data.status) {
               setPageLoading(false);
               setFeaturedCollections(res.data.collections);
            }
         })
         .catch(err => {
            setPageLoading(false);
            setFeaturedCollections([]);
         })

      axios.get(`${process.env.REACT_APP_API}/top3_collections`)
         .then(res => {
            if (res.data.status) {
               setPageLoading(false);
               setTop3Collections(res.data.collections);
            }
         })
         .catch(err => {
            setPageLoading(false);
            setTop3Collections([]);
         })
      axios.get(`${process.env.REACT_APP_API}/recently_sold`)
         .then(res => {
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
         })
         .catch(err => {
            setPageLoading(false);
            setRecentNFTs([]);
            setRecentNFTCards([]);
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])


   const goToNextRecentNFT = () => {
      carouselRef.current.moveSlide(1);
   }

   const goToPrevRecentNFT = () => {
      carouselRef.current.moveSlide(-1);
   }

   //------------- Top 3 Collections -------------

   const [stat, setStat] = useState(null);

   useEffect(() => {
      fetchCollections(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   function fetchCollections(reset) {
      setPageLoading(true);
      axios.get(`${process.env.REACT_APP_API}/overview`)
         .then(res => {
            setPageLoading(false);
            if (res?.data?.overview) setStat(res.data.overview)
         })
         .catch(err => {
            setPageLoading(false);
            setStat(null)
         })
   }

   const state_data = [
      { img: Items, value: (stat?.itemCount || 0), label: 'Items' },
      { img: Collections, value: (stat?.collectionCount || 0), label: 'Collections' },
      { img: User, value: (stat?.userCount || 0), label: 'Artists' },
      { img: PLS, value: (stat?.gasUsed || 0), label: 'PLS Burn' }
   ]



   return (
      <>
         <Helmet>
            <title>HEX TOYS - The Ultimate NFT Marketplace on PulseChain</title>
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="title" />
            <meta content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles." name="description" />
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="twitter:title" />
            <meta content="https://marketplace.hex.toys" name="twitter:url" />
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" property="og:title" />
            <meta content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles." property="og:description" />
            <meta content="https://marketplace.hex.toys" property="og:url" />
            <meta content="HEX TOYS, NFT marketplace, PulseChain, digital collectibles, buy NFTs, sell NFTs" name="keywords" />
         </Helmet>
         <Header {...props} />
         <div className='top-home'>
            {/* {
               showScroll && recentNFTs && recentNFTs.length > 0 &&
               <BannerScrolling items={recentNFTs} setShow={setShowScroll} />
            } */}
            <div className='banner'>
               <Slider {...banner_settings}>

                  {
                     featuredCollections && featuredCollections.length && featuredCollections.map((_collection, idx) => {
                        if (_collection.address.toLowerCase() === '0xa35a6162eaecddcf571aeaa8edca8d67d815cee4') {
                           return <div className='banner-container'>
                              <div className='background-container opaciy-60'>
                                 <video src={_collection?.bgUrl} autoPlay muted loop playsInline controls={false} allowFullScreen={false} />
                              </div>
                              <div className='flex bg_1'>
                                 <div className='left-con'>
                                    <VideoImageContentCard url={_collection?.logoUrl} type={_collection?.logoType} />
                                 </div>
                                 <div className='right-con'>
                                    <div className={clsx('desc', `text_color_2_dark`)} style={{ display: 'flex', height: '20px' }}>
                                       <img src={hextoys_loading} width='20' height='20' alt='' style={{ marginRight: '3px' }} />
                                       <p>MINTING NOW</p>
                                    </div>

                                    <h1 className={`text_color_gradient_${theme}`}>{"HEXFLEX HEART"}</h1>
                                    <p className={clsx('desc', `text_color_3_dark`)}>{"#HEXFLEX"}</p>
                                    {
                                       mintInfo &&
                                       <div className="mintCount">
                                          <div className="mint_dec_inc">
                                             <button
                                                className="mintIncDec"
                                                disabled={mintCount === 1}
                                                onClick={decreaseHandle}
                                             >
                                                <i className="fas fa-minus"></i>
                                             </button>
                                             <span className="mintCountValue">{mintCount}</span>
                                             <button
                                                className="mintIncDec"
                                                disabled={mintCount >= mintInfo.quantity}
                                                onClick={increaseHandle}
                                             >
                                                <i className="fas fa-plus"></i>
                                             </button>
                                          </div>
                                          {
                                             account ?
                                                <Button label={<>Mint({formatNum(Number(mintInfo.mintPrice) * mintCount)} PLS)</>} onClick={mintTokens} roundFull fillBtn disabled={false} />
                                                :
                                                <Button label='Connect Wallet' onClick={connectAccount} roundFull fillBtn disabled={false} />
                                          }
                                       </div>
                                    }
                                    {
                                       mintInfo &&
                                       <div className="state">
                                          <p className={clsx('desc', `text_color_3_${theme}`)}>▪ {mintInfo.totalSupply} / {mintInfo.quantity} minted
                                          </p>
                                       </div>
                                    }
                                 </div>
                              </div>
                           </div>
                        } else if (_collection.address.toLowerCase() === '0xf886f928e317cfd4085137a7a755c23d87f81908') {
                           return <div className='banner-container'>
                              <div className='background-container'>
                                 <video src={_collection?.bgUrl} autoPlay muted loop playsInline controls={false} allowFullScreen={false} />
                              </div>
                              <div className="wrapper fex-end">
                                 <h2 className=''>Check out DEX TOYS the PulseX Exchange</h2>
                                 <Button label='The Most Fun PulseX DEX' href='https://dex.hex.toys/' fillBtn roundFull />
                              </div>
                           </div>
                        } else 
                        return <div className='banner-container'>
                           <div className='background-container opaciy-60'>
                              <video src={_collection.bgUrl} autoPlay muted loop playsInline controls={false} allowFullScreen={false} />
                           </div>
                           <div className='flex bg_2'>
                              <div className='left-con'>
                                 <VideoImageContentCard url={_collection?.highLogo} type='image' />
                              </div>
                              <div className='right-con'>
                                 <h1 className={`text_color_gradient_${theme}`}>{_collection.name}</h1>
                                 <p className={clsx('subtitle', `text_color__${theme}`)}>{_collection.description} </p>
                                 <Button href={`/collection/${_collection?.address.toLowerCase()}`} label='View Collection' roundFull fillBtn />
                              </div>
                           </div>
                        </div>
                     })
                  }
               </Slider>
            </div>
         </div>
         <div className="home">
            <div className='container'>
               <div className="state_div">

                  {state_data.map((d, k) => (
                     <div className="state_item" key={k}>
                        <img src={d?.img} alt="" />
                        <h2 className={`text_color_1_${theme}`}>
                           {getStateValue(d?.value)}
                        </h2>
                        <p className={`text_color_2_${theme}`}>{d?.label}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Top 3 Collections */}
         {top3Collections.length !== 0 &&
            <div className="home">
               <div className='container'>
                  <h2 className={`section_title text_color_gradient_${theme}`}>Top 3  Collections </h2>
                  <div className="wrapper column">

                     {top3Collections?.map((d, k) => (
                        k < 3 && <TopCollection3Card key={k} collection={d} index={k} />
                     ))}

                  </div>

               </div>
            </div>}

         <div className="home">
            <CollectionTable />
         </div>

         {/* Recently Sold */}
         <div className="home">
            <div className="full-container">
               {recentNFTs && recentNFTs.length > 0 && (
                  <>
                     <h2 className={`section_title text_color_gradient_${theme}`}>Recently Sold</h2>
                     <div className="carousel-container">
                        <CustomCarousel items={recentNFTCards} />
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* Blog */}
         <div className="home">
            <div className='container'>
               <h2 className={`section_title text_color_gradient_${theme}`}>Blog Articles</h2>
               <div className='blog_div'>
                  {
                     blogs && blogs.length > 0 &&
                     <Slider {...bolg_settings}>
                        {blogs.map((blog, index) => (
                           <BlogCard key={index}
                              blog={blog}
                           />
                        ))}
                     </Slider>
                  }
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
}

export default Home;

