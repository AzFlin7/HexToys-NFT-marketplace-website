import React,{useContext} from 'react';
import { useHistory } from "react-router";
import ThemeContext from '../../context/ThemeContext';
import unknownImg from "../../assets/images/unknown.jpg";

import './PopularItem.css'
import { formatNum, getCurrencyInfoFromAddress } from "../../utils";

const PopularItem = (props) => {
    const {item} = props;
    const history = useHistory();    
    const { theme } = useContext(ThemeContext)
    const goToItemDetail = () => {
        history.push(`/detail/${item.itemCollection}/${item.tokenId}`);
    }
    return (
        <div className="search-item" onClick={goToItemDetail}>
            <img src={(item.isThumbSynced ? item.lowLogo : item.image) || unknownImg} alt={item.name} />
            <div className="search-item-info">
                <h4 className={`text_color_1_${theme}`}>{item.name}</h4>                              
            </div>            
        </div>
    )
}

export default PopularItem
