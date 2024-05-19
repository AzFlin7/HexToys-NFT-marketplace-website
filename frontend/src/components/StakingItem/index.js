import React, { useState, useEffect } from 'react';
import { useActiveWeb3React } from "../../hooks";
import toast from 'react-hot-toast';
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "antd/lib/checkbox/Checkbox";

import * as Element from "./style";
import unknownImg from "../../assets/images/unknown.jpg";

import { getPendingRewards, stake, withdraw } from "../../utils/contracts";
import { getCurrencyInfoFromAddress, registerToken, NetworkParams, formatNum } from "../../utils";
import Metamask from "../../icons/Metamask";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const StakingItem = (props) => {
  const { staking } = props;
  const { account, library } = useActiveWeb3React();
  const [pendingReward, setPendingReward] = useState(0);
  useEffect(() => {
    if (account && library && staking) {
      getPendingRewards(staking.type, staking.address, account, library)
        .then((value) => {
          setPendingReward(value);
        })
        .catch(() => {
          setPendingReward(0);
        })
    } else {
      setPendingReward(0);
    }
  }, [account, library, staking])

  // details open----------------------------
  const [detailOpen, setDetailOpen] = useState(false);

  // Staked NFT Modal ------------------------------------
  const [unstakingStatus, setUnstakingStatus] = useState(false);
  const [stakedNFTModalOpen, setStakedNFTModalOpen] = useState(false);

  // Staked NFT Input Open
 const [stakedNFTOpen, setStakedNFTOpen] = useState(() => [].map((x) => false));
  const [stakedNFTAmount, setStakedNFTAmount] = useState(() => staking?.stakeditems?.map((x) => 1));

  const hanldeStakedNftInputOpenBtn = (index) => {
    const newVisibilities = [...stakedNFTOpen];
    newVisibilities[index] = !newVisibilities[index];
    setStakedNFTOpen(newVisibilities);   
  };

  const hanldeStakedNftInputChange = (index, value) => {
    const prevAmounts = [...stakedNFTAmount];
    prevAmounts[index] = Number(value);
    setStakedNFTAmount(prevAmounts);
  };



  async function putUnstake() {
    if (unstakingStatus) {
      return;
    }
    if (!(account && library && staking && staking.stakeditems)) {
      setStakedNFTModalOpen(false);
      return;
    }
    var tokenIdList = [];
    var amountList = [];
    for (let index = 0; index < staking.stakeditems.length; index++) {
      if (stakedNFTOpen[index]) {
        const stakeditem = staking.stakeditems[index];
        const amount = stakedNFTAmount[index];
        const stakedAmount = Number(stakeditem.amount);
        if (amount > stakedAmount || amount < 1) {
          toast.error("Please invalid amount!");
          return;
        }
        tokenIdList.push(stakeditem.tokenId);
        amountList.push(Math.floor(amount));
      }
    }
    if (tokenIdList.length < 1) {
      toast.error("Please select nft!");
      return;
    }

    setUnstakingStatus(true);
    const load_toast_id = toast.loading("Please wait for UnStaking...");

    withdraw(
      staking.type,
      staking.address,
      tokenIdList,
      amountList,
      Number(staking.withdrawFeePerNft),
      library
    ).then(async (result) => {
      toast.dismiss(load_toast_id);
      if (result) {
        setUnstakingStatus(false);
        setStakedNFTModalOpen(false);
        toast.success("UnStake Success! Data will be synced after some block confirmation...");
        await sleep(2000);
        window.location.reload();
        return;
      } else {
        setUnstakingStatus(false);
        toast.error("Failed Transaction!");
        return;
      }
    });
  }





  // Owned NFTs modal-----------------------------------------
  const [stakingStatus, setStakingStatus] = useState(false);
  const [ownedNftModalOpen, setOwnedNftModalOpen] = useState(false);


  // Owned NFTs Input Open    
  const [ownedNFTOpen, setOwnedNFTOpen] = useState(() => [].map((x) => false));
  const [ownedNFTAmount, setOwnedNFTAmount] = React.useState(() => staking?.owneditems?.map((x) => 1));


  const hanldeOwnedNftOpenBtn = (index) => {
    const newVisibilities = [...ownedNFTOpen];
    newVisibilities[index] = !newVisibilities[index];
    setOwnedNFTOpen(newVisibilities);    
  };

  const hanldeOwnedNftAmountChange = (index, value) => {
    const prevAmounts = [...ownedNFTAmount];
    prevAmounts[index] = Number(value);
    setOwnedNFTAmount(prevAmounts);
  };

  function getBalance(nftInfo, address) {
    const result = nftInfo.holders.find((obj) => {
      return obj.address === address.toLowerCase();
    });
    return result.balance;
  }

  async function putStake() {
    if (stakingStatus) {
      return;
    }

    if (!(account && library && staking && staking.owneditems)) {
      setOwnedNftModalOpen(false);
      return;
    }

    var tokenIdList = [];
    var amountList = [];
    var amountToStake = 0;
    for (let index = 0; index < staking.owneditems.length; index++) {
      if (ownedNFTOpen[index]) {
        const owneditem = staking.owneditems[index];
        const amount = ownedNFTAmount[index];
        const holdingAmount = getBalance(owneditem, account);
        if (amount > holdingAmount || amount < 1) {
          toast.error("Please invalid amount!");
          return;
        }
        tokenIdList.push(owneditem.tokenId);
        amountList.push(Math.floor(amount));
        amountToStake = amountToStake + amount;
      }
    }
    if (amountToStake < 1) {
      toast.error("Please select nft!");
      return;
    }
    if (amountToStake > staking.maxNftsPerUser) {
      toast.error("Limit max stake per user!");
      return;
    }

    setStakingStatus(true);
    const load_toast_id = toast.loading("Please wait for Staking...");

    stake(
      staking.type,
      staking.address,
      staking.stakeNftAddress,
      tokenIdList,
      amountList,
      Number(staking.depositFeePerNft),
      account,
      library
    ).then(async (result) => {
      toast.dismiss(load_toast_id);
      if (result) {
        setStakingStatus(false);
        setOwnedNftModalOpen(false);
        toast.success("Stake Success! Data will be synced after some block confirmation...");
        await sleep(2000);
        window.location.reload();
        return;
      } else {
        setStakingStatus(false);
        toast.error("Failed Transaction!");
        return;
      }
    });
  }

  const [harvestStatus, setHarvestStatus] = useState(false);

  async function harvest() {
    if (harvestStatus) {
      return;
    }

    if (!(account && library && staking)) {
      return;
    }

    setHarvestStatus(true);
    const load_toast_id = toast.loading("Please wait for Harvesting...");

    stake(
      staking.type,
      staking.address,
      staking.stakeNftAddress,
      [],
      [],
      Number(staking.depositFeePerNft),
      account,
      library
    ).then(async (result) => {
      toast.dismiss(load_toast_id);
      if (result) {
        setHarvestStatus(false);
        toast.success("Harvest Success!");
        window.location.reload();
        return;
      } else {
        setHarvestStatus(false);
        toast.error("Failed Transaction!");
        return;
      }
    });
  }

  return (
    <>
      {
        staking &&
        <Element.Container>
          <div className="node-preview">
            <img className="node-img" src={staking.collectionInfo.mediumLogo} alt="logo" />
          </div>
          <div className="node-main-content">            
            <Element.ModalRow>
              <Element.ModalText1>APR</Element.ModalText1>
              <Element.ModalText1>{Number(staking.apr) / 10} %</Element.ModalText1>
            </Element.ModalRow>
            <Element.ModalRow>
              <Element.ModalText1>NFT Price</Element.ModalText1>
              <Element.ModalText1>{formatNum(staking.stakeNftPrice)} {getCurrencyInfoFromAddress(staking.rewardTokenAddress)?.symbol}</Element.ModalText1>
            </Element.ModalRow>
            <Element.ModalRow>
              <Element.ModalText1>Earn</Element.ModalText1>
              <Element.ModalText1>{getCurrencyInfoFromAddress(staking.rewardTokenAddress)?.symbol}</Element.ModalText1>
            </Element.ModalRow>
            {
              account && 
              <div>
                <Element.ModalRow>
                  <Element.ModalText2>Staked NFTs ({staking.stakeditems?.length})</Element.ModalText2>
                  <Element.ModalButton onClick={() => setStakedNFTModalOpen(!stakedNFTModalOpen)}>
                    Unstake
                  </Element.ModalButton>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText2>Owned NFTs ({staking.owneditems?.length})</Element.ModalText2>
                  <Element.ModalButton onClick={() => setOwnedNftModalOpen(!ownedNftModalOpen)}>
                    Stake
                  </Element.ModalButton>
                </Element.ModalRow>
              </div>
            }

            {
              account && 
              <Element.EarnContainer>
                <div>
                  <Element.EarnTitle>
                    {getCurrencyInfoFromAddress(staking.rewardTokenAddress)?.symbol} EARNED
                  </Element.EarnTitle>
                  <Element.EarnContent>
                    <Element.EarnValue>
                      {formatNum(pendingReward)}
                    </Element.EarnValue>
                  </Element.EarnContent>
                </div>
                {
                  pendingReward > 0 &&
                  <Element.ModalButton onClick={() => harvest()}>
                    {
                      harvestStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Harvest"
                    }
                  </Element.ModalButton>
                }
              </Element.EarnContainer>
            }
            <Element.ModalRow>
              <Element.ModalText1>STAKE</Element.ModalText1>
              <Element.ModalText3 onClick={() => window.open(`/collection/${staking.stakeNftAddress}`)}>
                {staking.collectionInfo.name}
              </Element.ModalText3>
            </Element.ModalRow>
          </div>
          <Element.DetailContainer>
            <Element.TitleView onClick={() => setDetailOpen(!detailOpen)}>
              <p>{detailOpen ? "Hide" : "Details"}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className={`${detailOpen ? 'rotate-180' : ''}`} viewBox="0 0 10.18 6.09">
                <path id="Path" d="M0,0,3.676,3.676,7.352,0" transform="translate(1.414 1.414)" fill="none" stroke=""
                  strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={2} />
              </svg>
            </Element.TitleView>
            {
              detailOpen &&
              <Element.DetailContent>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Total staked:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {staking.totalStakedNfts}
                  </Element.ModalText5>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Max. stake:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {staking.maxStakedNfts}
                  </Element.ModalText5>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Max. stake per user:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {staking.maxNftsPerUser}
                  </Element.ModalText5>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Deposit fee per item:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {staking.depositFeePerNft}
                  </Element.ModalText5>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Withdraw fee per item:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {staking.withdrawFeePerNft}
                  </Element.ModalText5>
                </Element.ModalRow>
                <Element.ModalRow>
                  <Element.ModalText4>
                    Ends in:
                  </Element.ModalText4>
                  <Element.ModalText5>
                    {(new Date(staking.endTime * 1000)).toDateString()}
                  </Element.ModalText5>
                </Element.ModalRow>

                <Element.BottomSubView>
                  <p onClick={() => window.open(`${NetworkParams.blockExplorerUrls[0]}/address/${staking.address}`)}>
                    View Contract
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="link" fill="none" viewBox="0 0 24 24" stroke="" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Element.BottomSubView>
                {
                  account && (staking.rewardTokenAddress !== '0x0000000000000000000000000000000000000000') &&
                  <Element.BottomSubView
                    onClick={() => registerToken(staking.rewardTokenAddress, getCurrencyInfoFromAddress(staking.rewardTokenAddress)?.symbol, getCurrencyInfoFromAddress(staking.rewardTokenAddress)?.decimals)}>
                    <p>
                      Add to Metamask
                    </p>
                    <Metamask width="1.25rem" />
                  </Element.BottomSubView>
                }
              </Element.DetailContent>
            }
          </Element.DetailContainer>

        </Element.Container>
      }
      {
        account && staking && stakedNFTModalOpen && staking.stakeditems &&
        <Modal
          isOpen={stakedNFTModalOpen}
          onRequestClose={() => setStakedNFTModalOpen(false)}
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
              backgroundColor: '#fff',
              zIndex: 9999
            },
          }}
        >
          <Element.ModalBody>
            <Element.ModalHeader>
              <Element.ModalTitle>Staked NFTs</Element.ModalTitle>
              <Element.ModalCloseIcon size={32} onClick={() => setStakedNFTModalOpen(false)} />
            </Element.ModalHeader>

            <Element.NFTContainer>
              {
                staking.stakeditems.map((stakeditem, index) =>
                  <Element.NFTContent key={index}>
                    <div className="amount">
                      <p>{stakeditem.amount} entities</p>
                    </div>
                    {
                      stakedNFTOpen[index] &&
                      <Checkbox className='check'
                        checked={true}
                      />
                    }

                    <div className="imageContainer"
                      onClick={() => hanldeStakedNftInputOpenBtn(index)}
                    >
                      <img src={(stakeditem.itemInfo.isThumbSynced ? stakeditem.itemInfo.mediumLogo : stakeditem.itemInfo.image) || unknownImg} alt="" />
                    </div>
                    {
                      stakedNFTOpen[index] &&
                      <div className="inputContainer">
                        <input
                          type={"number"}
                          name=""
                          id=""
                          placeholder="Type amount..."
                          disabled={staking.type === 'single' ? true : false}
                          value={stakedNFTAmount[index]}
                          onChange={event => hanldeStakedNftInputChange(index, event.target.value)}
                        />
                      </div>
                    }

                  </Element.NFTContent>
                )
              }
            </Element.NFTContainer>

            <Element.ModalAction>
              <Element.ModalButton onClick={() => putUnstake()}>
                {
                  unstakingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Unstake"
                }
              </Element.ModalButton>
            </Element.ModalAction>
          </Element.ModalBody>
        </Modal>
      }
      {
        account && staking && ownedNftModalOpen && staking.owneditems &&
        <Modal
          isOpen={ownedNftModalOpen}
          onRequestClose={() => setOwnedNftModalOpen(false)}
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
              backgroundColor: '#fff',
              zIndex: 9999
            },
          }}
        >
          <Element.ModalBody>
            <Element.ModalHeader>
              <Element.ModalTitle>Owned NFTs</Element.ModalTitle>
              <Element.ModalCloseIcon size={32} onClick={() => setOwnedNftModalOpen(false)} />
            </Element.ModalHeader>


            <Element.NFTContainer>
              {
                staking.owneditems.map((owneditem, index) =>
                  <Element.NFTContent key={index}>
                    <div className="amount">
                      <p>{getBalance(owneditem, account)} entities</p>
                    </div>
                    {
                      ownedNFTOpen[index] &&
                      <Checkbox className='check'
                        checked={true}
                      />
                    }                    
                    <div className="imageContainer"
                      onClick={() => hanldeOwnedNftOpenBtn(index)}
                    >
                      <img src={(owneditem?.isThumbSynced ? owneditem.mediumLogo : owneditem.image) || unknownImg} alt="" />
                    </div>
                    {
                      ownedNFTOpen[index] &&
                      <div className="inputContainer">
                        <input
                          type={"number"}
                          name=""
                          id=""
                          placeholder="Type amount..."
                          disabled={staking.type === 'single' ? true : false}
                          value={ownedNFTAmount[index]}
                          onChange={event => hanldeOwnedNftAmountChange(index, event.target.value)}
                        />
                      </div>
                    }

                  </Element.NFTContent>
                )
              }
            </Element.NFTContainer>

            <Element.ModalAction>
              <Element.ModalButton onClick={() => putStake()}>
                {
                  stakingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Stake"
                }
              </Element.ModalButton>
            </Element.ModalAction>
          </Element.ModalBody>
        </Modal>
      }
    </>
  );
};

export default StakingItem;
