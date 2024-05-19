import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Querystring from "query-string";
import Resizer from "react-image-file-resizer";
import { useActiveWeb3React } from "../../hooks";
import CircularProgress from '@material-ui/core/CircularProgress';
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Input } from "antd";
import axios from 'axios';
import toast from "react-hot-toast";
import CloseIcon from '@material-ui/icons/Close';

import './edit-collection.scss';
import Header from '../header/header';
import Footer from '../footer/footer';
import { isAddress } from "../../utils/contracts";
import { getIpfsHashFromFile } from "../../utils/ipfs";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function EditCollection(props) {
    let { collection } = useParams();
    const { account, library } = useActiveWeb3React();

    const [collectionInfo, setCollectionInfo] = useState(null);
    useEffect(() => {
        if (!collectionInfo) {
            axios.get(`${process.env.REACT_APP_API}/collection/detail?address=${collection}`)
                .then(res => {
                    if (res.data.status) {
                        setCollectionInfo(res.data.collection);
                        if (res.data.collection.name) {
                            setNewName(res.data.collection.name);
                        }
                        if (res.data.collection.description) {
                            setNewDescription(res.data.collection.description);
                        }

                        if (res.data.collection.website) {
                            setNewWebsite(res.data.collection.website);
                        }
                        if (res.data.collection.telegram) {
                            setNewTelegram(res.data.collection.telegram);
                        }
                        if (res.data.collection.discord) {
                            setNewDiscord(res.data.collection.discord);
                        }
                        if (res.data.collection.twitter) {
                            setNewTwitter(res.data.collection.twitter);
                        }
                        if (res.data.collection.facebook) {
                            setNewFacebook(res.data.collection.facebook);
                        }
                        if (res.data.collection.instagram) {
                            setNewInstagram(res.data.collection.instagram);
                        }
                        if (res.data.collection.image) {
                            setNewImage(res.data.collection.image);
                        }
                        if (res.data.collection.coverUrl) {
                            setCoverImgHash(res.data.collection.coverUrl);
                        }
                        if (res.data.collection.royalties && res.data.collection.royalties.length > 0) {
                            setRoyalties(res.data.collection.royalties);
                        }
                    }
                })
                .catch(err => {
                    setCollectionInfo(undefined);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection])

    const [updating, setUpdating] = useState(false);

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [newWebsite, setNewWebsite] = useState("");
    const [newTelegram, setNewTelegram] = useState("");
    const [newDiscord, setNewDiscord] = useState("");
    const [newTwitter, setNewTwitter] = useState("");
    const [newFacebook, setNewFacebook] = useState("");
    const [newInstagram, setNewInstagram] = useState("");
    const [royalties, setRoyalties] = useState([]);
    function createRoyalty() {
        setRoyalties((royaltyList) => [...royaltyList, {
            address: '',
            percentage: ''
        }]);
    }
    function editRoyalty(propIndex, propertyName, newVal) {
        let faqList = [...royalties];
        let prop = royalties[propIndex];
        switch (propertyName) {
            case 'address':
                prop.address = newVal;
                break;
            case 'percentage':
                prop.percentage = newVal;
                break;
            default:
                break;
        }
        setRoyalties(faqList);
    }

    function deleteRoyalty(index) {
        let props = [...royalties];
        props.splice(index, 1);
        setRoyalties(props);
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

    const [file, setFile] = useState(null);
    const [fileRatio, setFileRatio] = useState(1);
    const [newImage, setNewImage] = useState("");
    const [imgUploading, setImgUploading] = useState(false);

    function handleFile(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setFile(event.target.files[0]);
            var img = new Image();
            img.src = URL.createObjectURL(event.target.files[0]);
            img.onload = function () {
                URL.revokeObjectURL(img.src);
                setFileRatio(img.height / img.width)
            };
            // setImgUploading(true);
            // getIpfsHashFromFile(event.target.files[0]).then((hash) => {
            //     setNewImage(`https://ipfs.hex.toys/ipfs/${hash}`);
            //     setImgUploading(false);
            // });
        } else {
            toast.error("Unsupported Type")
        }
    }

    const [coverFile, setCoverFile] = useState(null);
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImgUploading, setCoverImgUploading] = useState(false);

    function handleCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCoverFile(event.target.files[0]);
            // setCoverImgUploading(true);
            // getIpfsHashFromFile(event.target.files[0]).then((hash) => {
            //     setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
            //     setCoverImgUploading(false);
            // });
        } else {
            toast.error("Unsupported Type")
        }
    }

    function closeCoverImg() {
        setCoverFile(null);
        setCoverImgHash("");
        setImgUploading(false);
    }

    async function updateCollection() {

        let totalPercent = 0;

        if (royalties && royalties.length > 0) {
            for (let index = 0; index < royalties.length; index++) {
                const roaylty = royalties[index];
                if (!isAddress(roaylty.address)) {
                    toast.error("invalid royalty address");
                    return;
                }
                if ((Number(roaylty.percentage) > 100) || Number(roaylty.percentage) <= 0) {
                    toast.error("invalid royalty percentage");
                    return;
                }
                totalPercent = totalPercent + Number(roaylty.percentage);
            }
            if (totalPercent > 10) {
                toast.error("royalty should not be greater than 10%");
                return;
            }
            if (royalties.length > 5) {
                toast.error("you can add maximum 5 different address for royalty");
                return;
            }
        }

        const royaltyStr = JSON.stringify(royalties);

        setUpdating(true);
        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to update collection :${account.toLowerCase()}:${collection.toLowerCase()}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setUpdating(false);
            return;
        }

        const formData = new FormData();
        formData.append("account", account);
        formData.append("collection", collection);
        formData.append("name", newName || "");
        formData.append("description", newDescription || "");
        formData.append("website", newWebsite || "");
        formData.append("telegram", newTelegram || "");
        formData.append("discord", newDiscord || "");
        formData.append("twitter", newTwitter || "");
        formData.append("facebook", newFacebook || "");
        formData.append("instagram", newInstagram || "");
        formData.append("royalties", royaltyStr || "");
        formData.append("signature", signature);

        if (file) {
            const lowFile = await resizeFile(file, 100, Math.floor(100 * fileRatio));
            const mediumFile = await resizeFile(file, 250, Math.floor(250 * fileRatio));
            const highFile = await resizeFile(file, 500, Math.floor(500 * fileRatio));
            formData.append('originals', file);
            formData.append('lows', lowFile);
            formData.append('mediums', mediumFile);
            formData.append('highs', highFile);
        } else {
            formData.append('image', collectionInfo.image || "");
            formData.append('lowLogo', collectionInfo.lowLogo || "");
            formData.append('mediumLogo', collectionInfo.mediumLogo || "");
            formData.append('highLogo', collectionInfo.highLogo || "");
        }

        if (coverFile) {
            formData.append('banners', coverFile);
        } else {
            formData.append('coverUrl', coverImgHash || "");
        }

        axios.post(`${process.env.REACT_APP_API}/collection/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(async (res) => {
                setUpdating(false);
                if (res.data.status) {
                    await sleep(1000);
                    props.history.push(`/collection/${collection}`);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                setUpdating(false);
                toast.error(err.response.data.message);
            })
    }

    return (
        <div>
            <Header {...props} />
            {
                collectionInfo &&
                <div className="edit-collection">
                    {
                        account ?
                            <div className="container">
                                <div className='title'>
                                    <h1>Edit Collection</h1>
                                </div>
                                <div className="wrapper">
                                    <div className="edit_avatar">
                                        <div className="edit_content">
                                            <img src={(file ? URL.createObjectURL(file) : newImage) || "https://ipfs.hex.toys/ipfs/QmPF4ybwpu7dXqu4spWEZRQVBTn18TXgy95TzBGpbUvSmC"} alt='' />
                                            <div className="camera_icon"><i className="fas fa-camera"></i></div>
                                            <input type="file" accept="image/*" multiple={false} onChange={handleFile} />
                                        </div>
                                        {/* <a className="img_link" href={newImage && !imgUploading ? newImage : '/'} target='_blank' rel="noreferrer noopener">
                                            {file && !imgUploading ? "Uploaded!" : imgUploading ? "uploading to IPFS..." : ""}
                                        </a> */}
                                    </div>

                                    <div className="edit_cover">
                                        {
                                            !coverFile && !coverImgHash ?
                                                <div className="upload_container" style={{ display: coverFile ? "none" : "" }}>
                                                    <div className="caption">
                                                        Cover image. 1600x400 recommended.
                                                    </div>
                                                    <div className="choose_file_btn">
                                                        Choose File
                                                        <input type="file" value="" accept="image/*" onChange={handleCoverImg} />
                                                    </div>
                                                </div>
                                                :
                                                <div className="preview_container" >
                                                    <div className="close_container">
                                                        <CloseIcon onClick={() => closeCoverImg()} fontSize="small" />
                                                    </div>
                                                    <div className="media_container">
                                                        <img className="img_preview" src={coverFile ? URL.createObjectURL(coverFile) : coverImgHash} alt="" />
                                                    </div>
                                                </div>
                                        }
                                    </div>



                                    <div className="my_form">
                                        <div className="row">
                                            <h3 className="label">Name</h3>
                                            <input onChange={e => setNewName(e.target.value)} value={newName} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Description</h3>
                                            <textarea onChange={e => setNewDescription(e.target.value)} value={newDescription} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Website</h3>
                                            <input onChange={e => setNewWebsite(e.target.value)} value={newWebsite} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Telegram</h3>
                                            <input onChange={e => setNewTelegram(e.target.value)} value={newTelegram} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Discord</h3>
                                            <input onChange={e => setNewDiscord(e.target.value)} value={newDiscord} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Twitter</h3>
                                            <input onChange={e => setNewTwitter(e.target.value)} value={newTwitter} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Facebook link</h3>
                                            <input onChange={e => setNewFacebook(e.target.value)} value={newFacebook} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Instagram link</h3>
                                            <input onChange={e => setNewInstagram(e.target.value)} value={newInstagram} />
                                        </div>

                                        <div className="row">
                                            <h3 className="label">
                                                Royalty
                                                <button className="property-add-button" onClick={createRoyalty}><PlusOutlined /></button>
                                            </h3>
                                            {
                                                royalties.map((royalty, index) => {
                                                    return (
                                                        <div key={index} style={{ display: 'flex', marginBottom: '10px', flexWrap: 'nowrap' }}>
                                                            <Input.Group className="input-group">
                                                                <Input value={royalty.address}
                                                                    onChange={(e) => { editRoyalty(index, 'address', e.target.value) }}
                                                                    placeholder="Address" />
                                                                <Input value={royalty.percentage}
                                                                    type={"number"}
                                                                    onChange={(e) => { editRoyalty(index, 'percentage', e.target.value) }}
                                                                    placeholder="Percentage" />
                                                            </Input.Group>
                                                            <button className="property-remove-button"
                                                                onClick={(e) => { deleteRoyalty(index) }}>
                                                                <CloseCircleFilled style={{ fontSize: '26px' }} />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            }

                                        </div>

                                        <div className="btn_div">
                                            <button className="cancel_btn" onClick={() => props.history.push(`/collection/${collection}`)}>Cancel</button>
                                            <button className="submit_btn" onClick={() => updateCollection()}>
                                                {!updating ? 'Update' : <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="container">
                                <div className='title'>
                                    <h1>Please Connect Wallet</h1>
                                </div>
                            </div>
                    }
                </div>
            }
            <Footer />
        </div>
    );
}

export default EditCollection;
