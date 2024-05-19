import React, { useState, useEffect, useContext } from "react";
import './explore-items.scss';
import { useLoader } from '../../context/useLoader'
import axios from 'axios';
import Header from '../header/header';
import Footer from '../footer/footer';
import clsx from 'clsx';
import ItemCard from "../../components/Cards/ItemCard";
import MySelect from '../../components/Widgets/MySelect';
import Expand from "react-expand-animated";
import Masonry from 'react-masonry-css';
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroll-component";
import ThemeContext from '../../context/ThemeContext';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import more_icon from '../../assets/images/icons/icon_more.svg';
import more_icon_black from '../../assets/images/icons/icon_more_black.svg';
import CloseIcon from '@material-ui/icons/Close';
function ExploreItems(props) {
  const { theme } = useContext(ThemeContext)
  const usetheme = useTheme();
  const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
  const breakpoint = {
    default: 4,
    1840: 4,
    1440: 4,
    1280: 3,
    1080: 2,
    768: 2,
    450: 2,
  };

  const styles = {
    open: { width: "100%" },
    close: { width: "100%" }
  };
  const transitions = ["height", "opacity", "background"];
  const [setPageLoading] = useLoader()

  const [showFilter, setShowFilter] = useState(false);

  const [items, setItems] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchKey, setSearchKey] = useState('');

  const [isExpandStatus, setIsExpandStatus] = useState(true);
  const [saleStatus, setSaleStatus] = useState('all'); // owned, sale, created, liked 

  const [isExpandItems, setIsExpandItems] = useState(false);
  const typeOptions = [
    { label: 'All items', value: '' },
    { label: 'Single items', value: 'single' },
    { label: 'Multiple items', value: 'multi' },
  ];
  const [type, setType] = useState("");

  const sortOptions = [
    { label: 'Recently Listed', value: 'timestamp' },
    { label: 'Price: low to high', value: 'price1' },
    { label: 'Price: high to low', value: 'price2' },
    { label: 'Most Favorited', value: 'likeCount' },
    { label: 'Name', value: 'name' },
  ];

  const [sortBy, setSortBy] = useState("timestamp");

  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([]);
    setNoItems(false)
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    setPageLoading(true);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, saleStatus, sortBy, type])

  useEffect(() => {
    setLoading(true)

    if (initialItemsLoaded) {
      fetchItems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchItems(reset) {
    let paramData = {}

    if (sortBy) {
      switch (sortBy) {
        case 'timestamp':
          paramData.sortBy = 'timestamp';
          paramData.sortDir = 'desc';
          break;
        case 'price1':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'asc';
          break;
        case 'price2':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'desc';
          break;
        case 'likeCount':
          paramData.sortBy = 'likeCount';
          paramData.sortDir = 'desc';
          break;
        case 'name':
          paramData.sortBy = 'name';
          paramData.sortDir = 'asc';
          break;

        default:
          break;
      }
    }
    if (searchKey) {
      paramData.searchTxt = searchKey
    }
    if (type) {
      paramData.type = type
    }
    if (saleStatus) {
      paramData.saleType = saleStatus
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page;
    }

    axios.get(`${process.env.REACT_APP_API}/items`, {
      params: paramData
    })
      .then(res => {
        setLoading(false);
        setPageLoading(false);
        if (res.data.status) {
          if (res.data.items.length === 0) setNoItems(true)
          if (reset) {
            setItems(res.data.items)
            setInitialItemsLoaded(true)
          } else {
            let prevArray = JSON.parse(JSON.stringify(items))
            prevArray.push(...res.data.items)
            setItems(prevArray)
          }
        }
      })
      .catch(err => {
        setPageLoading(false);
        setLoading(false)
        // console.log(err)
        setNoItems(true)
      })
  }

  function loadMore() {
    if (!loading) {
      setPage(page => { return (page + 1) })
    }
  }

  function changeStatus(newStatus) {
    if (saleStatus === newStatus) {
      setSaleStatus('all');
    } else {
      setSaleStatus(newStatus);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchKey(searchTxt);
    }
  }

  return (
    <>
      <Helmet>
        <title>HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain</title>
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" name="title" />
        <meta content="Explore and discover a wide range of unique digital items on HEX TOYS, the ultimate NFT marketplace on PulseChain. Find, buy, sell, and trade one-of-a-kind digital collectibles." name="description" />
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" name="twitter:title" />
        <meta content="https://marketplace.hex.toys/explore-items" name="twitter:url" />
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" property="og:title" />
        <meta content="Explore and discover a wide range of unique digital items on HEX TOYS, the ultimate NFT marketplace on PulseChain. Find, buy, sell, and trade one-of-a-kind digital collectibles." property="og:description" />
        <meta content="https://marketplace.hex.toys/explore-items" property="og:url" />
        <meta content="HEX TOYS, NFT marketplace, PulseChain, explore items, digital items, digital collectibles" name="keywords" />
      </Helmet>

      <Header {...props} />

      <InfiniteScroll
        dataLength={items.length} //This is important field to render the next data
        next={loadMore}
        hasMore={!noItems}
        scrollThreshold={0.5}
      >

        <div className="explore-items">
          <div className="container">
            <div className="title">
              <h1 className={`text_color_gradient_${theme}`}>Explore Items</h1>
            </div>
            <div className="wrapper">
              <div className="left">
                <div className={`filter_label bg_${theme} text_color_1_${theme}`}>Filters</div>
                <div className={`filter_div bg_${theme}`}>

                  {/* sale status */}
                  <div className="row_div">
                    <button onClick={() => setIsExpandStatus(!isExpandStatus)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                      Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i>
                    </button>
                    <Expand
                      open={isExpandStatus}
                      duration={300}
                      styles={styles}
                      transitions={transitions}
                    >
                      <div className="btn_list">
                        <button className={`filter_btn ${saleStatus === 'fixed' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('fixed')}>Buy Now</button>
                        <button className={`filter_btn ${saleStatus === 'auction' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('auction')}>On Auction</button>
                      </div>
                    </Expand>
                  </div>

                  {/* item type */}
                  <div className="row_div">
                    <button onClick={() => setIsExpandItems(!isExpandItems)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                      {type === '' ? 'All items' : type === 'single' ? 'Single items' : 'Multiple items'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandItems ? 0 : 180}deg)` }}></i>
                    </button>
                    <Expand
                      open={isExpandItems}
                      duration={300}
                      styles={styles}
                      transitions={transitions}
                    >
                      <div className="btn_list">
                        {typeOptions.map((d, k) => (
                          <button className={`filter_btn ${d.value === type ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => setType(d.value)} key={k}>{d.label}</button>
                        ))}

                      </div>
                    </Expand>
                  </div>
                  

                </div>

              </div>

              <div className="right">
                <div className="filter_div">
                  <div className={`filter_label bg_${theme} text_color_1_${theme}`} onClick={() => { setShowFilter(true) }}>Filters</div>
                  <div className={`fiter_mob_div ${showFilter === true ? 'show_div' : ''} bg_${theme}`}>
                    <div className="content_div">
                      <div className={`close_btn text_color_1_${theme}`}>
                        <CloseIcon className="fa" fontSize="small" onClick={() => { setShowFilter(false) }} />
                      </div>
                      <div className={`col_div bg_${theme}`}>

                        {/* sale status */}
                        <div className="row_div">
                          <button onClick={() => setIsExpandStatus(!isExpandStatus)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                            Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i>
                          </button>
                          <Expand
                            open={isExpandStatus}
                            duration={300}
                            styles={styles}
                            transitions={transitions}
                          >
                            <div className="btn_list">
                              <button className={`filter_btn ${saleStatus === 'fixed' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('fixed')}>Buy Now</button>
                              <button className={`filter_btn ${saleStatus === 'auction' ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => changeStatus('auction')}>On Auction</button>
                            </div>
                          </Expand>
                        </div>
                       
                        {/* item type */}
                        <div className="row_div">
                          <button onClick={() => setIsExpandItems(!isExpandItems)} className={`expandBtn btn_${theme} text_color_1_${theme}`}>
                            {type === '' ? 'All items' : type === 'single' ? 'Single items' : 'Multiple items'} <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandItems ? 0 : 180}deg)` }}></i>
                          </button>
                          <Expand
                            open={isExpandItems}
                            duration={300}
                            styles={styles}
                            transitions={transitions}
                          >
                            <div className="btn_list">
                              {typeOptions.map((d, k) => (
                                <button className={`filter_btn ${d.value === type ? 'active_btn' : ''} text_color_1_${theme}`} onClick={() => setType(d.value)} key={k}>{d.label}</button>
                              ))}

                            </div>
                          </Expand>
                        </div>                        

                      </div>
                    </div>
                  </div>
                  <div className="search_div">
                    <button><i className="fas fa-search"></i></button>
                    <input type='text' placeholder="Search by NFTs" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} className={`bg_${theme} text_color_1_${theme}`} onKeyPress={handleKeyPress}/>
                  </div>



                  <div className="myselect">
                    <MySelect
                      value={isMobileOrTablet ? '' : sortBy}
                      options={sortOptions}
                      onChange={setSortBy}
                      className={clsx('filter_select', 'light')}
                    />
                    <img src={theme === 'dark' ? more_icon : more_icon_black} alt="" className="mob_icon" />
                  </div>

                </div>

                {items && items.length !== 0 &&
                  <Masonry
                    breakpointCols={breakpoint}
                    className={'masonry'}
                    columnClassName={'gridColumn'}
                  >
                    {items.map((item, index) => (
                      <ItemCard key={index} {...props} item={item} />
                    ))}
                  </Masonry>}
              </div>

            </div>
          </div>
        </div>
      </InfiniteScroll>
      <Footer />
    </>
  );

}

export default ExploreItems;