/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import Resizer from "react-image-file-resizer";
import { useActiveWeb3React } from "../../hooks";

import Modal from "react-modal";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';

import * as Element from "./style";
import { createCollection } from "../../utils/contracts";
import { getIpfsHash } from "../../utils/ipfs";
import Button from "../Widgets/CustomButton";

function ModalCreateCollection(props) {
  const { showCreateCollectionDlg, setShowCreateCollectionDlg } = props;
  const { theme } = useContext(ThemeContext);

  const { account, library } = useActiveWeb3React();
  const [collectionFile, setCollectionFile] = useState(null);
  const [fileRatio, setFileRatio] = useState(1);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [collectionCoverFile, setCollectionCoverFile] = useState(null);

  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [type, setType] = useState("single");

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
    }
  }

  function handleCollectionCoverImg(event) {
    const fileType = event.target.files[0].type.split("/")[0];
    if (fileType === "image") {
      setCollectionCoverFile(event.target.files[0]);
    }
  }

  function closeCollectionImg() {
    setCollectionFile(null);
  }

  function closeCollectionCoverImg() {
    setCollectionCoverFile(null);
  }


  async function onCreateCollection() {
    if (!newCollectionName) {
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

    setCreatingCollection(true);
    const optimize_toast_id = toast.loading("Optimizing images...");

    const formData = new FormData()
    const lowFile = await resizeFile(collectionFile, 100, Math.floor(100 * fileRatio))
    const mediumFile = await resizeFile(collectionFile, 250, Math.floor(250 * fileRatio))
    const highFile = await resizeFile(collectionFile, 500, Math.floor(500 * fileRatio))
    formData.append('originals', collectionFile)
    formData.append('lows', lowFile)
    formData.append('mediums', mediumFile)
    formData.append('highs', highFile)
    formData.append('banners', collectionCoverFile)

    toast.dismiss(optimize_toast_id);

    const upload_toast_id = toast.loading("Uploading images...");

    const instance = axios.create({
      baseURL: `${process.env.REACT_APP_API}`,
      timeout: 6000000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    instance.post(`/collection_asset/upload`, formData)
    .then(async (res) => {
      toast.dismiss(upload_toast_id);
      const openseadata = {
        name: newCollectionName,
        description: newCollectionDescription,
        category: category,
        image: res.data.original,
        lowLogo: res.data.lowLogo,
        mediumLogo: res.data.mediumLogo,
        highLogo: res.data.highLogo,
        coverUrl: res.data.coverUrl
      };

      const ipfs_toast_id = toast.loading("Uploading metadata to ipfs...");       

      getIpfsHash(openseadata).then((hash) => {
        toast.dismiss(ipfs_toast_id);
        let collectionUri = `https://ipfs.hex.toys/ipfs/${hash}`;
        const load_toast_id = toast.loading("Please wait for creating collection...");
        createCollection(
          type,
          newCollectionName,
          collectionUri,
          library
        ).then(async (result) => {
          toast.dismiss(load_toast_id);
          if (result) {
            setNewCollectionName("");
            setNewCollectionDescription("");
            toast.success("Collection was created! Data will be synced after some block confirmation...");
            setShowCreateCollectionDlg(false);
            setCreatingCollection(false);
            return;
          } else {
            setNewCollectionName("");
            setNewCollectionDescription("");
            setCreatingCollection(false);
            toast.error("Failed Transaction!");
            return;
          }
        });
      });
    })
      .catch(err => {
        toast.dismiss(upload_toast_id);
        toast.error('failed to upload image.');
        console.log('uploading image error:', err);
        // toast.error(err.response.data.message);
      })
  }

  function closeModal() {
    setNewCollectionName("");
    setNewCollectionDescription("");
    setShowCreateCollectionDlg(false);
    setCreatingCollection(false);
  }

  return (
    <Modal
      isOpen={showCreateCollectionDlg}
      onRequestClose={() => closeModal()}
      ariaHideApp={false}
      style={{
        overlay: {
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0, .8)",
          overflowY: "auto",
          zIndex: 9999,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '600px',
          // maxHeight: '600px',
          borderRadius: '20px',
          backgroundColor: theme === 'dark' ? '#060714' : '#fff',
          borderColor: theme === 'dark' ? '#060714' : '#fff',
          zIndex: 9999
        },
      }}
    >
      <Element.ModalBody>
        <Element.ModalTitle className={`text_color_1_${theme}`}> Create Collection</Element.ModalTitle>
        <Element.CollectionModalContent>
          <div className="col_div">
            {!collectionFile ?
              <Element.UploadContainerModal>
                <div className="content">
                  <Element.UploadCaption className={`${theme}`}> Logo image. 400x400 recommended.
                  </Element.UploadCaption>
                  <Button
                    label={<>Choose File
                      <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionImg} /></>}
                    outlineBtnColor roundFull
                  />
                </div>
              </Element.UploadContainerModal> :
              <Element.PreviewContainer className={`border_color_${theme}`}>
                <Element.CloseIconContainer>
                  <CloseIcon className={`text_color_1_${theme}`} onClick={() => closeCollectionImg()} fontSize="small" />
                </Element.CloseIconContainer>
                <Element.MediaContainer>
                  <Element.ImagePreview src={URL.createObjectURL(collectionFile)} />
                </Element.MediaContainer>
              </Element.PreviewContainer>
            }
          </div>
          <div className="col_div">
            {!collectionCoverFile ?
              <Element.UploadContainerModal>
                <div className="content">
                  <Element.UploadCaption className={`${theme}`}> Cover image. 1600x400 recommended.
                  </Element.UploadCaption>
                  <Button
                    label={<>Choose File
                      <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionCoverImg} /></>}
                    outlineBtnColor roundFull
                  />
                </div>
              </Element.UploadContainerModal> :
              <Element.PreviewContainer className={`border_color_${theme}`}>
                <Element.CloseIconContainer>
                  <CloseIcon className={`text_color_1_${theme}`} onClick={() => closeCollectionCoverImg()} fontSize="small" />
                </Element.CloseIconContainer>
                <Element.MediaContainer>
                  {/* <CircularProgress style={{ display: collectionCoverImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} /> */}
                  <Element.ImagePreview src={URL.createObjectURL(collectionCoverFile)} />
                </Element.MediaContainer>
              </Element.PreviewContainer>
            }
          </div>

        </Element.CollectionModalContent>

        <Element.Field>
          <Element.Label className={`text_color_4_${theme}`}>Choose Type</Element.Label>
          <Element.SelectCategory className={`border_${theme}`} name={"type"} defaultValue={type} onChange={event => setType(event.target.value)}>
            <Element.SelectCategoryOption className={`border_${theme}`} value='single'>Single</Element.SelectCategoryOption>
            <Element.SelectCategoryOption className={`border_${theme}`} value='multi'>Multiple</Element.SelectCategoryOption>
          </Element.SelectCategory>
        </Element.Field>


        <Element.Field>
          <Element.Label className={`text_color_4_${theme}`}>Display name</Element.Label>
          <Element.Input className={`border_${theme}`} placeholder={"Enter name"} value={newCollectionName} onChange={event => setNewCollectionName(event.target.value)} />
        </Element.Field>

        <Element.Field>
          <Element.Label className={`text_color_4_${theme}`}>Description <span> (Optional)</span></Element.Label>
          <Element.Input className={`border_${theme}`} placeholder={"Enter description"} value={newCollectionDescription} onChange={event => setNewCollectionDescription(event.target.value)} />
        </Element.Field>

        <Element.Field>
          <Element.Label className={`text_color_4_${theme}`}>Select Category</Element.Label>
          <Element.SelectCategory className={`border_${theme}`} name={"category"} defaultValue={category} onChange={event => setCategory(event.target.value)}>
            {
              categories.map((categoryItem, index) => {
                return (
                  <Element.SelectCategoryOption className={`border_${theme}`} key={index} value={categoryItem.name}>{categoryItem.name}</Element.SelectCategoryOption>
                );
              })
            }
          </Element.SelectCategory>
        </Element.Field>

        <Element.ModalAction>
          <Button
            label={
              creatingCollection ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Create Collection"
            }
            fillBtn roundFull w_full
            onClick={() => onCreateCollection()}
          />

        </Element.ModalAction>
      </Element.ModalBody>
    </Modal>
  );
};

export default ModalCreateCollection;
