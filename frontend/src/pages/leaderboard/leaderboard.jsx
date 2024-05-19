import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../header/header';
import Footer from '../footer/footer';
import './leaderboard.scss';
import { useLoader } from '../../context/useLoader'
import { Helmet } from "react-helmet";
import ThemeContext from '../../context/ThemeContext';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';

import LeaderBoardCard from '../../components/Cards/LeaderBoardCard';
import LeaderBoardTable from '../../components/LeaderBoardTable/LeaderBoardTable';

function Leaderboard(props) {

    const usetheme = useTheme();
    const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));

    const { theme } = useContext(ThemeContext)

    const [setPageLoading] = useLoader()

    const [users, setUsers] = useState([]);
    useEffect(() => {
        setPageLoading(true);
        axios.get(`${process.env.REACT_APP_API}/leaderboard`)
            .then(res => {
                setPageLoading(false);
                if (res.data.status) {
                    setUsers(res.data.users)
                }
            })
            .catch(err => {
                setPageLoading(false);
                setUsers([]);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [topUsers, setTopUsers] = useState([]);
    useEffect(() => {
        if (users && users.length > 3) {
            if (isMobileOrTablet) {
                setTopUsers(users.slice(0, 3))
            } else {
                setTopUsers([users[1], users[0], users[2]])
            }
        }
    }, [users])

    return (
        <>
            <Helmet>
                <title>HEX TOYS - Leader Board | NFT Marketplace on PulseChain</title>
                <meta content="HEX TOYS - Leader Board | NFT Marketplace on PulseChain" name="title" />
                <meta content="HEX TOYS - Leader Board" name="description" />
                <meta content="HEX TOYS - Leader Board | NFT Marketplace on PulseChain" name="twitter:title" />
                <meta content="https://marketplace.hex.toys/leaderboard" name="twitter:url" />
                <meta content="HEX TOYS - Leader Board | NFT Marketplace on PulseChain" property="og:title" />
                <meta content="HEX TOYS - Leader Board" property="og:description" />
                <meta content="https://marketplace.hex.toys/leaderboard" property="og:url" />
                <meta name="keywords" content="HEX TOYS, Collections, NFT marketplace, PulseChain, buy NFTs, sell NFTs, digital collectibles, Leader Board" />
            </Helmet>

            <Header {...props} />
            <div className='leaderboard'>

                <div className='container'>
                    <div className='title'>
                        <h1 className={`text_color_gradient_${theme}`}>Leader Board</h1>
                    </div>

                    {
                        topUsers && topUsers.length > 0 &&
                        <div className="flex-end column">
                            {topUsers.map((user, index) => (
                                <LeaderBoardCard user={user} key={index} index={index} isMobileOrTablet={isMobileOrTablet} />
                            ))}
                            <div className="effect1"></div>
                        </div>
                    }

                </div>
                {
                    users && users.length > 0 &&
                    <div className="container">
                        <LeaderBoardTable users={users.slice(3)} />
                    </div>
                }

            </div>

            <Footer />
        </>
    );

}

export default Leaderboard;
