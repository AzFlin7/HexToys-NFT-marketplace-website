import React, { useState, useEffect, useContext } from "react";

import Header from '../header/header';
import "./create.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Helmet } from "react-helmet";
import Footer from '../footer/footer';
import ThemeContext from '../../context/ThemeContext';
import ModalCreateCollection from "../../components/modals/modal-create-collection";

import create_single_icon_dark from '../../assets/images/create_single_dark.png';
import create_single_icon_light from '../../assets/images/create_single_light.png';
import create_multi_icon_dark from '../../assets/images/create_multi_dark.png';
import create_multi_icon_light from '../../assets/images/create_multi_light.png';
import create_collection_icon_dark from '../../assets/images/create_collection_dark.png';
import create_collection_icon_light from '../../assets/images/create_collection_light.png';
import create_hypercubes_dark from '../../assets/images/create_hypercubes_dark.png';
import create_hypercubes_light from '../../assets/images/create_hypercubes_light.png';

import { Link } from 'react-router-dom';
import ModalCreateMysteryBox from "../../components/modals/modal-create-mysterybox";

function Create(props) {

   const { theme } = useContext(ThemeContext)

   const [showCreateCollectionDlg, setShowCreateCollectionDlg] = useState(false);
   const [showCreateMysteryBox, setShowCreateMysteryBox] = useState(false);

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

         <div className="create">
            <div className='container'>
               <h2 className={`section_title text_color_gradient_${theme}`}>Choose Type</h2>
               <p className={`sub_text text_color_3_${theme}`}>Choose “Single” if you want your collectable it is one of a kind or "Multiple" if you want to sell one collectable multiple time</p>
               <div className='wrapper'>
                  <Link to={'/create-single'} className={`col_div border_${theme}`}>
                     <div className="icon_div">
                        {theme === 'dark' ?
                           <img src={create_single_icon_dark} alt="" /> :
                           <img src={create_single_icon_light} alt="" />
                        }
                     </div>
                     <h3 className={`section_title text_color_gradient_${theme}`}>Single</h3>

                     <p className={`sub_text text_color_3_${theme}`}>If you want to highlight the uniqueness and individuality of your item</p>
                  </Link>
                  <Link to={'/create-multiple'} className={`col_div border_${theme}`}>
                     <div className="icon_div">
                        {theme === 'dark' ?
                           <img src={create_multi_icon_dark} alt="" /> :
                           <img src={create_multi_icon_light} alt="" />
                        }
                     </div>
                     <h3 className={`section_title text_color_gradient_${theme}`}>Multiple</h3>

                     <p className={`sub_text text_color_3_${theme}`}>If you want to share your NFT with a large number of community members</p>
                  </Link>
                  <div className={`col_div border_${theme}`} onClick={() => setShowCreateCollectionDlg(true)}>
                     <div className="icon_div">
                        {theme === 'dark' ?
                           <img src={create_collection_icon_dark} alt="" /> :
                           <img src={create_collection_icon_light} alt="" />
                        }
                     </div>
                     <h3 className={`section_title text_color_gradient_${theme}`}>Create Collection</h3>
                     <p className={`sub_text text_color_3_${theme}`}>If you want to create a collection on PulseChain</p>
                  </div>
                  <div className={`col_div border_${theme}`} onClick={() => setShowCreateMysteryBox(true)}>
                     <div className="icon_div">
                        {theme === 'dark' ?
                           <img src={create_hypercubes_dark} alt="" /> :
                           <img src={create_hypercubes_light} alt="" />
                        }
                     </div>
                     <h3 className={`section_title text_color_gradient_${theme}`}>Hypercubes</h3>
                     <p className={`sub_text text_color_3_${theme}`}>Get random nft from lucky box</p>
                  </div>
               </div>
            </div>
            <ModalCreateCollection
               showCreateCollectionDlg={showCreateCollectionDlg}
               setShowCreateCollectionDlg={setShowCreateCollectionDlg}
            />
            <ModalCreateMysteryBox
                showCreateMysteryBox={showCreateMysteryBox}
                setShowCreateMysteryBox={setShowCreateMysteryBox}
            />
         </div>
         <Footer />
      </>
   );
}

export default Create;

