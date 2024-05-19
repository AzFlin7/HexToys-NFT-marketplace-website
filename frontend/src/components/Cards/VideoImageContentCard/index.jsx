import {useState} from 'react';
import './video_img_card.scss';
import loadingImage from '../../../assets/images/hextoysloading.gif';
function VideoImageContentCard(props) {
   const {url, type} = props;   
   const [isLoading, setIsLoading] = useState(true);
   // const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
   return (
      <div className='video_img_card'>
         {type === 'image' ? 
            <img src={url} className="image" alt='' onLoad={()=>setIsLoading(false)} style={{opacity : isLoading ? 0 : 1}}/>:
            <video className="videoEmbed" autoPlay={true} loop muted={true} onLoadedData={()=>setIsLoading(false)} style={{opacity : isLoading ? 0:1}}>
               <source src={url} type="video/mp4"/>
            </video>
         }
         {isLoading && <img src={loadingImage} alt=""  className="img_cover"/>}
         
      </div>
   );   
}

export default VideoImageContentCard;

