import styled from 'styled-components';

export const Paper = styled.div`
  outline: none !important;    
  background-color: white;
  max-width: 300px;
  position: relative;
  width: 95vw;
  border-radius: 7px;
  &:hover {
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
`
export const ModalContents = styled.div`
  padding: 2rem;
  p {
    font-size: 16px;
    font-weight: 400;
    max-width: 600px;
    margin: 0 0 20px;
    color: #777;
    line-height: 1.6;
  }
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
