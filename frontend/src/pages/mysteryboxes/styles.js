import styled from 'styled-components';

export const Container = styled.div`
    min-height: 70vh;
    padding: 0rem 3rem;  
    padding-top: 135px;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0rem 1rem; 
        padding-top: 125px;
        .all-mysteryboxes {
            padding: 0;
            display: block;
        }
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
            font-weight: 600;
            font-size: 36px;
            margin-top: 20px;
            margin: auto;
            padding-bottom: 10px;
            display: inline-block;   
            @media only screen and (max-width: 450px) { 
                font-size: 24px;
            }
            span{
                width : 36px;
                height : 36px;
                border : 1px #DB54F1 solid;
                line-height : 1;
                border-radius : 50%;
                margin-left : 8px;
                cursor : pointer;
            }
        }
    }
    
    .all-mysteryboxes {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
        .masonry{
            width: 100%;
            display: flex;
            grid-area: auto;
            .gridColumn{
                width: 100%;
                padding: 8px;
                box-sizing : border-box;
                @media(max-width:640px){ 
                    padding: 0px;
                }
            }
        }
    }
    .load-more{
        margin: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
    }    
`

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
    }
    .filterBox{
        margin: 20px 0;      
        display: flex;
        justify-content: center;  
        .mysterybox-box{
            display: flex;
            align-items: center;
            width: 100%;
            position: relative;
            max-width: 1000px;
            @media(max-width:1199px){
                max-width: 500px;
            }
        }
        button{
            position: absolute;
            border : none;
            background: #ffffff00;
            font-size: 20px;
            left : 16px;
            color: #555;
        }
       
        .form-search{
            background-position:left 40px center;
            background-repeat: no-repeat;
            padding: 0 40px;
            padding-left: 76px;
            border: 1px solid #726CA9;
            border-radius: 50px;
            height: 60px;
            font-size: 20px;
            flex: 1;       
            &:focus-visible{
                outline: unset;
            }
            &.bg_dark{
                background: #ffffff05;
                color: #fff;
            }
            &.bg_light{
                background: #00000005;
                color: rgba(0, 0, 0, 0.50);
            }
            @media(max-width:991px){
                padding: 0 20px;
                padding-left: 56px;
                box-sizing: border-box;
                width : 100%;
            }
            
        }
    }
    input{
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
    }    
`