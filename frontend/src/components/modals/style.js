import styled from 'styled-components';

import {Heart} from "@styled-icons/feather/Heart";
import {Close} from "@styled-icons/material/Close";
import {Info} from "@styled-icons/material/Info";
import {AccessTimeFilled} from "@styled-icons/material";
import {Tag} from "@styled-icons/fa-solid/Tag";
import {Heart as HeartFill} from "@styled-icons/fa-solid/Heart";

// Modal style

export const ImageContainer = styled.div`
    padding: 0 12px;
    @media (min-width: 1200px){
      padding: 0;
    }
`;

export const NftImage = styled.img`
    border-radius: 8px;   
    width: 100%;
    height: auto;
    object-fit: cover;
`;

export const NftVideo = styled.video`
    border-radius: 8px;   
    width: 100%;
    height: auto;
    object-fit: cover;
`;

export const NftAudio = styled.audio`
    position: relative;
    bottom: 0px; 
    display: flex;
    width: 100%;
    height: 25px;
    border-radius: 8px;
    margin: auto;    
`;


export const NftType = styled.div`
    margin-top: 8px;
    color: grey;
    text-transform: capitalize;
`;

export const AddressContainer = styled.div`
    margin-top: 24px;
`;

export const Label = styled.div`
    font-size: 14px;
    margin-bottom: 4px;
    color: grey;
`;

export const Address = styled.div`
    display: flex;
    align-items: center;
`;

export const NftAddress = styled.a`
    text-decoration: unset;
    color: #1E2026;
    font-size: 12px;
`;

export const NftNetwork = styled.div`
    padding: 4px 8px;
    background: #f1f1f1;
    color: #1E2026;
    font-size: 12px;
    border-radius: 10px;
    margin-left: 12px;
`;

export const TokenIdContainer = styled.div`
    margin-top: 24px;
`;

export const TokenId = styled.div`

`;

export const DetailContainer = styled.div`
    margin-left: 0;
    padding: 12px;
        
    flex-grow: 1;
    @media (min-width: 1200px){
        margin-left: 40px;
      padding: 0;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

export const Collection = styled.div`
    margin-top: 20px;
`;

export const CollectionCaption = styled.div`
    font-weight: bold;
    margin-bottom: 12px; 
`;

export const CollectionContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const CollectionImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 24px;
`;

export const CollectionTitle = styled.div`
    font-weight: bold;
    font-size: 16px;
    margin-left: 20px;
`;

export const NftTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

export const NftCategory = styled.div`
    padding: 4px 8px;
    background: #f1f1f1;
    color: #1E2026;
    font-size: 12px;
    border-radius: 10px;
    margin-left: 12px;
`;

export const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

export const DropDownMenus = styled.div`
    background: white;
    width: 240px;
    position: absolute;
    bottom: -144px;
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 15px;
    right: 0;
`;

export const DropDownMenu = styled.div`
    padding 12px 24px;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    align-items: center;
    &:hover {
        background-color: #e3e3e3;
    }
`;


export const Favorite = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const FavouritesCount = styled.div`
    font-size: 10px;
`;

export const LoveFillIcon = styled(HeartFill)`
    color: #e24717!important;
`;


export const LoveIcon = styled(Heart)`    
`;



export const OwnerContainer = styled.div`
    margin-top: 24px;
`;
export const Owners = styled.div`
    display: flex;
`;
export const Owner = styled.div`
    display: flex;
    align-items: center;
    margin-right: 40px;
`;
export const OptionText = styled.div`
    font-size: 14px;
    margin-bottom: 8px;    
`;
export const UserOptionText = styled.div`
    font-size: 12px;
    margin-bottom: 4px;
    color: grey;
`;
export const CreatorContent = styled.div`
    margin-left: 20px;
`;
export const CreatorImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 24px;
    cursor: pointer;
`;
export const CreatorName = styled.div`
    font-weight: bold;
    font-size: 14px;
`;
export const Caption = styled.div`
    margin-top: 20px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    word-break: break-word;
    white-space: pre-line;
    max-height: 80px;
    overflow: auto;
    color: rgb(30, 35, 41);
`;
export const StatusContainer = styled.div`
    margin-top: 20px;
    display: block;
    justify-content: space-between;
  @media (min-width: 768px){
    display flex;
  }
`;

export const CurrentBid = styled.div`

`;

export const OptionContent = styled.div`
    display: flex;
    align-items: center;
