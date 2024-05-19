import { useState, useContext } from 'react';
import { formatNum } from "../../../utils";
import ThemeContext from '../../../context/ThemeContext';
import clsx from 'clsx'
import './TopCollectionCard.scss';
import plsIcon from '../../../assets/images/icons/social-icon-4.svg';
import loadingImage from '../../../assets/images/hextoysloading.gif';
function TopCollectionCard(props) {
   const { collection } = props;
   const { theme } = useContext(ThemeContext)
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
   const goToItemDetail = () => {
      window.open(`/collection/${collection.address}`);
   };
   return (
      <div className='topCollectionCard'>

         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={collection.image} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
               {isLoading && <img src={loadingImage} alt=""  className="img_cover"/>}
            </div>
            <div className='nft-detail-content'>
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <div className="user_info">
                        <div className='avatar_div'>
                           <img src={collection?.image} className="user-image" alt='' onLoad={() => setIsLoading1(false)} style={{opacity : isLoading1 ? 0:1}}/>
                           {isLoading1 && <img src={loadingImage} alt=""  className="img_cover"/>}
                        </div>
                        <div className="name">
                           <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{collection?.name}</h2>
                           <p className={clsx('sub_top', `text_color_1_${theme}`)}>funXCo</p>
                        </div>
                     </div>
                  </div>
                  <div className='sub-right'>
                     <div className='logo_div'>
                     <img src={plsIcon} alt="" className='pls_logo' />
                     </div>
                     
                  </div>                  
               </div>
               
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <p className={clsx('sub_top', `text_color_1_${theme}`)}>Sold for</p>
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{formatNum(Number(collection?.soldInfo?.price))} {collection?.soldInfo?.tokenInfo?.symbol}</p>
                  </div>
                  <div className='sub-right'>
                     <p className={clsx('sub_top', `text_color_1_${theme}`)}>Time</p>
                     <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{getTimeAgo(collection?.soldInfo?.timestamp)}</p>
                  </div>                  
               </div>
            </div>
         </div>
      </div>

   );
}

export default TopCollectionCard;

