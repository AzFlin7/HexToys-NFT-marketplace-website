import { useState, useContext } from 'react';
import ThemeContext from '../../../context/ThemeContext';
import loadingImage from '../../../assets/images/hextoysloading.gif';


import './blogCard.scss';
function BlogCard(props) {
   const { theme } = useContext(ThemeContext)
   const { blog } = props;
   const goToBlogDetail = () => {
      window.open(`${blog.link}`);
   };
   const [isLoading, setIsLoading] = useState(true);
   const description = blog.description;
   const element_array = description.split('img');
   const link_array = element_array[1].split('"');
   const img_link = link_array[1];   

   return (
      <div className='blogCard'>
         <div className='card-content' onClick={goToBlogDetail}>
            <div className='img_div'>
               <img src={img_link} className="item-image" alt='' onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
               {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}
            </div>
            <div className='blog-detail-content'>
               <p className={`blog-title text_color_1_${theme}`}>{blog.title}</p>
               <p className={`sub-bottom text_color_4_${theme}`}>{blog.pubDate}</p>
               {/* <p className='sub-bottom'>{moment(1687187102 * 1000).format("MMM,DD,YYYY hh:mm a")}</p> */}
            </div>
         </div>
      </div>

   );
}

export default BlogCard;