`;
export const PriceContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const UnitContainer = styled.div`
    display: flex;
    align-items: center;
`;
export const CoinImage = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 12px;
`;

export const Price = styled.div`
    margin-left: 8px;
    font-size: 20px;
`;
export const Unit = styled.div`
    margin-left: 4px;
    font-size: 20px;
`;

export const UsdPrice = styled.span`
    color: grey;
    font-size: 12px;
    margin-left: 8px;
`;

export const ActionContainer = styled.div`
    display: block;
    margin-top: 20px;
  @media (min-width: 480px){
    display flex;
  }
`;

export const Action = styled.div`
    width: 200px;
    text-align: center;
    font-size : 14px;
    font-weight: 600;    
    background-color: #F24822;
    padding: 12px 20px;
    margin-right: 12px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 8px;
    color:white;
`;

export const Others = styled.div`
    margin-top: 40px;
`;

export const TabHeader = styled.div`
    display: flex;
`;

export const Tab = styled.div`
    padding: 8px 20px;
    font-size: 14px;
    font-weight : 600;
    cursor: pointer;
    &.active {
        border-bottom: solid 4px rgb(226 71 23);
    }
`;

export const TabContent = styled.div`
    padding: 20px 0;
`;

export const BidTime = styled.div`
    text-align: right;
`;

export const Times = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Time = styled.div`
    text-align: center;
    margin: 0 2px;
`;

export const TimeValue = styled.div`
    border-radius: 10px;
    padding: 12px;
    font-size: 24px;
    font-weight: bold;
    color: #1E2026;
    background-color: #e3e3e3;
`;

export const TimeLabel = styled.div`

`;

// History

export const TabContentContainer = styled.div`
    position: relative;
`;

export const InfoList = styled.div`
    max-height: 450px;
    padding-bottom: 80px;
    overflow: auto;
`;

export const ViewMore = styled.div`
    position: absolute;
    left: 0px;
    bottom: 0px;
    background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%);
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
    width: 100%;
    height: 106px;
`;

export const MoreText = styled.div`
    margin-top: 80px;
    color: #1E2026;
`;


export const HistoryContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid rgb(234, 236, 239);
    padding: 16px 0px;
`;

export const BidderImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer
`;

export const BidderContent = styled.div`
    margin-left: 12px;
    flex-grow: 1;
`;
export const BidderName = styled.div`
    font-size: 16px;
    span {
        font-size: 14px;
        color: grey;    
    }
`;

export const BidTimeAgo = styled.div`
    font-size: 14px;
    color: grey;
`;


export const BidAmount = styled.div`

`;

export const HistoryCoinImage = styled.img`
    width: 16px;
    height: 16px;
    border-radius: 8px;
`;

export const HistoryPrice = styled.div`
    margin-left: 4px;
    font-size: 14px;
    font-weight: bold;
`;
export const HistoryUnit = styled.div`
    margin-left: 4px;
    font-size: 14px;
`;

// Provenance
export const ProvenanceContainer = styled.div`
    display: flex;
    position: relative;
    padding-left: 16px;
    padding-bottom: 34px;
    &::before {
        content: "";
        position: absolute;
        left: 3px;
        top: 14px;
        width: 1px;
        height: 100%;
        border-right: 1px dashed rgb(183, 189, 198);
    }
    &::after {
        content: "";
        position: absolute;
        left: 0px;
        top: 6px;
        width: 8px;
        height: 8px;
        background: rgb(226 71 23);
        border-radius: 50%;
        z-index: 1;
    }
`;

export const ProvenanceContent = styled.div`
    margin-left: 12px;
    flex-grow: 1;
`;

export const ProvenanceName = styled.div`
    font-size: 14px;
    cursor: pointer;
    span {
        font-size: 14px;
        color: grey;    
    }
`;

export const ProvenanceTime = styled.div`
    margin-top: 4px;
    font-size: 12px;
    color: grey;
`;

// Modal
export const ModalBody = styled.div`
    padding: 0px;
    .border_dark{
        color : #fff;
        border: 1px solid #726CA9;
        background: rgba(255, 255, 255, 0.02);
    }
    .border_light{
        color : #000;
        border: 1px solid #726CA9;
        background: rgba(0, 0, 0, 0.02);
    }
    .border_1_dark{
        color : #fff;
        border: 1px solid #FFFFFF33;
        background: rgba(255, 255, 255, 0.02);
    }
    .border_1_light{
        color : #000;
        border: 1px solid #00000033;
        background: rgba(0, 0, 0, 0.02);
    }
    .border_color_dark{
        border-color: #726CA9;
        background: rgba(255, 255, 255, 0.02);
    }
    .border_color_light{
        border-color: #726CA9;
        background: rgba(0, 0, 0, 0.02);
    }  
`;

