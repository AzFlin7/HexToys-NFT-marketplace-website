import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";
import axios from 'axios';
import { PlusCircleOutlined } from "@ant-design/icons";
import * as Element from './styles';

import Header from '../header/header';
import Footer from '../footer/footer';

import StakingItem from "../../components/StakingItem";
import ModalCreateStaking from '../../components/modals/modal-create-staking';
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "../../components/Widgets/CustomButton";
import MySelect from "../../components/Widgets/MySelect";
import clsx from "clsx";
import ThemeContext from '../../context/ThemeContext';
function NftStaking(props) {
    const { theme } = useContext(ThemeContext)
    const [stakedOnly, setStakedOnly] = useState(false);
    const [finishStatus, setFinishStatus] = useState(false);
    const sortOptions = [
        { label: 'Hot', value: 'Hot' },
        { label: 'APR', value: 'APR' },
        { label: 'Total Staked', value: 'Total Staked' },
    ];
    const [sortText, setSortText] = useState('Hot');
    // const [searchTxt, setSearchTxt] = useState('');

    const { account } = useActiveWeb3React();

    const [stakings, setStakings] = useState([]);
    const [page, setPage] = useState(1);
    const [noStakings, setNoStakings] = useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showCreateStaking, setShowCreateStaking] = useState(false);

    useEffect(() => {
        setStakings([]);
        setNoStakings(false)
        setInitialItemsLoaded(false);
        setLoading(true);
        setPage(1);
        fetchStakings(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakedOnly, finishStatus, sortText, account])

    useEffect(() => {
        setLoading(true)
        if (initialItemsLoaded) {
            fetchStakings(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchStakings(reset) {
        let paramData = {
            finishStatus: finishStatus
        }
        if (account) {
            paramData.account = account;
        }

        if (stakedOnly) {
            paramData.stakedOnly = stakedOnly;
        }
        // if (searchTxt) {
        //     paramData.search = searchTxt;
        // }

        switch (sortText) {
            case 'Hot':
                paramData.sortBy = 'hot';
                break;
            case 'APR':
                paramData.sortBy = 'apr';
                break;
            case 'Total Staked':
                paramData.sortBy = 'total_staked';
                break;
            default:
                break;
        }

        if (reset) {
            paramData.page = 1;
        } else {
            paramData.page = page;
        }

        axios.get(`${process.env.REACT_APP_API}/stakings`, {
            params: paramData
        })
            .then(res => {
                setLoading(false);
                if (res.data.status) {                    
                    if (res.data.stakings.length === 0) setNoStakings(true)
                    if (reset) {
                        setStakings(res.data.stakings)
                        setInitialItemsLoaded(true)
                    } else {
                        let prevArray = JSON.parse(JSON.stringify(stakings))
                        prevArray.push(...res.data.stakings)
                        setStakings(prevArray)
                    }
                }
            })
            .catch(err => {
                setLoading(false)
                // console.log(err)
                setNoStakings(true)
            })
    }

    function loadMore() {
        if (!loading) {
            setPage(page => { return (page + 1) })
        }
    }

    return (

        <div>
            <Header {...props} />
            <Element.Container>
                <div className="title">
                    <h1>NFT Staking
                        {
                            account &&
                            <PlusCircleOutlined onClick={() => setShowCreateStaking(true)} />
                        }
                    </h1>
                </div>
                

                <Element.BodyContainer>
                    <Element.FilterBox>
                        <Element.FilterContainer>
                            {/* <Element.Searchbar>
                                <input type='text' placeholder="Search"
                                    onChange={e => setSearchTxt(e.target.value)} value={searchTxt} />

                            </Element.Searchbar> */}
                            <Element.Searchbar>
                                <div className="totalcard">
                                    <MySelect
                                        value={sortText}
                                        options={sortOptions}
                                        onChange={setSortText}
                                        className={clsx('filter_select', 'light')}
                                    />
                                </div>
                            </Element.Searchbar>
                        </Element.FilterContainer>
                        <Element.RowContainer>
                            {
                                account &&
                                <Element.CheckBoxContainer>
                                    <Checkbox
                                        checked={stakedOnly}
                                        onChange={(event) => setStakedOnly(event.target.checked)}
                                    />
                                    <p className={`text_color_4_${theme}`}>
                                        Staked Only
                                    </p>
                                </Element.CheckBoxContainer>
                            }

                            <Element.TabingWrap>
                                <li className={`${finishStatus ? `text_color_4_${theme}` : `active bg_${theme}` }`}
                                    onClick={() => setFinishStatus(false)}>
                                    Live
                                </li>
                                <li className={`${finishStatus ? `active bg_${theme}` : `text_color_4_${theme}`} `}
                                    onClick={() => setFinishStatus(true)}>
                                    Finished
                                </li>
                            </Element.TabingWrap>
                        </Element.RowContainer>

                    </Element.FilterBox>
                    <Element.AllStaking>
                        {stakings.map((staking, index) =>
                            <StakingItem staking={staking} key={index} />
                        )}
                    </Element.AllStaking>
                    <Element.LoadMore style={{ display: noStakings ? "none" : "" }}>
                        <Button label = {loading ? "Loading..." : "Load More"} onClick={() => loadMore()} fillBtn roundFull/>
                    </Element.LoadMore>
                </Element.BodyContainer>
            </Element.Container>
            <Footer />
            <ModalCreateStaking
                showCreateStaking={showCreateStaking}
                setShowCreateStaking={setShowCreateStaking}
            />
        </div>
    );

}

export default NftStaking
