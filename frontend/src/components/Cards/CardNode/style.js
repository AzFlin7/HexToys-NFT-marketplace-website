
import styled from 'styled-components';

export const Container = styled.div`
    border-radius: 1rem;
    padding: 16px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    flex: 0 1 300px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;

    &.bg_dark{
        border: 1px solid #FFFFFF26;
        background: #FFFFFF08;
    }
    &.bg_light{
        border: 1px solid #00000026;
        background: #00000008;
    }
    .card-preview{
        border-radius: 12px;
        overflow: hidden;
        height: 0px;
        width : 100%;
        padding-bottom : 100%;
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
    .card-main-content{
        padding: 0 1rem;
        .card-footer{
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            text-align: left;
            margin-top: 1rem;
            .card-content{
                h2{
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    position: relative;                    
                }
                h3{
                    margin: 0;
                    font-size: 0.9rem;
                    font-weight: 700;
                }
            }
        }
        .card-node-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1rem;
            .card-node-heart{
                display: flex;
                align-items: center;
            }
            p{
                margin: 0;
                font-weight: 600;
            }
        }
    }
`;