export const InputBody = styled.div`
  padding: 0px;
  display: flex;
`;

export const ModalHeader = styled.div`
   display: flex; 
   justify-content : flex-end;
   text-align: right;
`;

export const ModalCloseIcon = styled(Close)`
    transition: all 0.3s ease;
    cursor : pointer; 
    &:hover{
        transform: rotate(90deg);
    }
`;

export const ModalTitle = styled.div`
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 24px;
    text-align: left;
    @media (max-width: 640px){
        margin-bottom: 16px;
    }
`;

export const ModalRow = styled.div`
   display: flex;
   justify-content: space-between;
   margin: 20px 0;
`;

export const ModalLabel = styled.div`
    font-size: 16px;
    margin: 0px 10px;
`;

export const ModalPrice = styled.div`
    font-size: 16px;
`;

export const BidPrice = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    grid-area : auto;
    gap : 8px;
    justify-content: space-between;
`;

export const ModalMainPrice = styled.input`
    font-size: 28px;
    line-height: 40px;
    flex-grow: 1;
    width: 250px;
    text-align: center;
    border-radius: 12px;
    outline: none;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

export const BidUsd = styled.div`
    text-align: center;
    color: grey;
    font-size: 14px;
`;

export const ModalAction = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  width: 100%;
  text-align: center; 
  grid-area : auto;
  gap : 16px;
`;

export const ModalButton = styled.div`
    background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
    padding: 16px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    color:white;
    transition: all 0.3s ease;
    box-shadow: 0 15px 30px #7f6bff4d;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
`;

export const ModalCancelButton = styled.div`
    background-image: linear-gradient(rgb(219 219 219) 0%,rgb(184 184 184) 100%);
    padding: 16px 20px;
    margin-right: 12px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    width: 160px;
    line-height: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 15px 30px #7f6bff4d;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
`;

export const ModalSubmitButton = styled.div`
    padding: 16px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    width: 160px;
    line-height: 10px;
    color:white;
    transition: all 0.3s ease;
    background-color: #f96d63;
    background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
    box-shadow: 0 15px 30px #7f6bff4d;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
                
`;


// Buy Modal
export const InfoImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    margin-bottom: 12px;
`;

export const PayAmount = styled.div`
    display: flex;
    justify-content: flex-start;
    margin: 8px 0;
    align-items: center;
`;

export const ModalInfoContent = styled.div`
    background-color: #ffedbe;
    padding: 20px 32px;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
`;

export const InfoIcon = styled(Info)`
    color: #b0851f;
`;

export const InfoLabel = styled.div`
  font-size: 18px;
     margin-left: 8px;
`;
export const InfoActionLabel = styled.div`
    color: #b0851f;
    font-size: 20px;
    font-weight: bold;
    margin-top: 8px;
    margin-left: 32px;
    cursor: pointer;
`;

// Put on marketplace
export const PutTypes = styled.div`
   display: flex;
   justify-content: center;
`;

