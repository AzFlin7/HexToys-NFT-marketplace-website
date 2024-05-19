import { useState, useContext } from 'react';
import { shorter, formatNum } from "../../../utils";
import clsx from 'clsx'
import ThemeContext from '../../../context/ThemeContext';
import './style.scss';

import Gold from '../../../assets/images/icons/leader_Gold.png';
import Silver from '../../../assets/images/icons/leader_Silver.png';
import Bronze from '../../../assets/images/icons/leader_Bronze.png';
import { getEnsName } from '../../../hooks';
import { useEnsName } from 'wagmi';

function LeaderBoardCard(props) {
   const { user, index, isMobileOrTablet } = props;
   const imageArray = isMobileOrTablet ?
      [Gold, Silver, Bronze]
      :
      [Silver, Gold, Bronze]



   const { theme } = useContext(ThemeContext)

   const ensName = useEnsName({ address: user.address })
   const [isLoading, setIsLoading] = useState(true);
   return (
      <div className='leaderBoardCard'>
         <div className={clsx("content_div", ((isMobileOrTablet && index === 0) || (!isMobileOrTablet && index === 1)) ? 'big' : '')}>
            <div className='card-content'>
               <div className={`card-wrapper bg_${theme}`}>
                  <div className="leader_icon">
                     <div className='img_div'>
                        <img src={imageArray[index]} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{ opacity: isLoading ? 0 : 1 }} />
                        {isLoading && <div className='img_cover'></div>}
                     </div>
                  </div>

                  <div className="avatar_div" onClick={() => window.open(`/profile/${user.address}`)}>
                     <div className='img_div'>
                        <img src={user.mediumLogo} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{ opacity: isLoading ? 0 : 1 }} />
                        {isLoading && <div className='img_cover'></div>}
                     </div>
                  </div>
                  <h2 className={clsx('user-title', `text_color_gradient`)}>
                     {
                        user.name === 'NoName' ?
                           !user.ensName || user.ensName === '' ? shorter(user.address) : user.ensName :
                           user.name
                     }
                  </h2>
                  <div className='detail-content'>
                     <div className='col_div'>
                        <div className="row_div">
                           <p className={clsx('sub_text', `text_color_4_${theme}`)}>Number of Trades</p>

                           <p className={clsx('sub_text', `text_color_4_${theme}`)}> {user.tradingInfo.tradingCount}</p>
                        </div>

                        <div className="row_div">
                           <p className={clsx('sub_text', `text_color_4_${theme}`)}>Total Profit</p>
                           <span>
                              <p className={clsx('sub_text', 'color2')}>{formatNum(user.tradingInfo.tradingVolume / user.coinPrice)} PLS</p>
                              {/* <p className={clsx('sub_text', `text_color_4_${theme}`)}>$ {formatNum(user.tradingInfo.tradingVolume)}</p> */}
                           </span>
                        </div>
                        <div className="row_div">
                           <p className={clsx('sub_text', `text_color_4_${theme}`)}>Average Profit</p>
                           <span>
                              <p className={clsx('sub_text', 'color2')}>{formatNum((user.tradingInfo.tradingVolume / user.tradingInfo.tradingCount) / user.coinPrice)} PLS</p>
                              {/* <p className={clsx('sub_text', `text_color_4_${theme}`)}>$ {user.tradingInfo.tradingCount > 0 ? formatNum(user.tradingInfo.tradingVolume/user.tradingInfo.tradingCount) : 0}</p> */}
                           </span>
                        </div>
                        <div className="row_div">
                           <p className={clsx('sub_text', `text_color_4_${theme}`)}>Biggest Sale</p>
                           <span>
                              <p className={clsx('sub_text', 'color2')}>{formatNum(user.tradingInfo.highPrice / user.coinPrice)} PLS</p>
                              {/* <p className={clsx('sub_text', `text_color_4_${theme}`)}>$ {formatNum(user.tradingInfo.highPrice)}</p> */}
                           </span>
                        </div>
                        <div className="row_div">
                           <p className={clsx('sub_text', `text_color_4_${theme}`)}>Smallest Sale</p>
                           <span>
                              <p className={clsx('sub_text', 'color2')}>{formatNum(user.tradingInfo.lowPrice / user.coinPrice)} PLS</p>
                              {/* <p className={clsx('sub_text', `text_color_4_${theme}`)}>$ {formatNum(user.tradingInfo.lowPrice)}</p> */}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>

   );
}

export default LeaderBoardCard;

