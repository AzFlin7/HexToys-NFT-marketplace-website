import styled from 'styled-components';
// import angle from "../../assets/images/angle.svg";
import angleWhite from "../../assets/images/icons/angle-white.svg";
import search from "../../assets/images/icons/search.png";

export const Container = styled.div`
    min-height: 70vh;
    padding: 0rem 3rem;  
    padding-top: 120px;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0rem 0.5rem; 
        padding-top: 120px;
        h1 {
            padding: 12px;
            font-size: 1.5rem;
            display: block;
        }
    }
    .title{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        h1 {
            text-align: center;        
            -webkit-text-fill-color: transparent;
            background-image: linear-gradient(90deg,#69EACB, #EACCF8, #DB54F1);
            -webkit-background-clip: text;
            background-clip: text;
            font-weight: 600;
            font-size: 36px;
            margin-top: 20px;
            margin: auto;
            padding-bottom: 10px;
            display: inline-block;   
            @media only screen and (max-width: 450px) { 
                font-size: 24px;
            }
            span {
                padding-left: 10px;
                color: #DB54F1;   
                cursor: pointer;
                font-weight: 900; 
            }
        }
    }
`;

export const BodyContainer = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    @media(max-width:1199px){
        max-width: 780px;
    }
    @media(max-width:991px){
        max-width: 680px;
        padding: 0 10px;
    }    
`;

export const FilterBox = styled.div`
    margin: 20px 0;      
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
`;

export const Searchbar = styled.div`
    display: flex;
    flex-wrap: nowrap;
    > div{
        margin-bottom:20px;
    }
    input{
        height:40px;
        border: 1px solid rgba(190, 190, 190, 1);
        border-radius: 4px;
        padding: 8px 16px 8px 50px;
        color: #878787;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        width: 100%;
        margin-bottom:20px;
        background-image: url(${search});
        background-repeat:no-repeat;
        background-position: 10px;
        background-size: 25px; 
    }
    div.totalcard{
        width: 160px; 
        margin-right: 10px;
        position: relative;
        display: flex;
        align-items: center;
        .mob_icon{
            position: absolute;
            left: 16px;
            pointer-events: none;
            display: none;
            @include mobile_potrait{
                display: flex;
            }
        }
    }    
    select{
        background: rgba(26, 26, 26, 1);
        border:0;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        height:40px;
        width:100%;
        display: inline-block;
        padding: 0 16px;
        border-radius: 4px;
        margin-right:8px;
        background-image: url(${angleWhite});
        background-repeat:no-repeat;
        background-position: right;
        background-size: 25px;
        display: inline-block;
        appearance: none;
    }
    .grid-btn{
        display: flex;
        > div{
            border-radius: 4px;
            padding: 6px 10px;
            display: flex;
            align-items:center;
            justify-content:center;
            background: #F2F2F2;
            &.selected{
                background: #F24822;
            }
            &:not(:last-child){
                margin-right:8px;
            }
        }
        
    }
`;
export const FilterContainer = styled.div`
    display: flex;
    @media(max-width:991px){
        display: block;
    }
`;

export const TabingWrap = styled.ul`
    border-radius: 12px;
    border: 1px solid #726CA9;
    margin:0; padding:0;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    overflow :hidden;
    li{
        &.active{
            opacity : 1;  
        }
        &.bg_dark{
            background: #ffffff11;
            color: #fff;
        }
        &.bg_light{
            background: #00000011;
            color: rgba(0, 0, 0, 0.50);
        }      
        display: inline-block;
        text-align: center;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
        padding: 7px 16px; 
        list-style: none;
        cursor: pointer;
        margin:0;
        border-radius: 10px;    
        transition : all 0.3s ease;
        opacity : 0.6;
    }    
`;

export const RowContainer = styled.div`
    display: flex;
    flex-wrap: nowrap; 
    align-items: center;   
`;

export const CheckBoxContainer = styled.div`
    display: flex;
    flex-wrap: nowrap; 
    margin-right: 20px;
    p {
        font-style: normal;
        font-size: 14px;
        cursor: pointer;
        margin: 0;
        padding-left: 5px;        
    }
`;







export const AllStaking = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0;
        display: block;
    }
`;

export const LoadMore = styled.div`
    margin: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
   
`;