export const PutType = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 130px;
    height: 130px;
    // border: solid 3px #cacaca;
    border-radius: 12px;
    margin: 8px;
    transition : all 0.3s ease;
    cursor : pointer;
    position : relative;
    box-shadow: 0 15px 30px #7f6bff4d;
    .content{
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        display: flex;
        text-align: center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 10px;
        &.bg_dark{
            background: #060714;
        }
        &.bg_light{
            background: #fff;
        }
    }
    &::after{
        content : "";
        position : absolute;
        width : 100%;
        height : 100%;
        top : 0;
        left : 0;
        background-image: linear-gradient(90deg,#f0f,#8dc4fa 62%,#0ff);
        border-radius: 12px;
        z-index : -1;
        transition : all 0.3s ease;
        filter : grayscale(1)
    }
    &:hover{
        transform : translateY(-8px);
    }
    &.active {
        &::after{
            filter : grayscale(0)
        }
    }
`;

export const FixedIcon = styled(Tag)`

`;

export const TimeIcon = styled(AccessTimeFilled)`

`;

export const TypeLabel = styled.div`
    font-weight: bold;
    margin-top: 12px;
`;

export const Field = styled.div`
    margin: 24px 0; 
    @media (max-width: 640px){
        margin: 0; 
        margin-bottom : 8px;
    }
`;

export const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom : 16px;
    grid-area : auto;
    gap : 16px;
    border-radius : 12px;
    overflow: hidden;
    &.border_dark{
        border: 1px solid #726CA9;
        background: rgba(255, 255, 255, 0.02);
    }
    &.border_light{
        border: 1px solid #726CA9;
        background: rgba(0, 0, 0, 0.02);
    }
`;
export const Input = styled.input`
    width: 100%;
    flex-grow: 1;
    border: unset;
    font-size: 16px;
    padding: 8px;
    border-radius : 12px;
    background: transparent;
    &:focus{
        outline: none;
    }
    
`;
export const InputUnit = styled.div`
    font-size: 18px;
    font-weight: bold;
`;

export const SelectRow = styled.div`
    display: block;
    justify-content: space-between;
    @media (min-width: 480px){
        display flex;
    }
`;

export const SelectField = styled.div`
    width: 46%;
    padding: 8px 12px 0 12px;

    .input-picker{
        width: 190px;
        margin-top: 12px;
        border-radius: 8px;
        padding: 8px;
        border-width: 1px;
        @media (max-width: 480px){
            width: 100%;
        }
    }
    @media (max-width: 480px){
        width: 100%;
    }
`;

export const StartingDateSelect = styled.select`
    width: 230px;
    border-radius: 12px;
    font-size: 16px;
    padding: 8px;
    width: 100%;
    &:focus-visible{
        outline: unset;
    }
`;

export const OrderByOption = styled.option`
    &.border_dark{
        color : #fff !important;
        background: #000 !important;
    }
    &.border_light{
        color : #000 !important;
        background: #fff !important;
    }
`;

export const CurrencySelect = styled.select`
    width:  100px;
    border: unset;
    font-size: 18px;
    font-weight: bold;
    padding: 8px;
    background : transparent;
    &:focus-visible{
        outline: unset;
    }
    &.border_dark{
        color : #fff;
        background: rgba(255, 255, 255, 0.02);
    }
    &.border_light{
        color : #000;
        background: rgba(0, 0, 0, 0.02);
    }
`;

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;  
    margin-bottom: 5px;
    .modal_title{
        width:  100%;
        text-align : center;
    }
`;
export const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: dotted 1px #726CA9;
    border-radius: 12px;
    height: 200px;
`;
export const UploadCaption = styled.div`
    text-align: center;
    font-size: 14px;
    color: grey;
    margin-bottom: 20px;
    @media only screen and (max-width: 640px) {
        margin-bottom: 10px;
        font-size: 12px;
    }
`;

export const FileInput = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    cursor : pointer;
`;
export const PreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: dotted 1px grey;
    border-radius: 12px;
    height: 200px;
`;
export const CloseIconContainer = styled.div`
    width: 100%;
    margin-left: -5px;
    margin-top: 5px;
    text-align: right;
`;
export const MediaContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    height: 160px;
`;
export const ImagePreview = styled.img`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;

export const MysteryBoxContainer = styled.div`
    input {
        outline: none;
    }
    input:active {
        outline: none;
        border: none;
    }
    p {
        margin: 0;
        margin-left: 8px;
    }
    .dialog-item{
        margin-top: 1rem;
        margin-bottom: 1rem;
        p {
            color: var(--textLightColor);
            font-size: 0.9rem;
            margin-left: 8px;
        }
        input {
            padding: 8px;
            width: 100%;
            outline: none;
            margin-bottom: 4px;
            border-radius: 10px;
            &.border_dark{
                border: 1px solid #726CA9;
                background: rgba(255, 255, 255, 0.02);
            }
            &.border_light{
                border: 1px solid #726CA9;
                background: rgba(0, 0, 0, 0.02);
            }
        }
        textarea {
            padding: 8px;
            width: 100%;
            outline: none;
            margin-bottom: 4px;
            border-radius: 10px;
            &.border_dark{
                border: 1px solid #726CA9;
                background: rgba(255, 255, 255, 0.02);
            }
            &.border_light{
                border: 1px solid #726CA9;
                background: rgba(0, 0, 0, 0.02);
            }
        }
        h3 {
            font-weight: 500;
            padding: 0;
            margin: 0;
            padding: 0 8px;
            span {
                font-weight: 500;
                color: var(--textLightColor);
            }
        }
        h4 {
            color: var(--textBlackColor);
        }

        .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--lightGrayColor);
        }
        .flex-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0;
            p {
                margin-bottom: 0;
            }
        }
        .nft-container {
            display: flex;
            flex-wrap: nowrap;
        }
        .choose-nft{
            margin-bottom: 10px;
        }
        .nft-info{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;
            cursor: pointer;
            img{
                width: 25px;
                height: 25px;
                border-radius: 15px;
            }

        }
    }
`;

export const StakingContainer = styled.div`
    .bg_color_dark{
        
    }
    .border_dark{
        color : #fff;
        border: 1px solid #726CA9;
        background: rgba(255, 255, 255, 0.02);
    }
    .border_light{
        color : #000;
        border: 1px solid #726CA9;
        background: rgba(0, 0, 0, 0.02);
    }
    
    input:active {
        outline: none;
        border: none;
    }
    p {
        margin: 0;
        margin-left: 8px;
    }
    .confirm {
        width: 100%;
        background: var(--buttonColor);
        color: var(--textWhiteColor);
        font-weight: 700;
        border: none;
        border-radius: 8rem;
        outline: none;
        padding: 8px;
        margin-top: 1rem;
        cursor: pointer;
    }
    .dialog-item{
        margin-top: 1rem;
        margin-bottom: 1rem;
        
        p {
            font-size: 0.9rem;
            margin-left: 8px;
        }
        input {
            background: transparent;
            padding: 8px;
            width: 100%;
            outline: none;
            margin-bottom: 4px;
            border-radius: 10.811px;
            &:focus{
                outline: none;
            }
        }
        h3 {
            font-weight: 500;
            padding: 0;
            margin: 0;
            padding: 0 8px;
            span {
                font-weight: 500;
                color: var(--textLightColor);
            }
        }
        h4 {
        }

        .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--lightGrayColor);
        }
        .flex-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0;
            p {
                margin-bottom: 0;
            }
        }
        .nft-container {
            display: flex;
            flex-wrap: nowrap;
        }
        .choose-nft{
            margin-bottom: 10px;
        }
        .nft-info{
            padding: 2px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;
            cursor: pointer;
            margin-bottom : 8px;
            img{
                width: 25px;
                height: 25px;
                border-radius: 15px;
            }
            .sub-detail{
                font-size: 0.8rem;
            }
        }
    }
`;

export const PaginationContainer = styled.div`
    .dark{

    }
    .light{

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


// following element
export const FollowingElement = styled.div`
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    display: flex;
    margin-bottom: 1rem;
    .img-container {
        img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            object-fit: cover;
        }
    }
    .user-name {
        flex: 1 1;
        width: 100%;
        h5 {
            width: 100%;
            margin: 0px;
            margin-left: 5px;
            font-size: 18px;
            font-weight: bold;
        }
    }
