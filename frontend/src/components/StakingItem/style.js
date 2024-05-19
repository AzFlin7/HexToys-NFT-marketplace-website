import styled from 'styled-components';
import {Close} from "@styled-icons/material/Close";

export const Container = styled.div`
    border: 1px solid var(--lightGrayColor);
    border-radius: 1rem;
    /* padding: 1.5rem; */
    margin: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.08);
    background: #fefefe;
    flex: 0 1 350px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .node-preview{
        border-radius: 12px;
        overflow: hidden;
        background: #fefefe;
        height: 240px;  
        cursor: pointer;
        img{
            object-fit: cover;
            border-radius: 12px;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;
        }
    }
    .node-main-content{
        padding: 1rem;
        padding-top: 0;        
    }
`;


export const ModalBody = styled.div`
  padding: 8px 12px;
`;
export const ModalHeader = styled.div`
    position: relative;   
`;
export const ModalCloseIcon = styled(Close)`
    position: absolute;
    top: 0;
    right: 0;
`;
export const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  text-align: center;
`;
export const ModalAction = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;
export const ModalButton = styled.div`
    background-color: #F24822;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    color:white;
`;
export const ModalRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
`;

export const ModalText1 = styled.div`
    font-size: 0.75rem;
    color: #000000;
    @media (min-width: 640px){
        font-size: 0.875rem;
    }    
    @media (min-width: 1024px){
        font-size: 1rem;
    }    
`;

export const ModalText2 = styled.div`
    font-size: 0.75rem;
    color: #333333;
    font-weight: 400;
    @media (min-width: 640px){
        font-size: 0.875rem;
    }    
    @media (min-width: 1024px){
        font-size: 1rem;
    }    
`;

export const ModalText3 = styled.div`
    font-size: 0.75rem;
    color: #6640FF;
    cursor: pointer;
    @media (min-width: 640px){
        font-size: 0.875rem;
    }    
    @media (min-width: 1024px){
        font-size: 1rem;
    }    
`;
export const ModalText4 = styled.div`
    font-size: 0.675rem;
    color: #333333;
    font-weight: 400;
    @media (min-width: 640px){
        font-size: 0.75rem;
    }    
    @media (min-width: 1024px){
        font-size: 0.875rem;
    }    
`;
export const ModalText5 = styled.div`
    font-size: 0.675rem;
    color: #111;
    font-weight: 400;
    @media (min-width: 640px){
        font-size: 0.75rem;
    }    
    @media (min-width: 1024px){
        font-size: 0.875rem;
    }   
`;

export const EarnContainer = styled.div`
    border-radius: 5px;
    background-color: #cad2e164; 
    padding: 1rem; 
    margin-top: 0.5rem; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
`;
export const EarnTitle = styled.div`
    color: rgb(102 64 255);
    font-weight: 600;
    font-size: 1.5rem;    
`;
export const EarnContent = styled.div`
    display: flex; 
    justify-content: flex-start;
    align-items: center;
`;
export const EarnValue = styled.div`
    color: #000;
    font-weight: 600;
    font-size: 1.5rem; 
`;

export const DetailContainer = styled.div`
    background-color: #cad2e164; 
    padding: 1rem; 
    margin-top: 0.5rem; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
`;

export const TitleView = styled.div`
    display: flex; 
    justify-content: center; 
    align-items: center;
    cursor: pointer;
    
    font-size: 0.675rem;
    color: #111;
    font-weight: 400;
    @media (min-width: 640px){
        font-size: 0.75rem;
    }    
    @media (min-width: 1024px){
        font-size: 0.875rem;
    }   
    
    p {
        color: #000;
        font-weight: 700;
        margin-right: 0.25rem; 
        user-select: none; 
        font-size: 0.75rem;
        margin: 0;
        padding-right: 5px;
        @media (min-width: 640px){
            font-size: 1rem;
        }
    }
    svg {
        width: 0.75rem;
        stroke: #310063;
        .transition-all {
            transition-duration: .15s;
            transition-property: all;
            transition-timing-function: cubic-bezier(.4,0,.2,1);
        }
    }
    .rotate-180{
        transform: translate(0,0) rotate(180deg) skewX(0) skewY(0) scaleX(1) scaleY(1);
    }
`;
export const DetailContent = styled.div`
    border-radius: 5px;
    background-color: #cad2e164; 
    padding: 1rem; 
    margin-top: 0.5rem; 
    display: flex; 
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
`;
export const BottomSubView = styled.div`
    display: flex; 
    justify-content: flex-end;
    align-items: center;
    margin-top: 0.5rem;
    p {
        padding-right: 0.5rem;
        margin: 0;
        border-color: #000;
        font-size: 0.675rem;
        color: #000;
        cursor: pointer;
        &:hover {
            border-bottom-width: 1px;
        }
        @media (min-width: 640px){
            font-size: 0.75rem;
        }    
        @media (min-width: 1024px){
            font-size: 0.875rem;
        }
    }
    .link{
        width: 1rem;
        height: 1rem;
        stroke: #140d36;              
    }
`;

export const NFTContainer = styled.div`
    padding: 1rem; 
    display: grid; 
    height: auto;
    grid-template-columns: repeat(1,minmax(0,1fr));
    max-height: 400px;
    overflow: auto;
    @media (min-width: 400px){
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
    @media (min-width: 600px){
        grid-template-columns: repeat(3,minmax(0,1fr));
    }
    
`;

export const NFTContent = styled.div`
    overflow: hidden;
    border-radius: 0.375rem;
    position: relative;
    cursor: pointer;
    margin: 5px;
    .amount {
        position: absolute; 
        top: 0; 
        right: 0;
        background-color: #F24822;
        padding: 0.25rem 0.5rem; 
        border-bottom-left-radius: 0.5rem;
        p {
            color: #fff; 
            font-size: 0.75rem;
            margin: 0;
        }
    }
    .check {
        position: absolute; 
        top: 0; 
        left: 2px;       
    }
    .imageContainer {
        width: 100%;
        height: 120px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .inputContainer {
        width: 100%;
        padding: 0 0.125rem;
        input {
            border-width: 1px;
            padding: 0.5rem 0.75rem;
            border-color: #6b7280;
            appearance: none;
            margin: 0.5rem 0; 
            background: transparent; 
            color: #000; 
            outline: 2px solid transparent;
            outline-offset: 2px;
            width: 100%; 
            border-radius: 0.375rem;
            font-size: 0.75rem;
        }
    }
`;