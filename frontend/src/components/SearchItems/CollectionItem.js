import React, {useContext} from "react";
import { useHistory } from "react-router";
import ThemeContext from '../../context/ThemeContext';
import "./CollectionItem.css";

const CollectionItem = (props) => {
  const {collection} = props;
  const { theme } = useContext(ThemeContext)
  const history = useHistory();

  const goToCollectionPage = () => {
    history.push(`/collection/${collection.address}`);
  }

  return (
    <div className="search-collection-item" onClick={goToCollectionPage} >
      <img
        src={collection.lowLogo}
        alt="collection logo"
      />
      <div className="search-collection-item-info">
        <h4 className={`text_color_1_${theme}`}>{collection.name}</h4>
        <p className={`text_color_4_${theme}`}>{collection.type === 'single' ? 'PRC-721' : 'PRC-1155'}</p>
      </div>
    </div>
  );
};

export default CollectionItem;
