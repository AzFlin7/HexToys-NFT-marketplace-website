import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import clsx from 'clsx';
import ThemeContext from '../../context/ThemeContext';

import discord from "../../assets/images/icons/discord.png";
import Instagram from "../../assets/images/icons/Instagram.png";
import twitter from "../../assets/images/icons/twitter.png";
import Telegram from "../../assets/images/icons/Telegram.png";
import GitHub from "../../assets/images/icons/GitHub.png";
import socialImg4 from "../../assets/images/icons/social-icon-4.svg";
import socialImg5 from "../../assets/images/icons/trustpilot.svg";
import Logo_White from "../../assets/images/logo_white.png";
import Logo_Black from "../../assets/images/logo_black.png";
import google from "../../assets/images/icons/google.png";
import apple from "../../assets/images/icons/apple.png";


function Footer() {
    const { theme } = useContext(ThemeContext)
    return (
        <div className='footer'>
            <div className='container'>
                <div className='footer_links'>
                    <div className='logo'>
                        <Link  to="/" ><img src={theme === 'dark' ? Logo_White:Logo_Black} alt=''/></Link>
                        <p className={clsx(`text_color_5_${theme}`)}>The future is in your hands</p>
                    </div>
                    <ul>
                        <li className='link-title'>
                            <h2 className={clsx(`text_color_5_${theme}`)}>Community</h2>
                        </li>
                        <li><a href="https://discord.gg/hextoys" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Discord</a></li>
                        <li><a href="https://twitter.com/HEXTOYSOFFICIAL" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Twitter</a></li>
                        <li><a href="https://www.instagram.com/hextoysofficial/" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Instagram </a></li>
                        <li><a href="https://t.me/hextoys" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Telegram</a></li>                            
                    </ul>
                    <ul>
                        <li className='link-title'>
                            <h2 className={clsx(`text_color_5_${theme}`)}>Info & Support</h2>
                        </li>                            
                        <li><a href="https://blog.hex.toys/"  className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Blog </a></li>
                        <li><a href="https://t.me/hextoys/147555" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer" >Support </a></li>
                        <li><a href="https://support.hex.toys/" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Help </a></li>                            
                        <li><a href="https://github.com/orgs/Hex-Toys/discussions" className={clsx(`text_color_1_${theme}`)} target="_blank" rel="noreferrer">Discussion </a></li>                            
                    </ul>
                    <ul className='flex-wrap'>
                        <li className='link-title'>
                            <h2 className={clsx(`text_color_5_${theme}`)}>Coming Soon</h2>
                        </li>
                        <li className='w-50'>
                            <a href="https://google.com" target="_blank" rel="noreferrer">
                                <img src={google} alt="" className={`img_${theme}`} />
                            </a>
                        </li>                            
                        <li className='w-50'>
                            <a href="https://www.apple.com/store" target="_blank" rel="noreferrer">
                                <img src={apple} alt="" className={`img_${theme}`} />
                            </a>
                        </li>                            
                    </ul>
                </div>
                <div className='bottom'>
                    <p className={clsx(`text_color_5_${theme}`)}>Copyright © Hex Toys 2023</p>
                    <ul className='social-icons'>
                        <li>
                            <a  href="https://discord.gg/hextoys" target="_blank" rel="noreferrer">
                                <img src={discord} alt=''/>
                            </a>
                        </li>
                        <li>
                            <a  href="https://www.instagram.com/hextoysofficial" target="_blank" rel="noreferrer">
                                <img src={Instagram} alt=''/>
                            </a>
                        </li>
                        <li>
                            <a  href="https://twitter.com/HEXTOYSOFFICIAL" target="_blank" rel="noreferrer">
                                <img src={twitter} alt=''/>
                            </a>
                        </li>
                        <li>
                            <a  href="https://t.me/hextoys" target="_blank" rel="noreferrer">
                                <img src={Telegram} alt=''/>
                            </a>
                        </li>
                        <li>
                            <a  href="https://github.com/orgs/Hex-Toys/discussions" target="_blank" rel="noreferrer">
                                <img src={GitHub} alt=''/>
                            </a>
                        </li>  

                        <li>
                            <a  href="https://scan.pulsechain.com/token/0x158e02127C02Dce2a9277bdc9F1815C91F08E812/token-transfers" target="_blank" rel="noreferrer">
                                <img src={socialImg4} alt=''/>
                            </a>
                        </li>
                        <li>
                            <a  href="https://uk.trustpilot.com/review/hex.toys" target="_blank" rel="noreferrer">
                                <img src={socialImg5} alt=''/>
                            </a>
                        </li>
                                                  
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Footer;


