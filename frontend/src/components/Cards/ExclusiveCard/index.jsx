import './exclusiveCard.scss';
import { useState, useContext } from 'react';
import { formatNum } from "../../../utils";
import clsx from 'clsx'
import ThemeContext from '../../../context/ThemeContext';
import loadingImage from '../../../assets/images/hextoysloading.gif';
import unknownImg from "../../../assets/images/unknown.jpg";
import heart_fill from '../../../assets/images/icons/icon_heart_filled.png';

function ExclusiveCard(props) {
   const { theme } = useContext(ThemeContext)
   const {item} = props;   
   const [isLoading, setIsLoading] = useState(true);
   const goToItemDetail = () => {
      window.open(`/detail/${item.itemCollection}/${item.tokenId}`, "_self");
   };

   return (
      <div className='collectionCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={(item.isThumbSynced ? item.mediumLogo : item.image) || unknownImg} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
               {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}
            </div>
            <div className='nft-detail-content'>
               <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{item.name}</h2>
               <div className='wrap_div'>
                  <div className="col_div right">
                     <p className={clsx('sub_top', `text_color_4_${theme}`)}>FLOOR PRICE</p>
                     <p className={clsx('sub_bottom', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum((item.tradingCount > 0 ? (item.tradingVolume/item.tradingCount) : 0)/item.coinPrice)}</span> PLS</p>
                  </div>

                  <div className="col_div left">
                     <p className={clsx('sub_top', `text_color_4_${theme}`)}>Volume</p>
                     <p className={clsx('sub_bottom', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum(item.tradingVolume/item.coinPrice)} PLS</span></p>
                  </div>

                  
               </div>
               <div className="row_div">
                  <p className={clsx('sub_text', `text_color_4_${theme}`)}>{item.supply} entities</p>
                  <img src={heart_fill} alt="" className='heart_img' />
               </div>
            </div>
         </div>
      </div>
      // <div className='collectionCard'>  
      //    <div className='nft-product-box' onClick={() => window.open(`/collection/${collection.address}`)}>
      //       <div className='img_div'>
      //          <img src={collection.coverImg} className="item-image" alt='' onLoad={()=>setIsLoading(false)}/>
      //          {isLoading &&<div className='img_cover'></div>}
      //       </div>
            
      //       <div className='profilepic'>
      //          <div className="avatar-container">
      //             <div className='avatar_div'>
      //                <img src={collection.image} alt='' onLoad={()=>setIsLoadingAvatar(false)}/>
      //                {isLoadingAvatar && <img src={profile} alt='' className='img_cover'/>}
      //             </div>
      //             {collection.reviewStatus == 3 && <img src={goldTick} className="subscribe-tick" /> }
      //          </div>
      //       </div>
      //       <div className='nft-box-content'>
      //          <div className='name'>
      //             <p className='nft-title'>{collection.name}</p>
      //             <p className='subtitle'>by <span>{collection.ownerUser.name}</span></p>
      //          </div>
      //          <p className='desc'>{collection.description}</p>
      //       </div>
      //    </div>
      // </div>
   );   
}

export default ExclusiveCard;

