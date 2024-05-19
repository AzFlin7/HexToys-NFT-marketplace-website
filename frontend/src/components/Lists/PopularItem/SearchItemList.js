/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios';

import PopularItemCard from '../../SearchItems/PopularItem';
import './SearchItemList.css';
import Button from "../../Widgets/CustomButton";

const SearchItemList = (props) => {

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [noItems, setNoItems] = useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');

    useEffect(() => {
        if (props.searchTxt && searchTxt !== props.searchTxt) {
            setSearchTxt(props.searchTxt);
            setItems([]);
            setNoItems(false);
            setInitialItemsLoaded(false);
            setLoading(true);
            setPage(1);
            fetchItems(true);
        }
    }, [props])

    useEffect(() => {
        setLoading(true);
        if (initialItemsLoaded) {
            fetchItems(false);
        }
    }, [page])

    function fetchItems(reset) {
        let queryUrl = `${process.env.REACT_APP_API}/search_items?search=${props.searchTxt}&page=${reset ? 1 : page}`;
        axios.get(queryUrl)
            .then(res => {
                setLoading(false);
                if (res.data.status) {                    
                    if (res.data.items.length === 0) setNoItems(true);
                    if (reset) {
                        setItems(res.data.items);
                        setInitialItemsLoaded(true);
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(items));
                        prevArray.push(...res.data.items);
                        setItems(prevArray);
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                setNoItems(true);
            })
    }
    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) });
        }
    }
    return (
        <div>
            <div>
                {items.map((item, index) => (props.limit ?
                    index < 3 && <PopularItemCard {...props} item={item} key={index} />
                    :
                    <PopularItemCard {...props} item={item} key={index} />
                ))}
            </div>
            <div className="load-more" style={{ display: noItems || props.limit ? "none" : "" }}>
                <Button label = {loading ? "Loading..." : "Load more"} fillBtn roundFull onClick={() => loadMore()} />
            </div>

        </div>
    )
}

export default SearchItemList
