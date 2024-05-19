import React, { useState,useContext } from 'react';
import axios from 'axios';
import Querystring from "query-string";
import { useActiveWeb3React } from "../../hooks";
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';
import DatePicker from 'react-datepicker'

import { getCurrencyInfoFromAddress, Tokens } from "../../utils";
import { approveNFTOnMarket } from "../../utils/contracts";

import * as Element from "./style";
import "react-datepicker/dist/react-datepicker.css";
import Button from '../Widgets/CustomButton';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalList(props) {
    const { account, library } = useActiveWeb3React();
    const { item, holding, available, showPutMarketPlace, setShowPutMarketPlace } = props;
    const { theme } = useContext(ThemeContext)
    
    const [listingStatus, setListingStatus] = useState(false);
    const [creatingAuctionStatus, setCreatingAuctionStatus] = useState(false);

    const [putType, setPutType] = useState('fixed');
    const [putPrice, setPutPrice] = useState(0);
    const [quantity, setQuantity] = useState('1');
    const [currencyInfo, setCurrencyInfo] = useState(Tokens[0]);

    const [startType, setStartType] = useState('now');
    const [startDate, setStartDate] = useState(null);
    const [endType, setEndType] = useState('1');
    const [endDate, setEndDate] = useState(null);
 
    function putOnMarketPlace() {
        if (putType === 'fixed') {
            putFixed();
        } else if (putType === 'timed') {
            putAuction();
        }
    }

    async function putFixed() {
        // quantity
        if (putPrice <= 0) {
            toast.error("Please input price correctly!");
            return;
        }
        if ((quantity < 1) || (quantity > available)) {
            toast.error("Please input quantity correctly!");
            return;
        }
        setListingStatus(true);

        // check out nft approved status;
        const approve_toast_id = toast.loading("Checking approval...");
        const approvedStatus = await approveNFTOnMarket(item.type, item.itemCollection, account, library);
        toast.dismiss(approve_toast_id);
        if (!approvedStatus) {
            toast.error("Approval failed!");
            setListingStatus(false);
            return;
        }

        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to create pair with this information: ${item.itemCollection}:${item.tokenId}:${currencyInfo.address}:${quantity}:${putPrice}:${account}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setListingStatus(false);
            return;
        }

        // call create_pair backend api 
        const api_toast_id = toast.loading("NFT Listing...");
        const { data } = await axios.post(`${process.env.REACT_APP_API}/market/create_pair`,
            Querystring.stringify({
                itemCollection: item.itemCollection,
                tokenId: item.tokenId,
                tokenAdr: currencyInfo.address,
                amount: quantity,
                price: putPrice,
                owner: account,
                signature: signature
            }));

        toast.dismiss(api_toast_id);
        if (data.status) {
            // success
            setListingStatus(false);
            setShowPutMarketPlace(false);
            toast.success("List Success!");
            await sleep(2000);
            window.location.reload();

        } else {
            setListingStatus(false);
            toast.error(data.message);
        }
    }

    async function putAuction() {
        if (putPrice <= 0) {
            toast.error("Please input price correctly!");
            return;
        }
        const currentTime = new Date().getTime();

        let startTimeStamp = 0;
        if (startType === 'specific') {
            if (!startDate) {
                toast.error("Please select start time.");
                return;
            }
            const startTime = startDate.getTime();
            if (currentTime >= startTime) {
                toast.error("The start time must be after the current time.");
                return;
            }
            startTimeStamp = Math.floor(startTime / 1000);
        } else {
            startTimeStamp = Math.floor(currentTime / 1000);
        }
        // console.log("startTimeStamp");
        // console.log(startTimeStamp);

        let endTimeStamp = 0;
        if (endType === 'specific') {
            if (!endDate) {
                toast.error("Please select end time.");
                return;
            }
            const endTime = endDate.getTime();
            endTimeStamp = Math.floor(endTime / 1000);
            if (currentTime >= endTime) {
                toast.error("The end time must be after the current time.");
                return;
            }
            if (startTimeStamp >= endTimeStamp) {
                toast.error("The end time must be after the start time.");
                return;
            }
        } else {
            const later = Number(endType);
            endTimeStamp = startTimeStamp + 86400 * later;
        }

        setCreatingAuctionStatus(true);

        // check out nft approved status;
        const approve_toast_id = toast.loading("Checking approval...");
        const approvedStatus = await approveNFTOnMarket(item.type, item.itemCollection, account, library);
        toast.dismiss(approve_toast_id);
        if (!approvedStatus) {
            toast.error("Approval failed!");
            setCreatingAuctionStatus(false);
            return;
        }

        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to create auction with this information: ${item.itemCollection}:${item.tokenId}:${startTimeStamp}:${endTimeStamp}:${currencyInfo.address}:${putPrice}:${account}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setCreatingAuctionStatus(false);
            return;
        }


        // call create_auction backend api 
        const api_toast_id = toast.loading("Creating auction...");
        const { data } = await axios.post(`${process.env.REACT_APP_API}/market/create_auction`,
            Querystring.stringify({
                itemCollection: item.itemCollection,
                tokenId: item.tokenId,
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                tokenAdr: currencyInfo.address,
                startPrice: putPrice,
                owner: account,
                signature: signature
            }));

        toast.dismiss(api_toast_id);
        if (data.status) {
            // success
            setCreatingAuctionStatus(false);
            setShowPutMarketPlace(false);
            toast.success("Auction created!");
            await sleep(2000);
            window.location.reload();

        } else {
            setCreatingAuctionStatus(false);
            toast.error(data.message);
        }
    }

    return (
        <>
            {
                item && account && (available > 0) &&
                <Modal
                    isOpen={showPutMarketPlace}
                    onRequestClose={() => setShowPutMarketPlace(false)}
                    ariaHideApp={false}
                    style={{
                        overlay: {
                            position: "fixed",
                            display: "flex",
                            justifyContent: "center",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0, .8)",
                            overflowY: "auto",
                            zIndex: 99,
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '95%',
                            maxWidth: '500px',
                            maxHeight: '600px',
                            borderRadius: '20px',
                            backgroundColor: theme === 'dark' ? '#060714' : '#fff',
                            borderColor: theme === 'dark' ? '#060714' : '#fff',
                            zIndex: 9999
                        },
                    }}
                >
                    <Element.ModalBody>
                        <Element.ModalHeader>
                            <Element.ModalCloseIcon  className = {`text_color_1_${theme}`}size={32} onClick={() => setShowPutMarketPlace(false)} />
                        </Element.ModalHeader>
                        <Element.ModalTitle className = {`text_color_1_${theme}`}>Put on Marketplace</Element.ModalTitle>
                        {item?.type === 'single' &&

                            <Element.PutTypes>
                                <Element.PutType onClick={() => setPutType('fixed')} className={putType === 'fixed' ? 'active' : ''}>
                                    <div className={`content bg_${theme}`}>
                                        <Element.FixedIcon size={32}  className = {`text_color_1_${theme}`}/>
                                        <Element.TypeLabel className = {`text_color_4_${theme}`}>Fixed price</Element.TypeLabel>
                                    </div>
                                </Element.PutType>
                                <Element.PutType onClick={() => {
                                    setPutType('timed');
                                    if (currencyInfo.symbol === 'PLS') {
                                        setCurrencyInfo(Tokens[1])
                                    }
                                    }} className={putType === 'timed' ? 'active' : ''}>
                                    <div className={`content bg_${theme}`}>
                                        <Element.TimeIcon  className = {`text_color_1_${theme}`}size={36} />
                                        <Element.TypeLabel className = {`text_color_4_${theme}`}>Timed auction</Element.TypeLabel>
                                    </div>

                                </Element.PutType>
                            </Element.PutTypes>
                        }
                        
                        {
                            putType === 'fixed' &&
                            <Element.Field>
                                <Element.Label className = {`text_color_1_${theme}`}>Price</Element.Label>
                                <Element.InputContainer className = {`border_${theme}`}>
                                    <Element.Input type={"number"} placeholder={"Enter Price"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                                    <Element.CurrencySelect  className = {`text_color_1_${theme}`}name={"currencies"} defaultValue={currencyInfo.address} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(event.target.value))}>
                                        {
                                            Tokens.map((currencyItem, index) =>
                                                <Element.OrderByOption  className = {`border_${theme}`} key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                                            )
                                        }
                                    </Element.CurrencySelect>
                                </Element.InputContainer>
                                {item.type === 'multi' &&
                                    <>
                                        <Element.Label>Enter quantity <span>({available} available)</span></Element.Label>
                                        <Element.Input
                                            value={quantity}
                                            type={"number"}
                                            className = {`border_${theme}`}
                                            onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
                                            placeholder={"Enter quantity"} />
                                    </>
                                }
                            </Element.Field>
                        }
                        {
                            putType === 'timed' &&
                            <>
                                <Element.Field>
                                    <Element.Label className = {`text_color_4_${theme}`}>Minimum bid</Element.Label>
                                    <Element.InputContainer className = {`border_${theme}`}>
                                        <Element.Input type={"number"} placeholder={"Enter minimum bid"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                                        <Element.CurrencySelect  className = {`text_color_4_${theme}`} name={"currencies"} defaultValue={currencyInfo.address} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(event.target.value))}>
                                            {
                                                Tokens.slice(1).map((currencyItem, index) =>
                                                    <Element.OrderByOption  className = {`border_${theme}`} key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                                                )
                                            }
                                        </Element.CurrencySelect>
                                    </Element.InputContainer>
                                </Element.Field>
                                <Element.SelectRow>
                                    <Element.SelectField>
                                        <Element.Label className = {`text_color_4_${theme}`}>Starting Date</Element.Label>
                                        <Element.StartingDateSelect className = {`border_${theme} text_color_1_${theme}`} name={"starting_date"} defaultValue={startType} onChange={event => setStartType(event.target.value)}>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"now"}>Right after listing</Element.OrderByOption>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"specific"}>Pick specific date</Element.OrderByOption>
                                        </Element.StartingDateSelect>
                                        {
                                            startType === "specific" &&
                                            <DatePicker
                                                selected={startDate}
                                                onChange={value => setStartDate(value)}
                                                className={"input-picker"}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        }
                                    </Element.SelectField>
                                    <Element.SelectField>
                                        <Element.Label className = {`text_color_4_${theme}`}>Expiration Date</Element.Label>
                                        <Element.StartingDateSelect className = {`border_${theme} text_color_1_${theme}`} name={"expiration_date"} defaultValue={endType} onChange={event => setEndType(event.target.value)}>
                                            <Element.OrderByOption className = {`border_${theme}`} name={"starting_date"}value={"1"}>1 day</Element.OrderByOption>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"3"}>3 days</Element.OrderByOption>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"5"}>5 days</Element.OrderByOption>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"7"}>7 days</Element.OrderByOption>
                                            <Element.OrderByOption className = {`border_${theme}`} value={"specific"}>Pick specific date</Element.OrderByOption>
                                        </Element.StartingDateSelect>
                                        {
                                            endType === "specific" &&
                                            <DatePicker
                                                selected={endDate}
                                                onChange={value => setEndDate(value)}
                                                className={`input-picker border_${theme}`}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        }
                                    </Element.SelectField>
                                </Element.SelectRow>
                            </>
                        }

                        <Element.ModalActions>
                            <Button 
                                label = 'Cancel'
                                greyColor roundFull w_full
                                onClick={() => setShowPutMarketPlace(false)}
                            />
                            <Button 
                                label = {
                                    listingStatus || creatingAuctionStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                                fillBtn roundFull w_full
                                onClick={() => putOnMarketPlace()} disabled={listingStatus || creatingAuctionStatus}
                            />
                            
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalList;