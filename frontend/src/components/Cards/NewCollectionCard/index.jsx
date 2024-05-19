import './newCollectionCard.scss';
import { useState, useContext } from 'react';
import { formatNum } from "../../../utils";
import clsx from 'clsx'
import ThemeContext from '../../../context/ThemeContext';
import loadingImage from '../../../assets/images/hextoysloading.gif';

import heart_fill from '../../../assets/images/icons/icon_heart_filled.png';

function NewCollectionCard(props) {
   const { theme } = useContext(ThemeContext)
   const {collection} = props;   
   const [isLoading, setIsLoading] = useState(true);
   const goToItemDetail = () => {
      window.open(`/collection/${collection.address}`);
   };

   return (
      <div className='newCollectionCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={collection.mediumLogo} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
               {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}
            </div>
            <div className='nft-detail-content'>
               <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{collection.name}</h2>
               <div className='wrap_div'>
                  <div className="col_div right">
                     <p className={clsx('sub_top', `text_color_4_${theme}`)}>FLOOR PRICE</p>
                     <p className={clsx('sub_bottom', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum((collection.tradingCount > 0 ? (collection.tradingVolume/collection.tradingCount) : 0)/collection.coinPrice)}</span> PLS</p>
                  </div>

                  <div className="col_div">
                     <p className={clsx('sub_top', `text_color_4_${theme}`)}>ITEMS</p>
                     <p className={clsx('sub_bottom', `text_color_gradient_1`)}>{collection.totalItemCount}</p>
                  </div>

                  <div className="col_div left">
                     <p className={clsx('sub_top', `text_color_4_${theme}`)}>VOLUME</p>
                     <p className={clsx('sub_bottom', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum(collection.tradingVolume/collection.coinPrice)} PLS</span></p>
                  </div>

                  
               </div>
               <div className="row_div">
                  <p className={clsx('sub_text', `text_color_4_${theme}`)}> {collection.totalOwners} owners</p>
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

export default NewCollectionCard;

