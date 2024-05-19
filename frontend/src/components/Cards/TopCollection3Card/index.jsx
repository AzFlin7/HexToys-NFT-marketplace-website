import { useState, useContext } from 'react';
import { formatNum } from "../../../utils";
import clsx from 'clsx'
import ThemeContext from '../../../context/ThemeContext';
import './style.scss';
import loadingImage from '../../../assets/images/hextoysloading.gif';

function TopCollection3Card(props) {
   const { collection, index } = props;
   const { theme } = useContext(ThemeContext)
   const goToItemDetail = () => {
      window.open(`/collection/${collection.address}`);
   };
   const [isLoading, setIsLoading] = useState(true);
   return (
      <div className='topCollection3Card'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={collection.mediumLogo} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{ opacity: isLoading ? 0 : 1 }} />
               {isLoading && <img src={loadingImage} alt="" className="img_cover" />}
               <div className={"badge badge-" + index}>{'0' + (index + 1)}</div>
            </div>
            <div className='nft-detail-content'>
               <h2 className={clsx('nft-title', `text_color_1_${theme}`)}>{collection.name}</h2>
               <div className='col_div'>
                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>FLOOR PRICE</p>
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum(collection.floorPrice / collection.coinPrice)}</span> PLS</p>
                  </div>

                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>Floor change</p>
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>
                        <span className={clsx(`${collection.prevTradingCount > 0 ?
                           collection.floorPrice < (collection.prevTradingVolume / collection.prevTradingCount)
                              ? 'color1'
                              : 'color2'
                           : 'black'}`)}>
                           {
                              Number(collection.prevTradingCount) > 0 ?
                                 formatNum((Number(collection.floorPrice) - Number(collection.prevTradingVolume) / Number(collection.prevTradingCount)) * 100.0 / (Number(collection.prevTradingVolume) / Number(collection.prevTradingCount))) + "%"
                                 :
                                 "--"
                           }
                        </span>
                     </p>
                  </div>

                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>Volume</p>
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}> <span className={clsx(`text_color_1_${theme}`)}>{formatNum(collection.tradingVolume / collection.coinPrice)} </span> PLS</p>
                  </div>

                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>Volume change</p>
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>
                        <span className={clsx(`${collection.prevTradingVolume > 0 ?
                           collection.tradingVolume < collection.prevTradingVolume
                              ? 'color1'
                              : 'color2'
                           : 'black'}`)}>
                           {
                              collection.prevTradingVolume > 0 ?
                                 formatNum((collection.tradingVolume - collection.prevTradingVolume) * 100.0 / collection.prevTradingVolume) + "%"
                                 :
                                 "--"
                           }
                        </span>
                     </p>
                  </div>

                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>Items</p>
                     <p className={clsx('sub_text', `text_color_1_${theme}`)}>{collection.totalItemCount}</p>
                  </div>

                  <div className="row_div">
                     <p className={clsx('sub_text', `text_color_4_${theme}`)}>Owners</p>
                     <p className={clsx('sub_text', `text_color_1_${theme}`)}>{collection.totalOwners}</p>
                  </div>

               </div>
            </div>
         </div>
      </div>

   );
}

export default TopCollection3Card;

