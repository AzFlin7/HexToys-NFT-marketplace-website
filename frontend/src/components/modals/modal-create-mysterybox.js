import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";
import toast from "react-hot-toast";

import Modal from "react-modal";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThemeContext from '../../context/ThemeContext';

import * as Element from "./style";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { createMysteryBox } from "../../utils/contracts";
import { getCurrencyInfoFromAddress, Tokens } from "../../utils";
import Button from "../Widgets/CustomButton";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalCreateMysteryBox(props) {
  const { theme } = useContext(ThemeContext)

  const { showCreateMysteryBox, setShowCreateMysteryBox } = props;

  const { account, library } = useActiveWeb3React();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [putPrice, setPutPrice] = useState(0);
  const [currencyInfo, setCurrencyInfo] = useState(null);
  useEffect(() => {
    setCurrencyInfo(Tokens[0])
  }, [])


  const [creating, setCreating] = useState(false)

  const [logoFile, setLogoFile] = useState(null);
  const [logoImgHash, setLogoImgHash] = useState("");
  const [logoImgUploading, setLogoImgUploading] = useState(false);

  function handleLogoImg(event) {
    const fileType = event.target.files[0].type.split("/")[0];
    if (fileType === "image") {
      setLogoFile(event.target.files[0]);
      setLogoImgUploading(true);
      getIpfsHashFromFile(event.target.files[0]).then((hash) => {
        setLogoImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
        setLogoImgUploading(false);
      });
    }
  }
  function closeLogoImg() {
    setLogoFile(null);
    setLogoImgHash("");
    setLogoImgUploading(false);
  }

  const createNewMysteryBox = async () => {
    if (!currencyInfo) {
      toast.error("Please select currency");
      return;
    }
    if (logoImgHash === "") {
      toast.error("Please select image");
      return;
    }
    if (name === "") {
      toast.error("Please Input Name");
      return;
    }
    if (description === "") {
      toast.error("Please Input Description");
      return;
    }
    if (putPrice <= 0) {
      toast.error("Please Input price correctly");
      return;
    }

    const openseadata = {
      name: name,
      description: description,
      image: logoImgHash
    };
    setCreating(true);
    const load_toast_id = toast.loading("Please wait for creating Hypercubes...");    
    getIpfsHash(openseadata).then((hash) => {
      let uri = `https://ipfs.hex.toys/ipfs/${hash}`;
      createMysteryBox(
        name,
        uri,
        currencyInfo.address,
        putPrice,
        library
      ).then(async (result) => {
        toast.dismiss(load_toast_id);
        if (result) {
          toast.success("MysteryBox is created! Data will be synced after some block confirmation...");
          setCreating(false);
          await sleep(2000);
          window.location.reload();
          return;
        } else {
          toast.error("Failed Transaction!");          
          setCreating(false);
          return;
        }
      });
    });
  };

  function closeCreateMysteryBox() {
    setShowCreateMysteryBox(false);
    setName("");
    setDescription("");
  }

  return (
    <Modal
      isOpen={showCreateMysteryBox}
      onRequestClose={() => closeCreateMysteryBox()}
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
          zIndex: 99999,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '500px',
          maxHeight: '90vh',
          borderRadius: '20px',
          backgroundColor: theme === 'dark' ? '#060714' : '#fff',
          borderColor: theme === 'dark' ? '#060714' : '#fff',
          zIndex: 9999
        },
      }}
    >
      {
        account && 
        <Element.ModalBody>
          <Element.ModalHeader>
            <Element.ModalCloseIcon size={32} onClick={() => closeCreateMysteryBox()} style={{color : theme === 'dark' ?'#fff':'#000'}}/>
          </Element.ModalHeader>

          <Element.ModalContent>
            <h1 className={`modal_title text_color_1_${theme}`}> Create Page </h1>
            <h3 className={`text_color_1_${theme}`}>Upload Logo Image</h3>
            <p className={`text_color_3_${theme}`} style={{margin: 0}}>Click below to browse.</p>
            <Element.UploadContainerLoot style={{ display: logoFile ? "none" : ""}} className={`border_${theme}`}>
              <div className="content">
              <Element.UploadCaption> JEPG, PNG, GIF 300X300 Recommended</Element.UploadCaption>
              
              <Button label={<>Choose File <Element.FileInput type="file" value="" accept="image/*" onChange={handleLogoImg} /></>} whiteColor roundFull/>

              </div>
              
            </Element.UploadContainerLoot>

            <Element.PreviewContainer style={{ display: logoFile ? "" : "none" }}>
              <Element.CloseIconContainer style={{ display: logoImgHash ? "" : "none" }}>
                <CloseIcon onClick={() => closeLogoImg()} fontSize="small" />
              </Element.CloseIconContainer>
              <Element.MediaContainer>
                <CircularProgress style={{ display: logoImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                <Element.ImagePreview style={{ display: logoImgHash ? "" : "none" }} src={logoImgHash} />
              </Element.MediaContainer>
            </Element.PreviewContainer>
          </Element.ModalContent>

          <Element.MysteryBoxContainer>
            <div className="dialog-item">
              <h3 className={`text_color_1_${theme}`}> Name </h3>
              <input 
                value={name}
                onChange={(e) => { setName(e.target.value) }}
                placeholder="Enter MysteryBox name" 
                className={`text_color_3_${theme} border_1_${theme}`}
              />
            </div>

            <div className="dialog-item">
              <h3 className={`text_color_1_${theme}`}>Description</h3>
              <textarea 
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
                placeholder="Describe something about the MysteryBox" 
                className={`text_color_3_${theme} border_1_${theme}`}
              />
            </div>

            <Element.InputContainer className={`border_1_${theme}`}>
              <Element.Input 
                type={"number"} 
                placeholder={"Enter Price"} 
                value={putPrice} 
                onChange={event => setPutPrice(event.target.value)}
                className={`text_color_3_${theme}`}
              />
              <Element.CurrencySelect  className={``} name={"currencies"} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(event.target.value))}>
                {
                  Tokens.map((currencyItem, index) =>
                    <Element.OrderByOption  className={`border_1_${theme}`} key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                  )
                }
              </Element.CurrencySelect>
            </Element.InputContainer>

            <div className="dialog-item">
              <Button 
                label = {
                  creating ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                    :
                    <> Create </>
                }
                onClick={createNewMysteryBox}
                disabled = {creating}
                fillBtn
                roundFull
                w_full
              />
            </div>
          </Element.MysteryBoxContainer>
        </Element.ModalBody>
      }      
    </Modal>
  );
};

export default ModalCreateMysteryBox;
