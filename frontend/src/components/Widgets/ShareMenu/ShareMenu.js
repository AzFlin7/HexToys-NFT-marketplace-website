import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeContext from '../../../context/ThemeContext';
import share from "../../../assets/images/icons/icon_share.svg";
import share_black from "../../../assets/images/icons/icon_share_black.svg";
import Button from '@material-ui/core/Button';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import './style.scss';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { Twitter, Telegram, Facebook, LinkedIn, WhatsApp, Email } from "@material-ui/icons";
import { TwitterShareButton, TelegramShareButton, EmailShareButton, FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from "react-share";



const ShareMenu = ({ props }) => {
    const { theme } = useContext(ThemeContext)
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const location = useLocation();

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className="share-menu-container">
            <Button ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}>
                <div>
                    {theme === 'dark' ?
                        <img className='icon' src={share} alt={''} /> :
                        <img className='icon' src={share_black} alt={''} />
                    }
                    <h5 className={`text_color_3_${theme}`}>Share</h5>
                </div>
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1000 }} className={'share-popper ' + theme}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <MenuItem className="share-menu-item" onClick={handleClose}>
                                        <TwitterShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            onClick={handleClose}>
                                            <Twitter /> &nbsp; Twitter
                                        </TwitterShareButton>
                                    </MenuItem>
                                    <MenuItem className="share-menu-item" onClick={handleClose}>
                                        <TelegramShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            onClick={handleClose}>
                                            <Telegram /> &nbsp; Telegram
                                        </TelegramShareButton>
                                    </MenuItem>
                                    <MenuItem className="share-menu-item" >
                                        <EmailShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            openShareDialogOnClick={true}
                                            onClick={handleClose}>
                                            <Email /> &nbsp; Email
                                        </EmailShareButton>
                                    </MenuItem>
                                    <MenuItem className="share-menu-item" onClick={handleClose}>
                                        <FacebookShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            onClick={handleClose}>
                                            <Facebook /> &nbsp; Facebook
                                        </FacebookShareButton>                                        
                                    </MenuItem>
                                    <MenuItem className="share-menu-item" onClick={handleClose}>
                                        <LinkedinShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            onClick={handleClose}>
                                            <LinkedIn /> &nbsp; LinkedIn
                                        </LinkedinShareButton>                                        
                                    </MenuItem>
                                    <MenuItem className="share-menu-item" onClick={handleClose}>
                                        <WhatsappShareButton url={process.env.REACT_APP_BASE_URL + location.pathname}
                                            onClick={handleClose}>
                                            <WhatsApp /> &nbsp; WhatsApp
                                        </WhatsappShareButton>                                        
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
};

export default ShareMenu;
