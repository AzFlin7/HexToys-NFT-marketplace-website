import styled from 'styled-components';
import {PlusCircle} from "@styled-icons/feather";

export const Container = styled.div`
    margin 48px auto;
    max-width: 1200px;
    min-height : 60vh;
    @media only screen and (max-width: 767px) {
        padding-left: 16px;
        padding-right : 16px;
    }
`;

export const Title = styled.div`
    width: 100%;
    padding-top: 137px;
    padding-bottom: 0px;
    display: flex;
    justify-content: center;
    align-items : center;
    @media only screen and (max-width: 767px) {
        padding-top: 103px;
    }
    h1{
        text-align: center;
        text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        font-size: 36px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-bottom: 0;

        @media only screen and (max-width: 767px) {
            font-size: 22px;
        }
    }
`;

export const UploadField = styled.div`
    margin: 16px 0px;
    
    @media only screen and (max-width: 767px) {
        margin: 8px 0;
    }
`;

export const UploadLabel = styled.div`
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; 
    margin-bottom: 40px;
    
    &.dark {
        color: #FFF;
    }
   
    &.light {
        color: #000;
    }
    
    @media only screen and (max-width: 767px) {
        font-size: 14px;
        margin-bottom: 24px;
    }
`;

export const SelectCollection = styled.div`
    margin-top: 88px;
    display: flex;
    justify-content: center;
    
    .collection-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    
    @media only screen and (max-width: 767px) {
        margin-top: 32px;
    }
`;

export const Collections = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-top : 8px;
    -webkit-box-pack: start;
    justify-content: flex-start;
    grid-area : auto;
    gap : 16px;
`;


export const Collection = styled.div`
    display: flex;
    width: 200px;
    height: 220px;
    padding: 17px 14px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10.811px;
    border: 1px solid #726CA9;
    transition : all 0.3s ease;
    background: rgba(255, 255, 255, 0.02);
    cursor : pointer;
    &.active{
        border-color: #FF00FF;
    }
    &:hover{
        transform : translateY(-8px);
    }
    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    @media only screen and (max-width: 767px) {
        width: 127.664px;
        height: 148.172px;
        padding: 8.716px 7.178px;
    }
`;

export const CollectionPlusIcon = styled(PlusCircle)`
    &.dark {
        color: #fff;
    }
    
    &.light {
        color: #000;
    }
    
    width: 36px;
    height: 36px;
    
    @media only screen and (max-width: 767px) { 
        width: 18px;
        height: 18px;
    }
    
`;


export const CollectionIcon = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
`;


export const CollectionName = styled.div`
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 18px;
    
    &.dark {
        color: #fff;
    }
    
    &.light {
        color: #000;
    }
    
    @media only screen and (max-width: 767px) {
        margin-top: 9px;
        font-size: 11px;
    }
`;

export const CollectionType = styled.div`
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    
    &.dark {
        color: rgba(255, 255, 255, 0.50);
    }
    
    &.light {
        color: rgba(0, 0, 0, 0.50);
    }
    
    @media only screen and (max-width: 767px) {
        font-size: 9px;
    }
`;


export const UploadContainer = styled.div`
    display: flex;
    width : 100%;
    position : relative;
    height : 0;
    padding-bottom : 30%;
    // padding: 83px 332px 96.627px 333px;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    border: 3px dashed #726CA9;
    background: rgba(255, 255, 255, 0.04);
    margin-top: 24px;
    @media only screen and (max-width: 767px) {
        padding-bottom : 50%;
    }
    .content{
        position : absolute;
        width : 100%;
        height : 100%;
        top : 0;
        left : 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items : center;
    }
`;
export const UploadContainerModal = styled.div`
    display: flex;
    width : 100%;
    position : relative;
    height : 0;
    padding-bottom : 60%;
    // padding: 83px 332px 96.627px 333px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: 3px dashed #726CA9;
    background: rgba(255, 255, 255, 0.04);
    margin-top: 24px;
    @media only screen and (max-width: 767px) {
        padding-bottom : 50%;
    }
    .content{
        position : absolute;
        width : 100%;
        height : 100%;
        top : 0;
        left : 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items : center;
    }
`;
export const UploadBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content : center;
    position : absolute;
    width : 100%;
    height : 100%;
    top : 0;
    left : 0;
    img {
        width: 52px;
        height: 47px;
        margin-bottom: 32px;
    }
    
    @media only screen and (max-width: 767px) {
        img {
            width: 27px;
            height: 24px;
            margin-bottom: 16px;
        }
    }
`;

export const PreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: dotted 1px grey;
    border-radius: 12px;
    height: 200px;
`;
export const MediaContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    height: 160px;
`;
export const CloseIconContainer = styled.div`
    width: 100%;
    margin-left: -5px;
    margin-top: 5px;
    text-align: right;
`;

export const ImagePreview = styled.img`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;

export const VideoPreview = styled.video`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;

export const AudioPreview = styled.audio`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;



export const ChooseFileBtn = styled.div`
    display: inline-block;
    position: relative;
    padding: 18px 24px;
    border-radius: 144px;
    cursor: pointer;
    
    text-align: center;
    leading-trim: both;
    text-edge: cap;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.49px;
    
    &.dark {
        color: #000;
        background: #fff;    
    }
    
    &.light {
        color: #fff;
        background: #000;  
    }
    
    @media only screen and (max-width: 767px) {
        padding: 9.309px 12.411px;
        font-size: 9px;
        line-height: 10px;
        letter-spacing: 0.315px;
    }
`;

