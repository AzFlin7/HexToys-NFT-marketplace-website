import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios'
import Masonry from 'react-masonry-css';
import * as Element from './styles';
import MysteryBoxCard from "../../components/Cards/MysteryBoxCard";
import Header from '../header/header';
import Footer from '../footer/footer';
import ThemeContext from '../../context/ThemeContext';
import ModalCreateMysteryBox from "../../components/modals/modal-create-mysterybox";
import Button from "../../components/Widgets/CustomButton";

function MysteryBoxes(props) {
    const breakpoint = {
        default: 4,
        1840: 4,
        1440: 4,
        1280: 3,
        1080: 2,
        768: 2,
        450: 1,
    };

    const { theme } = useContext(ThemeContext)
    const { account } = useActiveWeb3React();
    const [mysteryBoxes, setMysteryBoxes] = useState([]);
    const [page, setPage] = useState(1);
    const [noMysteryBoxes, setNoMysteryBoxes] = useState(false);
    const [initialMysteryBoxesLoaded, setInitialMysteryBoxesLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchTxt, setSearchTxt] = useState("");

    useEffect(() => {
        setMysteryBoxes([])
        setNoMysteryBoxes(false)
        setInitialMysteryBoxesLoaded(false)
        setLoading(true)
        setPage(1)
        fetchMysteryBoxes(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, searchTxt])

    useEffect(() => {
        setLoading(true)
        if (initialMysteryBoxesLoaded) {
            fetchMysteryBoxes(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchMysteryBoxes(reset) {
        let queryUrl = `${process.env.REACT_APP_API}/mysteryboxes?page=${reset ? 1 : page}${searchTxt ? '&searchTxt=' + searchTxt : ''}`

        axios.get(queryUrl)
            .then(res => {
                if (res.data.status) {
                    setLoading(false);
                    if (res.data.mysteryboxes.length === 0) setNoMysteryBoxes(true)
                    if (reset) {
                        setMysteryBoxes(res.data.mysteryboxes)
                        setInitialMysteryBoxesLoaded(true)
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(mysteryBoxes))
                        prevArray.push(...res.data.mysteryboxes)
                        setMysteryBoxes(prevArray)
                    }
                }
            })
            .catch(err => {
                setLoading(false)
                setNoMysteryBoxes(true);
            })
    }

    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) })
        }
    }

    const [showCreateMysteryBox, setShowCreateMysteryBox] = useState(false);

    return (

        <div>
            <Header {...props} />
            <Element.Container>
                <div className="title">
                    <h1 className={`text_color_gradient_${theme}`}>Hypercubes
                        {/* {
                            account &&
                            <span onClick={() => setShowCreateMysteryBox(true)}>+</span>
                        } */}
                    </h1>       
                </div>
               

                <Element.BodyContainer>
                    <div className="filterBox">
                        <div className="mysterybox-box">
                            <input type="text" value={searchTxt} className={`form-search bg_${theme}`} placeholder="Search"
                                onChange={event => { setSearchTxt(event.target.value) }} />
                            <button><i className="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div className="all-mysteryboxes">
                        <Masonry
                            breakpointCols={breakpoint}
                            className={'masonry'}
                            columnClassName={'gridColumn'}
                        >
                           {mysteryBoxes.map((mysteryBox, index) => (
                            <MysteryBoxCard {...props} mysterybox={mysteryBox} key={index} />
                        ))}
                        </Masonry>

                        
                    </div>
                    <div className="load-more" style={{ display: noMysteryBoxes ? "none" : "" }}>
                        <Button label = {loading ? "Loading..." : "Load more"} outlineBtnColor roundFull onClick={() => loadMore()}/>
                    </div>
                </Element.BodyContainer>
            </Element.Container>
            <Footer />
            <ModalCreateMysteryBox
                showCreateMysteryBox={showCreateMysteryBox}
                setShowCreateMysteryBox={setShowCreateMysteryBox}
            />
        </div>
    );

}

export default MysteryBoxes
