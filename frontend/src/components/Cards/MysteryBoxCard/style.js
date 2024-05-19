
import styled from 'styled-components';

export const Container = styled.div`
    border-radius: 1rem;
    margin-bottom: 16px;
    padding: 16px;
    position: relative;
    overflow: hidden;
    flex: 0 1 500px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    width: 100%;
    &.bg_dark{
        border: 1px solid #FFFFFF26;
        background: #FFFFFF08;
    }
    &.bg_light{
        border: 1px solid #00000026;
        background: #00000008;
    }

    .node-preview{
        border-radius: 12px;
        overflow: hidden;
        height: 0px;  
        padding-bottom: 100%;
        cursor: pointer;
        position : relative;
        img{
            object-fit: cover;
            border-radius: 12px;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;
            position: absolute;
            top : 0;
            left : 0;
        }
        .img_cover{
            position: absolute;
            width: 100%;             
            height: 100%;
            top : 0;
            left : 0;
            // background-image: linear-gradient(108deg,rgb(255, 198, 255) 16%,#c1fefe);
        }
    }
    .node-main-content{
        width: 100%;
        .node-footer{
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            text-align: left;
            margin-top: 1rem;
            width: 100%;
            .node-content{
                width: 100%;
                display: flex;
                flex-direction: column;
                h2{
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    position: relative;                    
                }
                p{
                    margin: 0;
                    font-weight: 700;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    display: -webkit-box;
                    display: box;
                }
            }
        }
    }
`;