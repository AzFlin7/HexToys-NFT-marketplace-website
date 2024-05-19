import { useState, useEffect, useContext } from 'react';
import { formatNum, getCurrencyInfoFromAddress } from "../../../utils";
import clsx from 'clsx';
import plsIcon from '../../../assets/images/icons/social-icon-4.svg';
import incIcon from '../../../assets/images/icons/INC.svg';
import ThemeContext from '../../../context/ThemeContext';
import moment from 'moment';
import './itemCard.scss';
import unknownImg from "../../../assets/images/unknown.jpg";
import loadingImage from '../../../assets/images/hextoysloading.gif';
function ItemCard(props) {
   const { item } = props;
   const { theme } = useContext(ThemeContext)
   const goToItemDetail = () => {
      window.open(`/detail/${item.itemCollection}/${item.tokenId}`, "_self");
   };
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

   const [auctionStatus, setAuctionStatus] = useState(false);
   const [auctionStatusMessage, setAuctionStatusMessage] = useState('');
   const [state, setState] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
   });

   const setNewTime = () => {
      const currentTimestamp = new Date().getTime();
      let countdownDate = 0;
      if (item.auctionInfo.startTime * 1000 > currentTimestamp) {
         setAuctionStatus(false);
         countdownDate = item.auctionInfo.startTime * 1000;
         setAuctionStatusMessage('Auction starts in');

      } else if (item.auctionInfo.endTime * 1000 > currentTimestamp) {
         setAuctionStatus(true);
         countdownDate = item.auctionInfo.endTime * 1000;
         setAuctionStatusMessage('Auction Ends in');
      } else {
         setAuctionStatusMessage('Auction has ended');
         setAuctionStatus(false);
      }

      if (countdownDate) {
         const distanceToDate = countdownDate - currentTimestamp;

         let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
         let hours = Math.floor(
            (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
         );
         let minutes = Math.floor(
            (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
         );
         let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

         const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

         if (numbersToAddZeroTo.includes(days)) {
            days = `0${days}`;
         }
         if (numbersToAddZeroTo.includes(hours)) {
            hours = `0${hours}`;
         }
         if (numbersToAddZeroTo.includes(minutes)) {
            minutes = `0${minutes}`;
         }
         if (numbersToAddZeroTo.includes(seconds)) {
            seconds = `0${seconds}`;
         }
         setState({ days: days, hours: hours, minutes: minutes, seconds: seconds });
      } else {
         setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
   };

   useEffect(() => {
      // if (item && item.auctionInfo) setInterval(() => setNewTime(), 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [item]);


   const [isLoading, setIsLoading] = useState(true);
   const [isLoading1, setIsLoading1] = useState(true);
   // console.log(item)
   return (
      <div className='itemCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={(item.isThumbSynced ? item?.mediumLogo : item?.image) || unknownImg} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{ opacity: isLoading ? 0 : 1 }} />
               {/* {isLoading && <div className='img_cover'></div>} */}
               {isLoading && <img src={loadingImage} className="img_cover" alt='' />}
            </div>
            <div className='nft-detail-content'>
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <div className='avatar_div'>
                        <img src={item?.collectionInfo.isThumbSynced ? item?.collectionInfo.lowLogo : item?.collectionInfo.image} className="user-image" alt='' onLoad={() => setIsLoading1(false)} style={{ opacity: isLoading1 ? 0 : 1 }} />
                        {isLoading1 && <img src={loadingImage} className="img_cover" alt='' />}
                     </div>
                     <div className="name">
                        <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{item?.name}</h2>
                        <p className={clsx('sub_top', `text_color_1_${theme}`)}>{item?.collectionInfo?.name}</p>
                     </div>
                  </div>
                  {
                     item.auctionInfo ?
                        <div className={`logo_div bg_color_${theme}`}>
                           {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr)?.symbol === 'INC' ?
                              <img src={incIcon} alt="" className='inc_logo' /> :
                              <img src={getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr)?.logoURI} alt="" className='pls_logo' />
                           }
                        </div>
                        :
                        item.pairInfo ?
                           <div className={`logo_div bg_color_${theme}`}>
                              {getCurrencyInfoFromAddress(item.pairInfo.tokenAdr)?.symbol === 'INC' ?
                                 <img src={incIcon} alt="" className='inc_logo' /> :
                                 <img src={getCurrencyInfoFromAddress(item.pairInfo.tokenAdr)?.logoURI} alt="" className='pls_logo' />
                              }
                           </div>
                           :
                           <div className={`logo_div bg_color_${theme}`}>
                              <img src={plsIcon} alt="" className='pls_logo' />
                           </div>
                  }
               </div>

               {
                  (item.auctionInfo || item.pairInfo) ?
                     <div className='nft-price-content info'>
                        <div className='sub-left'>
                           <p className={clsx('sub_top', `text_color_1_${theme}`)}>Price</p>
                           {item.auctionInfo ?
                              <p className={clsx('sub_bottom', `text_color_3_${theme}`)}>{formatNum(Number(item.auctionInfo.price))} {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr)?.symbol}</p>
                              :
                              <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{formatNum(Number(item.pairInfo.price))} {getCurrencyInfoFromAddress(item.pairInfo.tokenAdr)?.symbol}</p>}
                        </div>
                        {auctionStatus && item.auctionInfo &&
                           <div className='sub-right'>
                              <p className={clsx('sub_top', `text_color_3_${theme}`)}>{auctionStatusMessage}</p>
                              <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{state.days || '00'}d {state.hours || '00'}h {state.minutes || '00'}m {state.seconds || '00'}s</p>
                           </div>}
                        {!auctionStatus && item.auctionInfo && !item.pairInfo &&
                           <div className='sub-right'>
                              <p className={clsx('sub_top', `text_color_3_${theme}`)}>{auctionStatusMessage}</p>
                           </div>}
                        {item.pairInfo &&
                           <div className='sub-right'>
                              <p className={clsx('sub_top', `text_color_3_${theme}`)}>Time</p>
                              <p className={clsx('sub_bottom', `text_color_1_${theme}`)}>{getTimeAgo(item.pairInfo.timestamp)}</p>
                           </div>}
                     </div> :
                     <div className='nft-price-content info'>
                        <div className='sub-left'>
                           <p className={clsx('sub_top', `text_color_1_${theme}`)}>Price</p>
                           <p className={clsx('sub_bottom', `text_color_3_${theme}`)}>Not for sale</p>
                        </div>
                     </div>
               }
            </div>
         </div>
      </div>
   );
}

export default ItemCard;

