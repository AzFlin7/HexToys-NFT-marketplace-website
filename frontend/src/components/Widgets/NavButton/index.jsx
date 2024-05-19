import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from "react-router-dom";
import ThemeContext from '../../../context/ThemeContext';

import './navButton.scss';
import clsx from 'clsx';
function NavButton(props) {
   const { theme } = useContext(ThemeContext)

   const {disconnect, url, isMenu, label, isActive, router, external, menuList } = props;
   const [showSubMenu, setShowSubMenu] = useState(false); // explore subview

   const onClickMenu = ()=>{
      setShowSubMenu(!showSubMenu);
   }
   
   const handleOutsideClick = (e) => {
      setShowSubMenu(false);
    };

   const ref = useRef(null);
   useEffect(() => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handleOutsideClick(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref]);


   return (
      isMenu ? 
      <div className={clsx('menu-item', isActive ? 'active' : '')} onClick={() => onClickMenu()} ref={ref}>
         <div className={`label text_color_${theme}`}>{label}</div>
         <div className={clsx('drop_down', showSubMenu ? 'active_drop' : '')}>
            <div className={`drop_down_list left bg_${theme}`}>
               {menuList.map((d, k)=>(
                  <Link to={d?.url} className={clsx('drop_down_item', d.class)} key={k} onClick = {()=>{
                     if (d?.url === '#') {
                        disconnect()
                     }                     
                  }}>{d?.label}</Link>
               ))}
            </div>
         </div>
      </div>:(
         router ? 
         <Link to={url} className={clsx('menu-item', isActive ? 'active' : '')} onClick={() => onClickMenu()}>
            <div className={`label text_color_${theme}`}>{label}</div>
         </Link>:
         <a className={clsx('menu-item', isActive ? 'active' : '')} href={url} target={external ? '_blank' : undefined} onClick={() => onClickMenu()} rel="noreferrer">
          <div className={`label text_color_${theme}`}>{label}</div>
        </a>
      )
      


   );
}

export default NavButton;

