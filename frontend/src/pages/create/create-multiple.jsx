/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";

import { Input, Form } from "antd";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";

import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";
import Header from '../header/header';
import Footer from '../footer/footer';

import * as Element from "./styles";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { addMultiItem } from "../../utils/contracts";
import ThemeContext from '../../context/ThemeContext';
import UploadIcon from '../../assets/images/icons/icon_upload.svg';
import UploadIconLight from '../../assets/images/icons/icon_upload_light.svg';
import Button from "../../components/Widgets/CustomButton";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function CreateMultiple(props) {
    const { theme } = useContext(ThemeContext);
    const { account, active, library } = useActiveWeb3React();

    const [mainFile, setMainFile] = useState(null);
    const [mainFileHash, setMainFileHash] = useState("");
    const [mainFileUploading, setMainFileUploading] = useState(false);
    const [showCoverUpload, setShowCoverUpload] = useState(false);

    const [coverImgFile, setCoverImgFile] = useState(null);
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImageUploading, setCoverImageUploading] = useState(false);
    const [mediaType, setMediaType] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [supply, setSupply] = useState(1);
    const [properties, setProperties] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const [creatingItem, setCreatingItem] = useState(false);

    useEffect(() => {
        if (account) {
            fetchCollections();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    function fetchCollections() {
        setSelectedCollection(null);
        axios.get(`${process.env.REACT_APP_API}/collection?ownerAddress=${account}&type=multi&sortDir=asc`)
            .then((res) => {
                if (res.data.status) {
                    setCollections(res.data.collections);
                    res.data.collections.forEach((item, i) => {
                        if (item.isPublic) {
                            setSelectedCollection(item);
                        }
                    });
                }
            })
            .catch((err) => {
                // console.log("err: ", err.message);
                setCollections([]);
            });
    }

    async function onCreateItem() {
        if (!name) {
            toast.error("Please Input Title!");
            return;
        }
        if (supply < 1) {
            toast.error("Please Input Number of Copies Correctly!");
            return;
        }

        if (!selectedCollection) {
            toast.error("Please Select Collection!");
            return;
        }
        if (!mainFileHash) {
            toast.error("Please Upload file!");
            return;
        }
        if ((mediaType === "video" || mediaType === "audio") && !coverImgHash) {
            toast.error("Please Upload cover image!");
            return;
        }

        let attributesData = [];
        for (let i = 0; i < properties.length; i++) {
            attributesData.push({
                trait_type: properties[i][0],
                value: properties[i][1],
            });
        }



        // call createItem contract function

        const openseadata = {
            asset_type: mediaType,
            name: name,
            description: description,
            attributes: attributesData,
            animation_url: (mediaType === "video" || mediaType === "audio") ? mainFileHash : '',
            image: (mediaType === "video" || mediaType === "audio") ? coverImgHash : mainFileHash
        };
        setCreatingItem(true);
        getIpfsHash(openseadata).then((hash) => {
            let tokenUri = `https://ipfs.hex.toys/ipfs/${hash}`;
            const load_toast_id = toast.loading("Please wait for minting nft...");

            addMultiItem(
                selectedCollection.address,
                tokenUri,
                supply,
                library
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    toast.success("NFT was minted! Data will be synced after some block confirmation...");
                    setCreatingItem(false);
                    await sleep(2000);
                    props.history.push(`/profile/${account}`);
                    return true;
                } else {
                    setCreatingItem(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        });
    }

    function handleMainFile(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setMediaType(fileType);
            setCoverImgFile(null);
            setCoverImgHash("");
            setShowCoverUpload(false);
            setMainFile(event.target.files[0]);
            setMainFileUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setMainFileHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setMainFileUploading(false);
            })
        } else if ((fileType === "video") || (fileType === "audio")) {
            setMainFile(event.target.files[0]);
            setMainFileUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setMainFileHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setMainFileUploading(false);
                setMediaType(fileType);
                setShowCoverUpload(true);
            });
        }
    }

    function handleCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCoverImgFile(event.target.files[0]);
            setCoverImageUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCoverImageUploading(false);
            });
        }
    }

    function closeMainFile() {
        setMainFile(null);
        setMainFileHash("");
        setMainFileUploading(false);
        setShowCoverUpload(false);

        setCoverImgFile(null);
        setCoverImgHash("");
        setCoverImageUploading(false);
        setMediaType("");
    }

    function closeCoverImg() {
        setCoverImgFile(null);
        setCoverImgHash("");
        setCoverImageUploading(false);
    }


    function createProperty() {
        if (properties.length < 10) {
            setProperties((props) => [...props, ["", ""]]);
        }
    }
    function editProperties(propIndex, nameValIndex, newVal) {
        let props = [...properties];
        let prop = props[propIndex];
        prop[nameValIndex] = newVal;
        setProperties(props);
    }

    function deleteProperty(index) {
        let props = [...properties];
        props.splice(index, 1);
        setProperties(props);
    }

    return (
        <div>
            <Header {...props} />

            <Element.Container>
                {account && active &&
                    <>
                        <Element.Title><h1 className={` text_color_gradient_${theme}`}>Create Multiple NFT</h1></Element.Title>
                        <Element.UploadField>
                            <Element.UploadLabel className={theme}>Upload file</Element.UploadLabel>
                            <Element.UploadContainer style={{ display: mainFile ? "none" : "" }}>
                                <Element.UploadBox>
                                    {theme === 'dark' ? <img src={UploadIcon} alt='' /> : <img src={UploadIconLight} alt='' />}
                                    <Element.UploadCaption className={theme}> Drag and drop any file here, <br /> or click below to browse.</Element.UploadCaption>
                                    <Element.UploadCaption className={theme}> JPG, PNG, GIF, MP3 or MP4. Max 100mb <span>*</span></Element.UploadCaption>
                                    <Button
                                        label={<>Choose File
                                            <Element.FileInput type="file" value="" accept="image/*,audio/*,video/*" onChange={handleMainFile} /></>}
                                        outlineBtnColor roundFull
                                    />
                                </Element.UploadBox>
                            </Element.UploadContainer>
                            <Element.PreviewContainer style={{ display: mainFile ? "" : "none" }}>
                                <Element.CloseIconContainer style={{ display: mainFileHash ? "" : "none" }}>
                                    <CloseIcon className={` text_color_1_${theme}`} onClick={() => closeMainFile()} fontSize="small" />
                                </Element.CloseIconContainer>
                                <Element.MediaContainer>
                                    <CircularProgress style={{ display: mainFileUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                    {
                                        mainFileHash && (
                                            mediaType === "video" ?
                                                <Element.VideoPreview src={mainFileHash} autoPlay loop controls />
                                                :
                                                mediaType === "audio" ?
                                                    <Element.AudioPreview src={mainFileHash} autoPlay loop controls />
                                                    :
                                                    <Element.ImagePreview src={mainFileHash} />
                                        )
                                    }
                                </Element.MediaContainer>
                            </Element.PreviewContainer>
                        </Element.UploadField>
                        <Element.UploadField style={{ display: showCoverUpload ? "" : "none" }}>
                            <Element.Label className={` text_color_1_${theme}`}>Upload cover</Element.Label>
                            <Element.UploadContainer style={{ display: coverImgFile ? "none" : "" }}>

                                <Element.UploadBox>
                                    <Element.UploadCaption className={theme}>JPG, PNG, GIF, WEBP. Max 10mb</Element.UploadCaption>
                                    <Button
                                        label={<>Choose File
                                            <Element.FileInput type="file" value="" accept="image/*" onChange={handleCoverImg} /></>}
                                        outlineBtnColor roundFull
                                    />
                                </Element.UploadBox>
                            </Element.UploadContainer>
                            <Element.PreviewContainer style={{ display: coverImgFile ? "" : "none" }}>
                                <Element.CloseIconContainer style={{ display: coverImgHash ? "" : "none" }}>
                                    <CloseIcon className={` text_color_1_${theme}`} onClick={() => closeCoverImg()} fontSize="small" />
                                </Element.CloseIconContainer>
                                <Element.MediaContainer>
                                    <CircularProgress style={{ display: coverImageUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                    <Element.ImagePreview style={{ display: coverImgHash ? "" : "none" }} src={coverImgHash} />
                                </Element.MediaContainer>
                            </Element.PreviewContainer>
                            <Element.Option className={` text_color_4_${theme}`}>Please add cover Image to your media file</Element.Option>
                        </Element.UploadField>

                        <Element.Form>
                            <Element.Field>
                                <Element.Label className={theme}>Name</Element.Label>
                                <Element.Input className={theme} value={name} placeholder="Please input item name" onChange={event => setName(event.target.value)} />
                            </Element.Field>
                            <Element.Field>
                                <Element.Label className={theme}>Description <span> (Optional)</span></Element.Label>
                                <Element.TextArea className={theme} value={description} placeholder="Provide a detailed description of your item" onChange={event => setDescription(event.target.value)} />
                            </Element.Field>

                            <Element.Field>
                                <Element.Label className={theme}>Supply <span>(Number of Copies)</span></Element.Label>
                                <Element.Input className={theme} value={supply} type={"number"} onChange={event => setSupply(Math.floor(event.target.value))} />
                            </Element.Field>

                            <Element.Field>
                                <Form.Item>
                                    <Element.FormItem className={theme}>
                                        <h3 style={{ marginTop: '10px' }}>
                                            Properties <span>(Optional)</span>
                                            <button className="property-add-button" onClick={createProperty}><PlusOutlined /></button>
                                        </h3>
                                    </Element.FormItem>
                                    {
                                        properties.map((value, index) => {
                                            return (
                                                <div key={index} style={{ display: 'flex', marginBottom: '10px', flexWrap: 'nowrap' }} className={theme}>
                                                    <Input.Group className="input-group">
                                                        <Input value={value[0]}
                                                            onChange={(e) => { editProperties(index, 0, e.target.value) }}
                                                            placeholder="Name" />
                                                        <Input value={value[1]}
                                                            onChange={(e) => { editProperties(index, 1, e.target.value) }}
                                                            placeholder="Value" />
                                                    </Input.Group>
                                                    <button className="property-remove-button"
                                                        onClick={(e) => { deleteProperty(index) }}>
                                                        <CloseCircleFilled style={{ fontSize: '26px' }} />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    }

                                </Form.Item>
                            </Element.Field>

                        </Element.Form>

                        <Element.SelectCollection>
                            <div className="collection-box">
                                <Element.Label className={theme}>Choose collection</Element.Label>
                                <Element.Collections>
                                    {
                                        collections.map((collection, index) => {
                                            return (
                                                <Element.Collection key={index} onClick={() => setSelectedCollection(collection)} className={selectedCollection === collection ? 'active' : ''}>
                                                    <div className="content">
                                                        <Element.CollectionIcon src={collection.lowLogo} />
                                                        <Element.CollectionName className={theme}>{collection.name}</Element.CollectionName>
                                                    </div>
                                                </Element.Collection>
                                            );
                                        })
                                    }
                                </Element.Collections>
                            </div>
                        </Element.SelectCollection>
                        <Element.Actions>
                            <Button
                                label={
                                    creatingItem ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Create item"
                                }
                                onClick={() => onCreateItem()}
                                fillBtn roundFull w_full
                            />
                        </Element.Actions>
                    </>
                }
            </Element.Container>

            <Footer />
        </div>

    );

}

export default CreateMultiple;