`;

// create collection element

export const CollectionModalContent = styled.div`
    display: flex;
    flex-direction: row;  
    margin-bottom: 5px;
    width : 100%;
    grid-area : auto;
    gap : 16px;
    .col_div{
        width : 50%;
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
    margin-top: 12px;
    @media only screen and (max-width: 640px) {
        padding-bottom : 100%;
        margin-top: 0px;
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

export const UploadContainerLoot = styled.div`
    display: flex;
    width : 100%;
    position : relative;
    height : 0;
    padding-bottom : 30%;
    // padding: 83px 332px 96.627px 333px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    
    background: rgba(255, 255, 255, 0.04);
    margin-top: 12px;
    &.border_dark{
        border: 2px dashed #FFFFFF33;
    }
    &.border_lirhgt{
        border: 2px dashed #00000033;
    }
    @media only screen and (max-width: 640px) {
        padding-bottom : 100%;
        margin-top: 0px;
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

export const SelectCategory = styled.select`
    width: 100%;
    border: unset;
    border: 1px solid #ff00ff88;
    border-radius : 8px;
    font-size: 14px;
    padding: 8px;
    margin-bottom : 8px;
    &:focus-visible{
        outline: unset;
    }
`;
export const SelectCategoryOption = styled.option`
    &.border_dark{
        color : #fff !important;
        background: #000 !important;
    }
    &.border_light{
        color : #000 !important;
        background: #fff !important;
    }

`;


