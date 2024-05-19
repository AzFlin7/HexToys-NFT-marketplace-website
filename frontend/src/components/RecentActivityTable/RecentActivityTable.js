import './style.scss';
import React, { useContext } from "react";
import { useEnsName } from "wagmi"
import { format } from "date-fns";
import ExportDark from '../../assets/images/icons/export-dark.svg';
import ShoppingCartDark from '../../assets/images/icons/shopping-cart-dark.svg';

import BannerImg from '../../assets/images/banner-img.png';
import unknownImg from "../../assets/images/unknown.jpg";
import { formatNum, getCurrencyInfoFromAddress, shorter } from "../../utils";
import ThemeContext from "../../context/ThemeContext";

export default function RecentActivityTable(props) {
    const { events } = props;
    const { theme } = useContext(ThemeContext);

    const cartEventArray = ['Listed', 'Delist', 'Auction Created', 'Bid', 'Auction Canceled', 'Sold'];
    return (
        <div className="recent-activity-table-container">
            <div className='title'>
                <h1 className={`text_color_gradient_${theme}`}>Recent Activity</h1>
            </div>

            <div className={"table-container " + theme}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th style={{ textAlign: 'left' }}>Item</th>
                            <th>Event</th>
                            <th style={{ textAlign: 'left' }}>Price</th>
                            <th>Quantity</th>
                            <th style={{ textAlign: 'left' }}>From</th>
                            <th style={{ textAlign: 'left' }}>To</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            events.map((event, index) => (
                                <tr key={index} className="desktop">
                                    <td className="number"><img src={(cartEventArray.includes(event.name) ? ShoppingCartDark : ExportDark)} alt='' /> </td>

                                    <td className="image">
                                        <div onClick={() => window.open(`/detail/${event.itemInfo.itemCollection}/${event.itemInfo.tokenId}`, "_self")}>

                                            <img src={(event.itemInfo.isThumbSynced ? event.itemInfo.lowLogo : event.itemInfo.image) || unknownImg} alt='' />
                                            {event.itemInfo.name}
                                        </div>
                                    </td>
                                    <td className="number">{event.name}</td>
                                    <td className="price">
                                        {
                                            event.price > 0 &&
                                            <div>
                                                <p><span>{formatNum(Number(event.price))}</span> {getCurrencyInfoFromAddress(event.tokenAdr).symbol}</p>
                                                {/* <p>${formatNum(Number(item.usd))}</p> */}
                                            </div>
                                        }

                                    </td>
                                    <td className="quantity">{event.amount > 0 ? event.amount : ''}</td>
                                    <td className="from">
                                        {
                                            event.fromUser ?
                                                <span onClick={() => window.open(`/profile/${event.from}`)}>
                                                    {
                                                        event.fromUser.name === 'NoName' ?
                                                            !event.fromUser.ensName || event.fromUser.ensName === "" ? shorter(event.from) : event.fromUser.ensName :
                                                            event.fromUser.name
                                                    }
                                                </span>
                                                :
                                                ''
                                        }
                                    </td>
                                    <td className="to">
                                        {
                                            event.toUsers ?
                                                <span onClick={() => window.open(`/profile/${event.to}`)}>
                                                    {
                                                        event.toUsers.name === 'NoName' ?
                                                            !event.toUsers.ensName || event.toUsers.ensName === "" ? shorter(event.to) : event.toUsers.ensName :
                                                            event.toUsers.name
                                                    }
                                                </span>

                                                :
                                                ''
                                        }
                                    </td>
                                    <td className="rarity">{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</td>
                                </tr>
                            ))
                        }
                        {
                            events.map((event, index) => (
                                <tr key={index} className="mobile">
                                    <td colSpan={7}>
                                        <div className="image-container">
                                            <div className="avatar">
                                                <img src={cartEventArray.includes(event.name) ? ShoppingCartDark : ExportDark} alt='' />
                                                {event.name}
                                            </div>
                                            <div className="avatar">
                                                <img src={(event.itemInfo.isThumbSynced ? event.itemInfo.lowLogo : event.itemInfo.image) || unknownImg} alt='' />
                                                <label>{event.itemInfo.name}</label>
                                            </div>
                                        </div>
                                        {
                                            event.price > 0 &&
                                            <div className="info-container">
                                                <label>Price</label>
                                                <div className="price">
                                                    <p><span>{formatNum(Number(event.price))}</span> {getCurrencyInfoFromAddress(event.tokenAdr).symbol}</p>
                                                </div>
                                            </div>
                                        }
                                        {
                                            event.amount > 0 &&
                                            <div className="info-container">
                                                <label>Quantity</label>
                                                <p>{event.amount}</p>
                                            </div>
                                        }

                                        {
                                            event.fromUser &&
                                            <div className="info-container">
                                                <label>From</label>
                                                <p className={"from"} onClick={() => window.open(`/profile/${event.from}`)}>
                                                    {
                                                        event.fromUser.name === 'NoName' ?
                                                            !event.fromUser.ensName || event.fromUser.ensName === "" ? shorter(event.from) : event.fromUser.ensName :
                                                            event.fromUser.name
                                                    }
                                                </p>
                                            </div>
                                        }

                                        {
                                            event.toUsers &&
                                            <div className="info-container">
                                                <label>To</label>
                                                <p className={"from"} onClick={() => window.open(`/profile/${event.to}`)}>
                                                    {
                                                        event.toUsers.name === 'NoName' ?
                                                            !event.toUsers.ensName || event.toUsers.ensName === "" ? shorter(event.to) : event.toUsers.ensName :
                                                            event.toUsers.name
                                                    }
                                                </p>
                                            </div>
                                        }
                                        <div className="info-container">
                                            <label>Time</label>
                                            <p className={"time"}>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}