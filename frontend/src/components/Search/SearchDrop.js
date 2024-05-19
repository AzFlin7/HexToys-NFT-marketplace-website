import React,{ useEffect,useContext } from "react";
import SearchItemList from "../Lists/PopularItem/SearchItemList";
import UserItemList from "../Lists/UserItemList/UserItemList";
import CollectionItemList from "../Lists/CollectionItemList/CollectionItemList";
import "./SearchDrop.scss";
import { useHistory } from "react-router";
import ThemeContext from '../../context/ThemeContext';

const SearchDrop = (props) => {
  const { searchTxt } = props;  
  const { theme } = useContext(ThemeContext)
  const history = useHistory();
  const goToSearchPage = () => {
    history.push(`/search/${searchTxt}`);
  };

  useEffect(() => {
    // console.log(`searchTxt: ${searchTxt}`);
  }, [searchTxt])


  return (
    <div className={`search-drop bg_color_${theme} ` + (searchTxt === '' ? 'no-padding': '')}>
      {
        searchTxt ?
          <>
            <div className="search-drop-header">
              <h4 className={`search-drop-search-text text_color_3_${theme}`}>
                Search results for <span>{searchTxt}</span>
              </h4>
              <button onClick={goToSearchPage} className={`bg_color_${theme}`}>All Results</button>
            </div>      
            <div className="search-drop-context">
              <div className="search-drop-items">
                <h4 className={`popular-item-text text_color_1_${theme}`}>Collections</h4>
                <div className="search-drop-item-list">
                  <CollectionItemList limit={true} searchTxt={searchTxt}/>
                </div>
              </div>
              <div className="search-drop-items">
                <h4 className={`popular-item-text text_color_1_${theme}`}>Items</h4>
                <div className="search-drop-item-list">
                  <SearchItemList searchTxt={searchTxt} limit={true}/>
                </div>
              </div>
              <div className="search-drop-items">
                <h4 className={`popular-item-text text_color_1_${theme}`}>Users</h4>
                <div className="search-drop-item-list">
                  <UserItemList limit={true} searchTxt={searchTxt}/>
                </div>
              </div>
              
            </div>
          </>
          :
          <></>
      }      
    </div>
  );
};

export default SearchDrop;
