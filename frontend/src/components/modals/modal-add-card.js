/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useActiveWeb3React } from "../../hooks";
import Checkbox from "antd/lib/checkbox/Checkbox";
import ThemeContext from '../../context/ThemeContext';

import axios from 'axios';
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Element from "./style";
import { getNFTTokenBalance, addTokenBatch } from "../../utils/contracts";
import unknownImg from "../../assets/images/unknown.jpg";
import Button from "../Widgets/CustomButton";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalAddCard(props) {
  const { theme } = useContext(ThemeContext)
  const { mysteryboxAddress, showAddCardModal, setShowAddCardModal } = props;
  const { account, active, library } = useActiveWeb3React();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([]);
    setNoItems(false);
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    fetchItems(true);
  }, [account])

  useEffect(() => {
    setLoading(true)
    if (initialItemsLoaded) {
      fetchItems(false);
    }
  }, [page])

  function fetchItems(reset) {
    if (account) {
      let query = `${process.env.REACT_APP_API}/items?owner=${account}`
      let queryUrl = `${query}&page=${reset ? 1 : page}`

      axios.get(queryUrl)
        .then(res => {
          setLoading(false);
          if (res.data.status) {
            if (res.data.items.length === 0) setNoItems(true);
            if (reset) {
              setItems(res.data.items);
              setInitialItemsLoaded(true);
              if (res.data.items.length === res.data.count) {
                setNoItems(true);
              }
            } else {
              let prevArray = JSON.parse(JSON.stringify(items))
              prevArray.push(...res.data.items)
              setItems(prevArray);
              if (prevArray.length === res.data.count) {
                setNoItems(true);
              }
            }            
          } else {
            setNoItems(true);
          }
        })
        .catch(err => {
          setLoading(false);
          setNoItems(true);
        })
    }

  }

  function loadMore() {
    if (!loading) {
      setPage(page => { return (page + 1) })
    }
  }

  const [adding, setAdding] = useState(false);

  const [openedArray, setOpenedArray] = useState(() => [].map((x) => false));
  const [amountArray, setAmountArray] = React.useState(() => [].map((x) => 1));
  useEffect(() => {
    if (items && items.length > 0) {
      setAmountArray(items.map((x) => 1))
    }
  }, [items])

  const hanldeOwnedNftOpenBtn = (index) => {
    const newVisibilities = [...openedArray];
    newVisibilities[index] = !newVisibilities[index];
    setOpenedArray(newVisibilities);
  };

  const hanldeOwnedNftAmountChange = (index, value) => {
    const prevAmounts = [...amountArray];
    prevAmounts[index] = Number(value);
    setAmountArray(prevAmounts);
  };

  function getBalance(nftInfo, address) {
    const result = nftInfo.holders.find((obj) => {
      return obj.address === address.toLowerCase();
    });
    return result.balance;
  }

  async function addCard() {

    var cardTypes = [];
    var collections = [];
    var tokenIdList = [];
    var amountList = [];
    var amountToStake = 0;
    var itemCount = 0;
    for (let index = 0; index < items.length; index++) {
      if (openedArray[index]) {
        const item = items[index];
        const amount = amountArray[index];
        const holdingAmount = getBalance(item, account);
        if (amount > holdingAmount || amount < 1) {
          toast.error("Please invalid amount!");
          return;
        }
        cardTypes.push(item.type);
        collections.push(item.itemCollection);
        tokenIdList.push(item.tokenId);
        amountList.push(Math.floor(amount));
        amountToStake = amountToStake + amount;
        itemCount = itemCount + 1;
      }
    }
    if (amountToStake < 1) {
      toast.error("Please select nft!");
      return;
    }
    if (itemCount > 20) {
      toast.error("you can add up to 20 different nfts!");
      return;
    }

    setAdding(true);
    const load_toast_id = toast.loading("Please wait for adding nfts...");

    addTokenBatch(
      account,
      mysteryboxAddress,
      cardTypes,
      collections,
      tokenIdList,
      amountList,
      library
    ).then(async (result) => {
      toast.dismiss(load_toast_id);
      if (result) {
        toast.success("adding nft success! Data will be synced after some block confirmation...");
        setAdding(false);
        await sleep(2000);
        window.location.reload();
      } else {
        toast.error("Failed Transaction!");
        setAdding(false);
      }
    });
  }

  function closeAddCardModal() {
    setShowAddCardModal(false);
  }

  return (
    <Modal
      isOpen={showAddCardModal}
      onRequestClose={() => closeAddCardModal()}
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
          zIndex: 99,
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
          maxHeight: '600px',
          borderRadius: '20px',
          backgroundColor: theme === 'dark' ? '#060714' : '#fff',
          borderColor: theme === 'dark' ? '#060714' : '#fff',
          zIndex: 9999
        },
      }}
    >
      {
        account ?
          <Element.ModalBody>
            <Element.ModalHeader>
              <Element.ModalTitle className={`text_color_1_${theme}`}>Select NFTs</Element.ModalTitle>
              <Element.ModalCloseIcon className={`text_color_1_${theme}`} size={32} onClick={() => closeAddCardModal()} />
            </Element.ModalHeader>
            <Element.NFTContainer>
              {
                items.map((item, index) =>
                  <Element.NFTContent key={index}>
                    <div className="amount">
                      <p className={`text_color_4_${theme}`}>{getBalance(item, account)} entities</p>
                    </div>
                    {
                      openedArray[index] &&
                      <Checkbox 
                        className={`check text_color_4_${theme}`}
                        checked={true}
                      />
                    }
                    <div className="imageContainer"
                      onClick={() => hanldeOwnedNftOpenBtn(index)}
                    >
                      <img src={(item.isThumbSynced ? item.mediumLogo : item.image) || unknownImg} alt="" />
                    </div>
                    {
                      openedArray[index] &&
                      <div className="inputContainer">
                        <input
                          type={"number"}
                          name=""
                          id=""
                          placeholder="Type amount..."
                          disabled={item.type === 'single' ? true : false}
                          value={amountArray[index]}
                          onChange={event => hanldeOwnedNftAmountChange(index, event.target.value)}
                          className={`border_${theme}`}
                        />
                      </div>
                    }

                  </Element.NFTContent>
                )
              }
              <div className="btn_div" style={{ display: noItems ? "none" : "" }}>
                <Button
                  label = {loading ? "Loading..." : "Load more"}
                  outlineBtn roundFull
                  onClick={() => loadMore()}
                />
              </div>
            </Element.NFTContainer>
            <Element.ModalAction>
              <Button
                label = {
                  adding ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                    :
                    <> Add </>
                }
                fillBtn roundFull w_full
                onClick={addCard}
              />
              
            </Element.ModalAction>

          </Element.ModalBody>
          :
          <></>
      }
    </Modal>
  );
};

export default ModalAddCard;
