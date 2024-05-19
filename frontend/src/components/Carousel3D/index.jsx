import './carousel3D.scss';
import { useState, useContext, useEffect } from 'react';
import clsx from 'clsx'
import ThemeContext from '../../context/ThemeContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Carousel3D(props) {
  const { theme } = useContext(ThemeContext)
  const usetheme = useTheme();
  const isMobile = useMediaQuery(usetheme.breakpoints.down('sm'));
  const [slideCount, setSlideCount] = useState(5);
  const [slideActiveCof, setSlideActiveCof] = useState(2);
  const [/*loginStatus*/, setLoginStatus] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

   const {data} = props;   
   const [isLoading, setIsLoading] = useState(true);
   
   useEffect(() => {
    if(isMobile){
      setSlideCount(3)
      setSlideActiveCof(1)
    }
    else{
      setSlideCount(5)
      setSlideActiveCof(2)
    }
  }, [isMobile]);

  const onSlideScroll=(direct)=>{
    if(direct === 'left'){
      if(slideIndex > 0){
        setSlideIndex(slideIndex - 1)
      }
      else{
        setSlideIndex( data?.length - slideCount)
      }

    }
    if(direct === 'right'){
      if(slideIndex < data?.length - slideCount){
        setSlideIndex(slideIndex + 1)
      }
      else{
        setSlideIndex(0)
      }
    }
  }

  useEffect(() => {

    let myInterval = setInterval(() => {

      if(slideIndex < data?.length){
        setSlideIndex(slideIndex + 1)
      }
      else{
        setSlideIndex(0)
      }
      

    }, 1000)
    return () => {
        clearInterval(myInterval);
    };

});

  // console.log(slideIndex)

   return (
      <div className='carousel3D'>
         <div className="slide_view">
            <div className="slide_list" style={{width : `${100 + (data?.length - slideCount) * (100/ slideCount)}%`, transform : `translateX(-${(100/data?.length)*slideIndex}%)`}}>
              {data?.map((d, k)=>(
                <div 
                  className={clsx("slide_item", k === slideIndex  + slideActiveCof ? 'active-item': (k === slideIndex  + (slideActiveCof - 1) || k === slideIndex  + (slideActiveCof + 1)) ? 'none1-item': (k === slideIndex || k === slideIndex  + 4) ? 'none2-item':'')} key={k} 
                  style={{transform : `translateX(-${20 * slideIndex}%)`}}
                >
                  {d.content}
                </div>
              ))}
            </div>
          </div>
          <div className="navBtns">
            <button className='leftBtn' onClick={()=>onSlideScroll('left')}><i className="fas fa-chevron-left"></i></button>
            <button className='rightBtn' onClick={()=>onSlideScroll('right')}><i className="fas fa-chevron-right"></i></button>
          </div>
      </div>
      
   );   
}

export default Carousel3D;

