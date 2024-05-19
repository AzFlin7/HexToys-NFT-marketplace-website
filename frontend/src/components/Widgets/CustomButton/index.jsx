import React, {useContext} from 'react';
import './style.scss'
import clsx from 'clsx';
import { Link } from "react-router-dom";
import ThemeContext from '../../../context/ThemeContext';
const Button = (props) => {
  const { theme } = useContext(ThemeContext)

  const { label, fillBtn, outlineBtnColor, outlineBtn, roundFull, greyColor, whiteColor, size = 'md', onClick, disabled, href, router, w_full} = props;
  const classes = `custom_btn ${fillBtn ? 'fillBtn' : ''} ${outlineBtn ? 'outlineBtn' : ''} ${outlineBtnColor ? 'outlineBtnColor' : ''} ${roundFull ? 'roundFull' : ''} ${size === 'md'? 'md' : size === 'sm'? 'sm':'lg'} ${w_full ? 'w_full':''} ${greyColor ? `greyColor_${theme}`:''} ${whiteColor ? `whiteColor_${theme}`:'' }`
  const handClick = ()=>{
    onClick && onClick()
  }
  return (
    href ? 
    (
      router?
        <Link to={href} className={clsx(classes)}>{label}</Link>:
        <a className={clsx(classes)} href={href} target={'_blank'} rel="noreferrer">{label}</a>
    ):
    <button className={clsx(classes)} onClick={handClick} disabled = {disabled || false}>
      {label}
    </button>
  )
}

export default Button
