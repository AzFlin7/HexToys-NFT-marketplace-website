import React, {useContext, useState} from "react";
import * as Element from "./style";
import { useHistory } from "react-router";
import ThemeContext from '../../../context/ThemeContext';
import loadingImage from '../../../assets/images/hextoysloading.gif';

const MysteryBoxCard = (props) => {
  const { mysterybox } = props;
  const { theme } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  
  const goToMysteryBoxDetail = () => {
    history.push(`/mysterybox/${mysterybox?.address}`);
  };

  return (  
    <Element.Container className={`bg_${theme}`} onClick={() => goToMysteryBoxDetail()}>
      <div className="node-preview">
        <img className="node-img" src={mysterybox?.image} alt="logo"onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
        {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}       
      </div>
      <div className="node-main-content">
        <div className="node-footer">
          <div className="node-content">
            <h2 className={`text_color_1_${theme}`}>{mysterybox?.name}</h2>            
            <p className={`text_color_3_${theme}`}>{mysterybox?.description}</p>         
          </div>          
        </div>         
        
      </div>  
    </Element.Container>  
    
  );
};

export default MysteryBoxCard;
