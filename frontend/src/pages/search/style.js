import styled from 'styled-components';

export const Container = styled.div`
    padding-top: 100px;
    text-align: left;
    width: 90%;
    margin: 1rem auto;
    min-height : 80vh;
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
    @media only screen and (max-width: 450px) {
        padding-top: 90px;
        h1 {
            font-size: 1.5rem;
        }
    }
    .dark{
        .ant-tabs-tab-btn{
            color : #ffffff88;
        }

    }
    .light{
        .ant-tabs-tab-btn{
            color : #00000088;
        }

    }
`;