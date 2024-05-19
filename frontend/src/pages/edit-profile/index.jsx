import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import Resizer from "react-image-file-resizer";
import toast from "react-hot-toast";
import ThemeContext from '../../context/ThemeContext';

import './edit_profile.scss';
import Header from '../header/header';
import Footer from '../footer/footer';
import { getIpfsHashFromFile } from "../../utils/ipfs";
import Button from "../../components/Widgets/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUserByFetch } from "../../store/reducers/userSlice";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function EditProfile(props) {
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const { account, library } = useActiveWeb3React();
    const [userProfile, setUserProfile] = useState(null);

    const [updating, setUpdating] = useState(false);
    const [file, setFile] = useState(null);
    const [fileRatio, setFileRatio] = useState(1);
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newTwitter, setNewTwitter] = useState("");
    const [newInstagram, setNewInstagram] = useState("");

    const [newBannerPicSrc, setNewBannerPicSrc] = useState("");
    const [fileBanner, setFileBanner] = useState(null);
    const [imgUploadingBanner, setImgUploadingBanner] = useState(false);

    const [newProfilePicSrc, setNewProfilePicSrc] = useState("");
    const [imgUploading, setImgUploading] = useState(false);

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

    async function updateProfile() {
        setUpdating(true);

        // generate signature       
        const sign_toast_id = toast.loading("Signing...");
        const signature = await library.signMessage(
            `I want to update my profile :${account.toLowerCase()}:${userProfile.nonce}`
        );
        toast.dismiss(sign_toast_id);
        if (!signature) {
            toast.error("Signing failed!");
            setUpdating(false);
            return;
        }
        const formData = new FormData()
        formData.append('address', account)
        formData.append('name', newName || "NoName")
        formData.append('bio', newBio || "")
        formData.append('email', newEmail || "")
        formData.append('twitter', newTwitter || "")
        formData.append('instagram', newInstagram || "")
        formData.append('signature', signature)

        if (file) {
            const lowFile = await resizeFile(file, 100, Math.floor(100 * fileRatio))
            const mediumFile = await resizeFile(file, 250, Math.floor(250 * fileRatio))
            const highFile = await resizeFile(file, 500, Math.floor(500 * fileRatio))
            formData.append('originals', file)
            formData.append('lows', lowFile)
            formData.append('mediums', mediumFile)
            formData.append('highs', highFile)
        } else {
            formData.append('originalLogo', userProfile.originalLogo || "")
            formData.append('lowLogo', userProfile.lowLogo || "")
            formData.append('mediumLogo', userProfile.mediumLogo || "")
            formData.append('highLogo', userProfile.highLogo || "")
        }

        if (fileBanner) {
            formData.append('banners', fileBanner)
        } else {
            formData.append('bannerUrl', userProfile.bannerUrl || "")
        }


        axios.post(`${process.env.REACT_APP_API}/user/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(async (res) => {
                setUpdating(false);
                if (res.data.status) {
                    dispatch(setUserByFetch(account));
                    await sleep(1000);
                    props.history.push(`/profile/${account}`);
                }
            })
            .catch(err => {
                setUpdating(false);
                toast.error(err.response.data.message);
            })
    }

    useEffect(() => {
        if (user) {
            setUserInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    function setUserInfo() {
        setUserProfile(user);
        setNewProfilePicSrc(user.originalLogo);
        setNewBannerPicSrc(user.bannerUrl)
        setNewName(user.name);
        setNewBio(user.bio);
        setNewEmail(user.email);
        setNewTwitter(user.twitter);
        setNewInstagram(user.instagram);
    }

    function handleFileBanner(event) {
        if (event.target.files) {
            const fileType = event.target.files[0].type.split("/")[0];
            if (fileType === "image") {
                setFileBanner(event.target.files[0]);
                // setImgUploadingBanner(true);
                // getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                //     setNewBannerPicSrc(`https://ipfs.hex.toys/ipfs/${hash}`);
                //     setImgUploadingBanner(false);
                // });
            } else {
                toast.error("Unsupported Type")
            }

        }
    }

    function handleFileAvatar(event) {
        if (event.target.files) {
            if (event.target.files[0].size > 4e6) {
                toast.error('The asset should not be more than 4MB')
                event.target.value = ''
                return
            }
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
                //     setNewProfilePicSrc(`https://ipfs.hex.toys/ipfs/${hash}`);
                //     setImgUploading(false);
                // });
            } else {
                toast.error("Unsupported Type")
            }
        }
    }

    return (
        <div>
            <Header {...props} />
            <div className="edit_profile">
                {
                    account ?
                        <div className="container">
                            <div className='title'>
                                <h1>Edit Profile</h1>
                            </div>
                            <div className="wrapper">
                                <div className="edit_banner">
                                    <div className="edit_content">

                                        <img src={(fileBanner ? URL.createObjectURL(fileBanner) : newBannerPicSrc) || "/hextoysmarketplace.jpg"} alt='' />
                                        <div className="camera_icon"><i className="fas fa-camera"></i></div>
                                        <input type="file" accept="image/*" multiple={false} onChange={handleFileBanner} />
                                    </div>
                                    {/* <a className="img_link" href={newBannerPicSrc && !imgUploading ? newBannerPicSrc : '/'} target='_blank' rel="noreferrer noopener">
                                        {fileBanner && !imgUploadingBanner ? "Uploaded!" : imgUploadingBanner ? "uploading to IPFS..." : ""}
                                    </a> */}
                                </div>
                                <div className="edit_avatar">
                                    <div className="edit_content">
                                        <img src={(file ? URL.createObjectURL(file) : newProfilePicSrc) || "/profile.png"} alt='' />
                                        <div className="camera_icon"><i className="fas fa-camera"></i></div>
                                        <input type="file" accept="image/*" multiple={false} onChange={handleFileAvatar} />
                                    </div>
                                    {/* <a className="img_link" href={newProfilePicSrc && !imgUploading ? newProfilePicSrc : '/'} target='_blank' rel="noreferrer noopener">
                                        {file && !imgUploading ? "Uploaded!" : imgUploading ? "uploading to IPFS..." : ""}
                                    </a> */}
                                </div>
                                <div className="my_form">
                                    <div className="row">
                                        <h3 className={`label text_color_1_${theme}`}>Name</h3>
                                        <input onChange={e => setNewName(e.target.value)} value={newName} className={`bg_${theme}`} />
                                    </div>
                                    <div className="row">
                                        <h3 className={`label text_color_1_${theme}`}>Bio</h3>
                                        <textarea onChange={e => setNewBio(e.target.value)} value={newBio} className={`bg_${theme}`} />
                                    </div>
                                    <div className="row">
                                        <h3 className={`label text_color_1_${theme}`}>Email</h3>
                                        <input onChange={e => setNewEmail(e.target.value)} value={newEmail} className={`bg_${theme}`} />
                                    </div>
                                    <div className="row">
                                        <h3 className={`label text_color_1_${theme}`}>Twitter link</h3>
                                        <input onChange={e => setNewTwitter(e.target.value)} value={newTwitter} className={`bg_${theme}`} />
                                    </div>
                                    <div className="row">
                                        <h3 className={`label text_color_1_${theme}`}>Instagram link</h3>
                                        <input onChange={e => setNewInstagram(e.target.value)} value={newInstagram} className={`bg_${theme}`} />
                                    </div>
                                    <div className="btn_div">
                                        <Button label='Cancel' outlineBtnColor roundFull onClick={() => props.history.push(`/profile/${account}`)} />
                                        <Button label={<>{!updating ? 'Update' : <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />}</>} fillBtn roundFull onClick={() => updateProfile()} />
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
            <Footer />
        </div>
    );
}

export default EditProfile;
