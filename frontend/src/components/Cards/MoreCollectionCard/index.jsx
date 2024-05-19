import {useState, useContext} from 'react';
import { formatNum, getCurrencyInfoFromAddress} from "../../../utils";
import clsx from 'clsx';
import plsIcon from '../../../assets/images/icons/social-icon-4.svg';
import ThemeContext from '../../../context/ThemeContext';
import './moreCollectionCard.scss';
import loadingImage from '../../../assets/images/hextoysloading.gif';
import unknownImg from "../../../assets/images/unknown.jpg";
function MoreCollectionCard(props) {
   const {item} = props;
   const { theme } = useContext(ThemeContext)
   const goToItemDetail = () => {
      window.open(`/detail/${item.itemCollection}/${item.tokenId}`, "_self");      
   };

   const [isLoading, setIsLoading] = useState(true);
   // const [isLoading1, setIsLoading1] = useState(true);

   return (
      <div className={`moreCollectionCard border_color_${theme}`}>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={item?.image ? item?.image : unknownImg} className="item-image" alt='' onLoad={() => setIsLoading(false)}style={{opacity : isLoading ? 0:1}} />
               {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}


               {/* {item.collectionInfo &&
                  <div className={`logo_div bg_color_${theme}`}>
                     <div>
                        <img src={getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr)?.logoURI || plsIcon} alt="" className='pls_logo' />
                     </div>
                  </div>} */}

               <div className='logo_div'>
               <div>
                  <img src={plsIcon} alt="" className='pls_logo' />
               </div>
            </div>
               
            </div>
            
            <div className='nft-detail-content'>
               <div className='nft-price-content'>
                  <div className='user_info'>
                     <div className="name">
                        <p className={clsx('sub_top', `text_color_3_${theme}`)}>{item?.collectionInfo.name}</p>
                        <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{item?.name}</h2>
                     </div>
                  </div>
               
               </div>
               
               <div className={`nft-price-content bg_${theme}`}>
                  <div className='sub-left'>
                     <p className={clsx('sub_top', `text_color_3_${theme}`)}>Price</p>
                    
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{formatNum(Number(item?.price || 0))} PLS</p>
                  </div>
                     <div className='sub-right'>
                     <p className={clsx('sub_top', `text_color_3_${theme}`)}>Highest bid</p>
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>No bids yet</p>
                  </div>               
               </div>
            </div>
         </div>
      </div>
      
   );   
}

export default MoreCollectionCard;

