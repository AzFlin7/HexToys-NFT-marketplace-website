/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios';
import CollectionItem from '../../SearchItems/CollectionItem';
import Button from "../../Widgets/CustomButton";

const CollectionItemList = (props) => {

    const [collections, setCollections] = useState([]);

    const [page, setPage] = useState(1);
    const [noCollections, setNoCollections] = useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');

    useEffect(() => {
        if (props.searchTxt && searchTxt !== props.searchTxt) {
            setSearchTxt(props.searchTxt);
            setCollections([]);
            setNoCollections(false);
            setInitialItemsLoaded(false);
            setLoading(true);
            setPage(1);
            fetchCollections(true);
        }
    }, [props])

    useEffect(() => {
        setLoading(true);
        if (initialItemsLoaded) {
            fetchCollections(false);
        }
    }, [page])

    function fetchCollections(reset) {
        let queryUrl = `${process.env.REACT_APP_API}/search_collections?search=${props.searchTxt}&page=${reset ? 1 : page}`;
        axios.get(queryUrl)
            .then(res => {
                setLoading(false);
                if (res.data.status) {                    
                    if (res.data.collections.length === 0) setNoCollections(true);

                    if (reset) {
                        setCollections(res.data.collections);
                        setInitialItemsLoaded(true);
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(collections));
                        prevArray.push(...res.data.collections);
                        setCollections(prevArray);
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                setNoCollections(true);
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
                {collections.map((collection, index) => (props.limit ?
                    index < 3 && <CollectionItem {...props} collection={collection} key={index} />
                    :
                    <CollectionItem {...props} collection={collection} key={index} />
                ))}
            </div>
            <div className="load-more" style={{ display: noCollections || props.limit ? "none" : "" }}>
                
                <Button label = {loading ? "Loading..." : "Load more"} fillBtn roundFull onClick={() => loadMore()} />
            </div>
        </div>

    )
}

export default CollectionItemList
