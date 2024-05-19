import React, {useContext, useState} from "react";
import { useHistory } from "react-router";
import * as Element from "./style";
import unknownImg from "../../../assets/images/unknown.jpg";
import ThemeContext from '../../../context/ThemeContext';
import loadingImage from '../../../assets/images/hextoysloading.gif';

const CardNode = (props) => {
  const { card, totalSupply } = props;
  const { theme } = useContext(ThemeContext)
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const goToItemDetail = () => {
    history.push(`/detail/${card?.collectionId}/${card?.tokenId}`);
  };

  return (
    <Element.Container className={`bg_${theme}`}>
      <div className={`card-preview`} onClick={() => goToItemDetail()}>
        <img className="card-img" src={(card?.itemInfo.isThumbSynced ? card?.itemInfo.mediumLogo : card?.itemInfo?.image) || unknownImg} alt="item logo"  onLoad={() => setIsLoading(false)} style={{opacity : isLoading ? 0:1}}/>
        {isLoading && <img src={loadingImage} className="img_cover" alt=''/>}
      </div>
      <div className="card-main-content">
        <div className="card-footer">
          <div className="card-content">
            <h2 className={`text_color_1_${theme}`}> {card?.itemInfo?.name} </h2>
            <h3 className={`text_color_3_${theme}`}> {card?.itemInfo?.collectionInfo?.name} </h3>
          </div>
        </div>
        <div className="card-node-header">
          <div className="card-node-heart">
            <p  className={`text_color_1_${theme}`}>Probability : {parseFloat(card?.amount * 100 / totalSupply).toFixed(2)}%</p>
          </div>
          <p className={`text_color_1_${theme}`}>{card?.amount} / {card?.itemInfo?.supply}</p>
        </div>
      </div>
    </Element.Container>
  );
};

export default CardNode;
