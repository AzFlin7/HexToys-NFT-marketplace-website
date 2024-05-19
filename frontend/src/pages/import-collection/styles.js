import styled from 'styled-components';
import { PlusCircle } from "@styled-icons/feather";

export const MainContainer = styled.div`
    width: 100%;
    display: block;
    align-items: center;
    
    justify-content: center;
    background-color: #fff;
    padding-top: 70px;
    padding-bottom: 64px;
    padding-left: 24px;
    padding-right: 24px;
    @media only screen and (max-width: 767px) {
        padding-bottom: 32px;
    }
`;

export const Container = styled.div`
    margin 48px auto;
    width : 100%;
    max-width: 1000px;
    min-height : 60vh;
    @media only screen and (max-width: 767px) {
        padding-left: 16px;
        padding-right : 16px;
    }
`;

export const Title = styled.div`
    width: 100%;
    padding-top: 137px;
    padding-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content : center;
    flex-direction : column;
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
        margin-bottom: 16pxrem;

        @media only screen and (max-width: 767px) {
            font-size: 22px;
        }
    }
    p{
        text-align: center;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 0;
        @media only screen and (max-width: 767px) {
            font-size: 16px;
        }
    }
`;

export const UploadField = styled.div`
    margin: 40px 20px;
`;

export const SelectCollection = styled.div`
    margin: 40px 20px;
`;

export const Collections = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-box-pack: start;
    justify-content: flex-start;
`;


export const collection = styled.div`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 180px;
    min-height: 180px;
    width: 180px;
    height: 180px;
    border: solid 3px #cacaca;
    border-radius: 12px;
    margin: 8px;
    &.active {
        border: solid 3px #e24717;
    }
`;

export const CollectionPlusIcon = styled(PlusCircle)`

`;


export const CollectionIcon = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;


export const CollectionName = styled.div`
    color: #1E2026;
    font-weight: bold;
    font-size: 16px;    
    margin-top: 12px;
`;

export const CollectionType = styled.div`
    color: grey;
    font-size: 14px;
`;

export const UploadLabel = styled.div`
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; 
    margin-bottom: 40px;
    
    span {
        font-family: Inter;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
    
    &.dark {
        color: #FFF;
        
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
        font-size: 14px;
        margin-bottom: 24px;
        
        span {
            font-size: 13px;
            line-height: normal;
        }
    }
`;

export const UploadBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    
    top : 0;
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

export const UploadContainer = styled.div`
    display: flex;
    width : 100%;
    height : 0;
    padding-bottom : 27%;
    // padding: 83px 332px 96.627px 333px;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    border: 3px dashed #726CA9;
    background: rgba(255, 255, 255, 0.04);
    position : relative;
    @media only screen and (max-width: 767px) {
        padding: 34px 76.966px 34.786px 76px;
    }
    .content{
        display: flex;
        width : 100%;
        height : 100%;
        justify-content: center;
        align-items: center;
        position : absolute;
        top : 0;
        left : 0;
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
`;

export const Form = styled.div`
    margin-top: 20px;
    .property-add-button {
        background: transparent;
        border: none;
        vertical-align: middle;
        svg {
            font-size: 26px;
            border-radius: 8rem;
            border: 2px solid var(--textPrimaryColor);
            padding: 3px;
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
`;

export const Field = styled.div`
    margin-top: 88px;
    
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
        font-size: 16px;
        font-weight: 600;
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
    height: 50px;
    padding: 17px 14px;
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
    margin: 20px 0; 
`;

export const CreateBtn = styled.div`
    padding: 10px 30px;
    background: #e24717;
    font-size: 18px;
    color: white;
    border-radius: 24px;
    cursor: pointer;
`;

export const SelectCategory = styled.select`
    width: 100%;
    display: flex;
    height: 50px;
    padding: 17px 14px;
    align-items: center;
    font-size: 14px;
    border-radius: 10.811px;
    border: 1px solid #726CA9;
    background: rgba(255, 255, 255, 0.02);
    
    &.dark {
        color: #fff;
        
        option {
            background: #060714;
        }
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


export const SelectCategoryOption = styled.option`

`;

export const ModalBody = styled.div`
  padding: 8px 12px;
`;

export const ModalTitle = styled.div`
    margin-bottom: 24px;
    font-weight: bold;
    font-size: 24px;
    
`;

export const ModalContent = styled.div`
    margin: 16px 0px;
    
    &.second {
        margin-top: 88px;
    }
    
    @media only screen and (max-width: 767px) {
        margin: 8px 0;
        
        &.second {
            margin-top: 32px;
        }
    }
`;

export const ContentDetail = styled.div`
    margin: 20px 0 0 0;

    @media (min-width: 768px) {
        margin: 0 0 0 20px;
    }
`;

export const ModalAction = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 64px;
    
    @media only screen and (max-width: 767px) {
        margin-top: 33px;
    }
`;

export const ModalButton = styled.div`
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
