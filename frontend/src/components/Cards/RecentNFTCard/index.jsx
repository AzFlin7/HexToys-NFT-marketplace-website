import { useState, useContext } from 'react';
import { formatNum, getCurrencyInfoFromAddress } from "../../../utils";
import ThemeContext from '../../../context/ThemeContext';
import clsx from 'clsx'
import './RecentNFTCard.scss';
import plsIcon from '../../../assets/images/icons/social-icon-4.svg';
import loadingImage from '../../../assets/images/hextoysloading.gif';
import unknownImg from "../../../assets/images/unknown.jpg";
function RecentNFTCard(props) {
   const { theme } = useContext(ThemeContext)
   const { item } = props;
   const goToItemDetail = () => {
      window.open(`/detail/${item.itemCollection}/${item.tokenId}`, "_self");
   };
   const [isLoading, setIsLoading] = useState(true);
   const [isLoading1, setIsLoading1] = useState(true);

   function getTimeAgo(timestamp) {
      const currentTimestamp = new Date().getTime()
  
      const distanceToDate = currentTimestamp - timestamp * 1000;
      let months = Math.floor(distanceToDate / (1000 * 60 * 60 * 24 * 30));
      let days = Math.floor((distanceToDate % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
      if (months > 0) {
        return `${months}months ago`;
      } else if (days > 0) {
        return `${days}days ago`;
      } else if (hours > 0) {
        return `${hours}hours ago`;
      } else if (minutes > 0) {
        return `${minutes}mins ago`;
      } else if (seconds > 0) {
        return `${seconds}s ago`;
      }
   }
   // console.log(item)

   return (
      <div className='recentNFTCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={(item.isThumbSynced? item.mediumLogo : item.image) || unknownImg} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
               {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}
            </div>
            <div className='nft-detail-content'>
               <div className='nft-price-content'>
                  <div className="user_info">
                     <div className='avatar_div'>
                        <img src={item.collectionInfo.lowLogo} className="user-image" alt='' onLoad={() => setIsLoading1(false)} style={{opacity : isLoading1 ? 0:1}}/>
                        {/* {isLoading1 && <div className='img_cover'></div>} */}
                        {isLoading1 && <img src={loadingImage} className="img_cover" alt=''/>}
                     </div>
                     <div className="name">
                        <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{item.name}</h2>
                        <p className={clsx('sub_top', `text_color_1_${theme}`)}>{item.collectionInfo.name}</p>
                     </div>
                  </div>

                  <div className={`logo_div bg_color_${theme}`}>
                        <img src={getCurrencyInfoFromAddress(item.soldInfo.tokenAdr)?.logoURI} alt="" className='pls_logo' />
                  </div>
                  
               </div>
               
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <p className={clsx('sub_top', `text_color_1_${theme}`)}>Sold for</p>
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{formatNum(Number(item.soldInfo.price))} {item.soldInfo.tokenInfo.symbol}</p>
                  </div>
                  <div className='sub-right'>
                     <p className={clsx('sub_top', `text_color_1_${theme}`)}>Time</p>
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{getTimeAgo(item.soldInfo.timestamp)}</p>
                  </div>                  
               </div>
            </div>
         </div>
      </div>

   );
}

export default RecentNFTCard;

