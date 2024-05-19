/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { fetchBalance } from '@wagmi/core';
import { useActiveWeb3React } from "../../hooks";
import Resizer from "react-image-file-resizer";

import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";
import Header from '../header/header';
import Footer from '../footer/footer';

import * as Element from "./styles";
import { NetworkParams } from "../../utils";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { getImportInfo, isNFTAddress, importCollection } from "../../utils/contracts";
import ThemeContext from '../../context/ThemeContext';
import UploadIcon from '../../assets/images/icons/icon_upload.svg';
import UploadIconLight from '../../assets/images/icons/icon_upload_light.svg';
import Button from "../../components/Widgets/CustomButton";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ImportCollection(props) {
    const { theme } = useContext(ThemeContext);
    const { account, active, library } = useActiveWeb3React();

    const [collectionFile, setCollectionFile] = useState(null);
    const [fileRatio, setFileRatio] = useState(1);
    const [collectionImgHash, setCollectionImgHash] = useState("");
    const [collectionImgUploading, setCollectionImgUploading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [collectionCoverFile, setCollectionCoverFile] = useState(null);
    const [collectionCoverImgHash, setCollectionCoverImgHash] = useState("");
    const [collectionCoverImgUploading, setCollectionCoverImgUploading] = useState(false);

    const [contractAddress, setContractAddress] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [collectionDescription, setCollectionDescription] = useState("");
    const [creatingCollection, setCreatingCollection] = useState(false);

    const [balance, setBalance] = useState(0);
    const [importInfo, seImportInfo] = useState(null);
    useEffect(() => {
        if (account && library) {

            fetchBalance({
                address: account,
            })
                .then((result) => {
                    var etherVal = parseFloat(ethers.utils.formatUnits(String(result.value), result.decimals));
                    setBalance(etherVal);
                })
                .catch(() => {
                    setBalance(0);
                })

            getImportInfo(library)
                .then((result) => {
                    seImportInfo(result)
                })
                .catch(() => {
                    seImportInfo(null)
                })
        }
    }, [account, library])

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    function fetchCategories() {
        axios.get(`${process.env.REACT_APP_API}/categories`)
            .then((res) => {
                if (res.data.status) {
                    setCategories(res.data.categories);
                    setCategory(res.data.categories[0].name);
                }
            })
            .catch((err) => {
                // console.log("err: ", err.message);
                setCategories([]);
            });
    }

    const resizeFile = (file, width, height) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                width,
                height,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    async function onImportCollection() {
        if (!account || !library) {
            toast.error("Please Connect Wallet!");
            return;
        }
        if (!importInfo) {
            return;
        }
        if (!contractAddress) {
            toast.error("Please Input Collection Address!");
            return;
        }
        if (!collectionName) {
            toast.error("Please Input Collection Name!");
            return;
        }
        if (!collectionFile) {
            toast.error("Please Select Collection Image!");
            return;
        }
        if (!collectionCoverFile) {
            toast.error("Please Select Collection Cover Image!");
            return;
        }

        const isNFT = await isNFTAddress(contractAddress, library)
        if (!isNFT) {
            toast.error("Invalid Collection Address!");
            return;
        }
        if (importInfo.publicAdd) {
            // public add
            if (balance < importInfo.fee) {
                toast.error("Insufficient fee!");
                return;
            }
        } else {
            // only owner can import
            if (account.toLowerCase() !== importInfo.owner.toLowerCase()) {
                toast.error("Only admin can import collection!");
                return;
            }
        }

        const formData = new FormData()
        const lowFile = await resizeFile(collectionFile, 100, Math.floor(100 * fileRatio))
        const mediumFile = await resizeFile(collectionFile, 250, Math.floor(250 * fileRatio))
        const highFile = await resizeFile(collectionFile, 500, Math.floor(500 * fileRatio))
        formData.append('originals', collectionFile)
        formData.append('lows', lowFile)
        formData.append('mediums', mediumFile)
        formData.append('highs', highFile)
        formData.append('banners', collectionCoverFile)
        axios.post(`${process.env.REACT_APP_API}/collection_asset/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(async (res) => {
            const openseadata = {
                name: collectionName,
                description: collectionDescription,
                category: category,
                image: res.data.original,
                lowLogo: res.data.lowLogo,
                mediumLogo: res.data.mediumLogo,
                highLogo: res.data.highLogo,
                coverUrl: res.data.coverUrl
            };
            console.log(openseadata)
            setCreatingCollection(true);
            getIpfsHash(openseadata).then((hash) => {
                let collectionUri = `https://ipfs.hex.toys/ipfs/${hash}`;
                const load_toast_id = toast.loading("Please wait for importing collection...");
                importCollection(
                    contractAddress,
                    collectionName,
                    collectionUri,
                    library
                ).then(async (result) => {
                    toast.dismiss(load_toast_id);
                    setCreatingCollection(false);
                    if (result) {
                        toast.success("Collection was imported! Data will be synced after some block confirmation...");
                        await sleep(2000);
                        props.history.push(`/`);
                    } else {
                        setCreatingCollection(false);
                        toast.error("Failed Transaction!");
                        return;
                    }
                });
            });
        })
            .catch(err => {
                toast.error(err.response.data.message);
            })


    }

    function handleCollectionImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCollectionFile(event.target.files[0]);
            var img = new Image();
            img.src = URL.createObjectURL(event.target.files[0]);
            img.onload = function () {
                URL.revokeObjectURL(img.src);
                setFileRatio(img.height / img.width)
            };
            // setCollectionImgUploading(true);
            // getIpfsHashFromFile(event.target.files[0]).then((hash) => {
            //     setCollectionImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
            //     setCollectionImgUploading(false);
            // });
        }
    }

    function handleCollectionCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCollectionCoverFile(event.target.files[0]);
            // setCollectionCoverImgUploading(true);
            // getIpfsHashFromFile(event.target.files[0]).then((hash) => {
            //     setCollectionCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
            //     setCollectionCoverImgUploading(false);
            // });
        }
    }

    function closeCollectionImg() {
        setCollectionFile(null);
        setCollectionImgHash("");
        setCollectionImgUploading(false);
    }

    function closeCollectionCoverImg() {
        setCollectionCoverFile(null);
        setCollectionCoverImgHash("");
        setCollectionCoverImgUploading(false);
    }

    function getStateValue(val) {
        if (val > 999999) {
            return `${(val / 1000000).toFixed(2)}M`
        }
        else {
            if (val > 999) {
                return `${(val / 1000).toFixed(2)}K`
            }
            else {
                return `${(val).toFixed(2)}`
            }
        }

    }

    return (
        <>
            <Header {...props} />

            {(account && active) ?
                <Element.Container>
                    <Element.Title>
                        <h1 className={`text_color_gradient_${theme}`}>Import Collection</h1>
                        <p className={`text_color_3_${theme}`}>Our unique import function effortlessly transitions your beloved collections from Ethereum, readying them for the vibrant trading possibilities on PulseChain.</p>
                    </Element.Title>
                    {
                        importInfo &&
                        (
                            importInfo.publicAdd ?
                                <Element.Label className={theme}>
                                    <span> Fee: </span>
                                    {`${getStateValue(parseFloat(importInfo.fee))} ${NetworkParams.nativeCurrency?.symbol}`}
                                </Element.Label>
                                :
                                <Element.Label className={theme}>
                                    <span style={{ color: 'red' }}> Only Admin can import collection!</span>
                                </Element.Label>
                        )

                    }
                    <Element.ModalContent>
                        <Element.UploadLabel className={theme}>Upload Logo Here <span>( 400 X 400 )</span></Element.UploadLabel>
                        {
                            !collectionFile ? <Element.UploadContainer>
                                <div className="content">
                                    <Element.UploadBox>
                                        {theme === 'dark' ? <img src={UploadIcon} alt='' /> : <img src={UploadIconLight} alt='' />}
                                        <Element.UploadCaption className={theme}> Drag and drop any file here, <br /> or click below to browse.</Element.UploadCaption>
                                        <Element.UploadCaption className={theme}> JPG, PNG or GIF. Max 10mb <span>*</span></Element.UploadCaption>
                                        <Button
                                            label={<>
                                                Choose File
                                                <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionImg} />
                                            </>}
                                            outlineBtnColor roundFull
                                        />

                                    </Element.UploadBox>
                                </div>

                            </Element.UploadContainer> :
                                <Element.PreviewContainer>
                                    <Element.CloseIconContainer>
                                        <CloseIcon onClick={() => closeCollectionImg()} fontSize="small" />
                                    </Element.CloseIconContainer>
                                    <Element.MediaContainer>
                                        {/* <CircularProgress style={{ display: collectionImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} /> */}
                                        <Element.ImagePreview src={URL.createObjectURL(collectionFile)} />
                                    </Element.MediaContainer>
                                </Element.PreviewContainer>
                        }


                    </Element.ModalContent>

                    <Element.ModalContent className="second">
                        <Element.UploadLabel className={theme}>Upload Cover image here <span>( 1600 X 400 )</span></Element.UploadLabel>
                        {
                            !collectionCoverFile ?
                                <Element.UploadContainer>
                                    <div className="content">
                                        <Element.UploadBox>
                                            {theme === 'dark' ? <img src={UploadIcon} alt='' /> : <img src={UploadIconLight} alt='' />}
                                            <Element.UploadCaption className={theme}> Drag and drop any file here, <br /> or click below to browse.</Element.UploadCaption>
                                            <Element.UploadCaption className={theme}> JPG, PNG or GIF. Max 10mb <span>*</span></Element.UploadCaption>

                                            <Button
                                                label={<>
                                                    Choose File
                                                    <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionCoverImg} />
                                                </>}
                                                outlineBtnColor roundFull
                                            />

                                        </Element.UploadBox>
                                    </div>
                                </Element.UploadContainer> :

                                <Element.PreviewContainer>
                                    <Element.CloseIconContainer>
                                        <CloseIcon onClick={() => closeCollectionCoverImg()} fontSize="small" />
                                    </Element.CloseIconContainer>
                                    <Element.MediaContainer>
                                        {/* <CircularProgress style={{ display: collectionCoverImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} /> */}
                                        <Element.ImagePreview src={URL.createObjectURL(collectionCoverFile)} />
                                    </Element.MediaContainer>
                                </Element.PreviewContainer>
                        }
                    </Element.ModalContent>

                    <Element.Field>
                        <Element.Label className={theme}>Collection Address</Element.Label>
                        <Element.Input className={theme} placeholder={"e.g 0x0BF373dBbEe2AC7Af7028Ae8027a090EACB9b596"} value={contractAddress} onChange={event => setContractAddress(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label className={theme}>Display name</Element.Label>
                        <Element.Input className={theme} placeholder={"Enter name"} value={collectionName} onChange={event => setCollectionName(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label className={theme}>Description <span> (Optional)</span></Element.Label>
                        <Element.TextArea className={theme} placeholder={"Enter description"} value={collectionDescription} onChange={event => setCollectionDescription(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label className={theme}>Select Category</Element.Label>
                        <Element.SelectCategory className={theme} name={"category"} defaultValue={category} onChange={event => setCategory(event.target.value)}>
                            {
                                categories.map((categoryItem, index) => {
                                    return (
                                        <Element.SelectCategoryOption key={index} value={categoryItem.name}>{categoryItem.name}</Element.SelectCategoryOption>
                                    );
                                })
                            }
                        </Element.SelectCategory>
                    </Element.Field>

                    <Element.ModalAction>
                        <Element.ModalButton onClick={() => onImportCollection()}>
                            {
                                creatingCollection ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Import Collection"
                            }
                        </Element.ModalButton>
                    </Element.ModalAction>
                </Element.Container>
                :
                <Element.Container>
                    <Element.Title>
                        <h1 style={{ width: '100%', textAlign: 'center' }}>Please Connect Wallet</h1>
                    </Element.Title>
                </Element.Container>
            }
            <Footer />
        </>

    );

}

export default ImportCollection;