export const UploadCaption = styled.div`
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 16px;
    
    &.dark {
        color: rgba(255, 255, 255, 0.60);
    }
    
    &.light {
        color: rgba(0, 0, 0, 0.60);
    }
    
    span {
        color: #FF6464;
        text-align: center;
        font-size: 23px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px;
    }
    
    @media only screen and (max-width: 767px) {
        font-size: 8px;
        line-height: 11px;
        margin-bottom: 8px;
        
        span {
            font-size: 11px;
            line-height: 7px;
        }
    }
`;

export const FileInput = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    cursor: pointer;
`;

export const Form = styled.div`
    margin-top: 20px;
    .property-add-button {
        background: transparent;
        border: none;
        vertical-align: middle;
        margin-left: 32px;
        svg {
            font-size: 20px;
            border-radius: 8rem;
            border: 1px solid var(--textPrimaryColor);
            padding: 3px;
        }
        
        @media only screen and (max-width: 767px) {
            svg {
                font-size: 16px;
            }
        }
    }
    .ant-input-group{
        display: flex;
    }
    .property-remove-button{
        background: transparent;
        border: none;
        vertical-align: middle;
    }
    .dark {
        .ant-input-group {
            input {
                display: flex;
                height: 50px;
                padding: 17px 14px;
                align-items: center;
                color: #fff;
                border-radius: 10.811px;
                border: 1px solid #726CA9;
                background: rgba(255, 255, 255, 0.02);
                
                @media only screen and (max-width: 767px) {
                    height: 36px;
                    padding: 8.716px 7.178px;
                    font-size: 9px;
                }
            }
        }
    }
    .light {
        .ant-input-group {
            input {
                display: flex;
                height: 50px;
                padding: 17px 14px;
                align-items: center;
                border-radius: 10.811px;
                border: 1px solid #726CA9;
                background: rgba(0, 0, 0, 0.02);
                
                @media only screen and (max-width: 767px) {
                    height: 36px;
                    padding: 8.716px 7.178px;
                    font-size: 9px;
                }
            }
        }
    }
`;

export const Field = styled.div`
    margin-top: 24px;
    .ant-input-group{
        grid-area : auto;
        gap : 16px;
        .ant-input{
            border-radius : 8px;
            &:hover{
                border-color : #ff00ff55;
            }
            &:focus{
                box-shadow : 0px 0px 5px #ff00ff55;
                border-color : #ff00ff55;
            }
        }
    }
    .property-remove-button{
        transition : all 0.3s ease;
        cursor : pointer;
        svg{
            fill : #ff2718
        }
        &:hover{
            opacity : 0.7;
        }
    }
    
    @media only screen and (max-width: 767px) {
        margin-top: 32px;
    }
`;

export const Label = styled.div`
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 8px;
    
    span{
        font-size: 12px;
        font-weight: 400;
    }
    
    &.dark {
        color: #fff;
        
        span {
            color: rgba(255, 255, 255, 0.60);
        }
    }
    
    &.light {
        color: #000;
        
        span {
            color: rgba(0, 0, 0, 0.60);
        }
    }
    
    
    @media only screen and (max-width: 767px) {
        font-size: 9px;
        
        span {
            font-size: 8px;
        }
    }
    
`;

export const Input = styled.input`
    width: 100%;
    display: flex;
    height: 40px;
    padding: 8px 14px;
    align-items: center;
    
    border-radius: 10.811px;
    border: 1px solid #726CA9;
    background: rgba(255, 255, 255, 0.02);
    
    &.dark {
        color: #fff;
    }
    
    &.light {
        color: #000;
    }


    &:focus-visible{
        outline: unset;
    }
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    @media only screen and (max-width: 767px) {
        font-size: 9px;
    }
`;

export const TextArea = styled.textarea`
    display: flex;
    width: 100%;
    height: 182px;
    padding: 17px 14px;
    align-items: flex-start;
    border-radius: 10.811px;
    border: 1px solid #726CA9;
    background: rgba(255, 255, 255, 0.02);

    &.dark {
        color: #fff;
    }
    
    &.light {
        color: #000;
    }
    
     &:focus-visible{
        outline: unset;
    }
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    } 
    
    @media only screen and (max-width: 767px) {
        font-size: 9px;
    }
`;

export const Option = styled.div`
    margin-top: 4px;
    font-size : 14px;
`;

export const Actions = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 64px;
    
    @media only screen and (max-width: 767px) {
        margin-top: 33px;
    }
`;

export const CreateBtn = styled.div`
    padding: 18px 24px;
    background: linear-gradient(126deg, #F0F 0%, #FE511B 100%);
    color: white;
    border-radius: 144px;
    cursor: pointer;
    text-align: center;
    leading-trim: both;
    text-edge: cap;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.49px;
    color: #fff;
    
    @media only screen and (max-width: 767px) {
        padding: 11.561px 15.415px;
        font-size: 11px;
        line-height: 12.846px;
    }
`;

export const SelectCategory = styled.select`
    width: 100%;
    border: unset;
    border: 1px solid #ff00ff88;
    border-radius : 8px;
    font-size: 14px;
    padding: 8px;
    margin-bottom : 24px;
    &:focus-visible{
        outline: unset;
    }
`;

export const FormItem = styled.div` 
    &.dark {
        h3 {
            color: #FFF;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            
            span {
                color: rgba(255, 255, 255, 0.60);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
        
        @media only screen and (max-width: 767px) {
            h3 {
                font-size: 9px;
                span {
                    font-size: 8px;
                }
            }
        }
    }
    
    &.light {
        h3 {
            color: #000;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            
            span {
                color: rgba(0, 0, 0, 0.60);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
        
        @media only screen and (max-width: 767px) {
            h3 {
                font-size: 9px;
                span {
                    font-size: 8px;
                }
            }
        }
    }
`;
