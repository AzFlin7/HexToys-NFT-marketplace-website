import styled from 'styled-components';

export const Container = styled.div`
    min-height: 70vh;
    padding-top: 135px;
    padding-bottom: 60px;
    @media(max-width:450px){        
        padding-top: 125px;
        .mysterybox-header .mysterybox-header-user-context {
            flex-flow: column;
            align-items: center;
            top: 20%;
            width: 100%;
            left: 0;
            margin: 0 auto;
        }
        .mysterybox-header-user-context .mysterybox-content-box {
            flex-flow: column;
            align-items: center;            
        }
        .mysterybox-content-box .mysterybox-content {
            text-align: center;
            margin: 0;
            width: 95%;
        }

        .cards-content .all-cards {
            padding: 0;
            display: block;
                 
        }
    }    
    .mysterybox-header {
        position: relative;
        padding: 100px 100px;
        background: linear-gradient(90deg, #69EACB 0%, #EACCF8 48%, #DB54F1 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF);

        @media(max-width:640px){ 
            padding: 50px 100px; 
        }
    }
    .mysterybox-header-user-context {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top : -130px;
        @media(max-width:640px){ 
            margin-top : -50px;
        }
        img {
            width: 200px;
            aspect-ratio: 1/1;
            border-radius: 16px;
            object-fit: cover;
            box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
            background: white;
            @media(max-width:640px){ 
                width: 100px;
            }
        }
        .mysterybox-content-box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 8px;                
        }
        .user-setting-container{
            @media(max-width:991px){ 
                position: fixed;
                top: 120px;
                right: 20px;
            }                
        }
        .mysterybox-content {
            min-width: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;  
            &.dark{
                .displayed-text{
                    color: #FFFFFF99;
                }
            }
            &.light{
                .displayed-text{
                    color: #00000099;
                } 
            }
            h1 {
                font-size: 32px;
                margin: 0;
                font-weight: 700;
                @media(max-width:640px){ 
                    font-size: 26px;
                }
            }
            h2{
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .price-content {
                margin-top: 12px; 
                width: 100%;
                border-radius: 16px;
                display: flex;
                flex-wrap: wrap;
                box-sizing : border-box;
                padding: 10px;
                &.border_dark{
                    border: 1px solid #FFFFFF33
                }
                &.border_light{
                    border: 1px solid #00000033
                }
                .price-sub-content {
                    flex: 0 0 48%;
                    max-width: 48%;  
                    position: relative;
                    width: 100%;
                    text-align: center;
                    .inline-block{
                        display: inline-block;
                        @media(max-width:640px){ 
                            font-size: 18px;
                        }
                    }
                    .price-detail{
                        font-weight: 600;
                        margin-bottom : 0;
                        @media(max-width:640px){ 
                            font-size: 12px;
                        }
                    }                        
                }
                .price-middle-content {
                    flex: 0 0 3%;
                    position: relative;
                    width: 100%;
                    padding: 1.5%;
                    text-align: center;
                    div{
                        width: 1px;
                        height: 100%;
                        &.dark{
                            background: #FFFFFF33
                        }
                        &.light{
                            background: #00000033
                        }
                    }

                }
            }
            .action-container {
                margin-top: 20px;
                .action-unlock {
                    display: inline-block;
                    cursor: pointer;
                    color: #fff;
                    font-weight: 700;
                    background: linear-gradient(90deg,#9c5227,#f17f3c);
                    border-radius: 100px;
                    padding: 0.75rem 1.75rem;
                    font-size: 1.125rem;
                    line-height: 1.5;
                }                    
            }                
        }
        .user-setting {
            padding: 10px;
            display: flex;
            align-items: center;
            background: var(--buttonColor);
            color: white;
            border-radius: 50%;
            svg{
                width: 20px;
                height: 20px;
            }
        }
    }
    @media(max-width:991px){ 
        
        .cards-content {
            max-width: 680px;
        }
    }
    @media(max-width:1199px){ 
        .cards-content {
            max-width: 780px;
        }
    }  
    .search_div{
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        width : 100%;
        max-width : 850px;
        margin: auto;
        margin-top : 16px;
        @media(max-width:640px){ 
            max-width : 90%;
        }
        
        button{
            position: absolute;
            border : none;
            background: #ffffff00;
            font-size: 20px;
            left : 8px;
            color: #555;
        }
        input {
            padding: 11px;
            font-size: 16px;
            line-height: 22px;
            padding: 8px 16px 8px 50px;
            box-sizing: border-box;
            height: 36px;
            border: none;
            border-radius: 12px;
            width: 100%;
            &:focus{
                outline: none;
            }
            @media(max-width:640px){ 
                width: 100%;
            }
            &.bg_dark{
                background: #ffffff0a;

            }
            &.bg_light{
                background: #0000000a;
            }
        }
    }
    .cards-content {
        width: 95%;
        margin: 1rem auto;
        max-width: 1480px;  
        padding: 0 20px;
        position: relative;
        min-height: 70vh; 
        h1{
            background: linear-gradient(90deg,#b78524,#f5eccf);
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -webkit-text-fill-color: transparent; 
            -moz-text-fill-color: transparent;
            span {
                padding-left: 10px;
                background: linear-gradient(90deg,#dc7437,#f24822);
                -webkit-background-clip: text;
                -moz-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
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
        .all-cards {
            display: flex;
            flex-wrap: wrap;    
            justify-content: center;
        }
        .load-more{
            display: flex;
            align-items: center;
            justify-content: center;
        }  
    }
    .ant-modal-root{

        *, ::after, ::before {
            box-sizing: border-box;
        }
        .ant_container{
            top: 150px;
            width: 450px;
            position: relative;
            margin: 0 auto;
            @media(max-width:640px){ 
                width: 100%;
            }
        }
        .ant-modal-mask{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            height: 100%;
            background-color: rgba(0,0,0,.45);
            backdrop-filter: blur(15px);
            *, ::after, ::before {
                box-sizing: border-box;
            }
        }
        .ant-modal-wrap{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            outline: 0;
            -webkit-overflow-scrolling: touch;
            z-index: 1000;
            *, ::after, ::before {
                box-sizing: border-box;
            }
            .ant_modal_content{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction : column;
                .title{
                    font-size : 40px;
                    @media(max-width:640px){ 
                        font-size : 24px;
                    }
                }
                .video_div{
                    width : 100%;
                    video{
                        width : 100%;
                    }

                }
                
            }
        }
    }  
`;