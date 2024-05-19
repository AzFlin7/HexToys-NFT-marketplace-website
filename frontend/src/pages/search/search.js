import React, {useContext} from 'react';
import {useParams} from "react-router-dom"
import Header from '../header/header';
import * as Element from "./style";
import { Tabs } from "antd";

import SearchItemList from "../../components/Lists/PopularItem/SearchItemList";
import UserItemList from "../../components/Lists/UserItemList/UserItemList";
import CollectionItemList from "../../components/Lists/CollectionItemList/CollectionItemList";
import Footer from '../footer/footer';
import ThemeContext from '../../context/ThemeContext';
const { TabPane } = Tabs;

function Search(props) {
   const { searchTxt } = useParams();   
   const { theme } = useContext(ThemeContext)
   return (
      <div>
         <Header {...props}/>                    
         <Element.Container>
            <div className='title'>
            <h1 className="search-page-headline">Search results for <span>{searchTxt}</span></h1>
            </div>
            <div className={`search-page-context ${theme}`}>
               <Tabs defaultActiveKey="1">
                  <TabPane tab="Items" key="1" >
                     <SearchItemList {...props} searchTxt={searchTxt} limit={false}/>                     
                  </TabPane>
                  <TabPane tab="Users" key="2" >
                     <UserItemList limit={false} {...props} searchTxt={searchTxt}/>
                  </TabPane>
                  <TabPane tab="Collections" key="3" >
                     <CollectionItemList limit={false} {...props} searchTxt={searchTxt}/>
                  </TabPane>
               </Tabs>
            </div>
         </Element.Container>    
         <Footer/>    
      </div>
   );   
}

export default Search;

