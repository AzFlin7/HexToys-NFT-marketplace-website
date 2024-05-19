import styled from 'styled-components';
import {Close} from "@styled-icons/material/Close";

export const Paper = styled.div`
  outline: none !important;    
  
  max-width: 20rem;
  position: relative;
  width: 95vw;
  border-radius: 7px;
  z-index: 2;
  &:hover {
    // box-shadow: 0 0 5px #fff;
    .top-left {
      width: 4rem;
      height: 3rem;
    }
    .bottom-right {
      width: 4rem;
      height: 3rem;
    }
    .middle-border {
      width: 5rem;
    }
  }
  &.bg_dark{
    background-color: #060714;
  }
  &.bg_light{
    background-color: #fff;
  }   
`
export const ModalCloseIcon = styled(Close)`
    transition: all 0.3s ease;
    cursor : pointer; 
    margin-right : 16px;
    &:hover{
        transform: rotate(90deg);
    }
`;

export const ModalHeader = styled.div`
  width: 100%;
  height: 5rem;
  border-bottom: 3px solid #eee;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.border_dark{
    border-color: #000;
  }
  &.border_light{
    border-color: #eee;
  }   
`
export const Title = styled.h1`
  font-size: 1.5rem;
  padding-left: 20px;    
`
export const WalletWrapper = styled.div`
  width: 90%;  
  margin-left: auto;
  margin-right: auto;
  padding-top: 1rem;
  padding-bottom: 2rem;
`
export const WalletItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.8rem;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  background-color: #f96d63;
  background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
  box-shadow: 0 15px 30px #7f6bff4d;
  padding : 10px;
  border-radius: 8px;
  &:hover{
      box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
  }
`
export const WalletLogo = styled.div`
  width: 3rem;
  height: 3rem;  
  border-radius: 50%;
  svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`
export const WalletTitle = styled.h3`
  font-size: 1.2rem;  
  cursor: pointer;  
  color: #fff;
  margin-left: 0.8rem;  
`
export const TopLeftCorner = styled.div`
  position: absolute;
  width: 1rem;
  height: 1rem;
  transition: all .3s ease;
  border-top: 3px solid var(--colorOrange);
  border-left: 3px solid var(--colorOrange);
  top: -3px;
  left: -3px;
  border-top-left-radius: 10px;
`
export const BottomRightRadius = styled.div`
  border-bottom: 3px solid var(--colorOrange);
  border-right: 3px solid var(--colorOrange);
  bottom: -3px;
  right: -3px;
  border-bottom-right-radius: 10px;
  position: absolute;
  width: 1rem;
  height: 1rem;
  transition: all .3s ease;
`
export const MiddleBorder = styled.div`
  width: 2rem; 
  top: -3px;
  border-bottom: 3px solid var(--colorOrange);
  border-top: 3px solid var(--colorOrange);
  position: absolute;
  transition: all .3s ease;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100% + 6px); 
`
