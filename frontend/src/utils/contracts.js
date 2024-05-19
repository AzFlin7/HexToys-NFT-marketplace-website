/* eslint-disable no-redeclare */
import { BigNumber, ethers } from "ethers";
import { fetchBalance } from '@wagmi/core';
import { getContractInfo, getContractObj, getTokenContract, getCollectionContract, getMysteryBoxContract, getStakingContract, CONTRACTS_BY_NETWORK } from ".";
import MysteryBoxABI from '../contracts/MysteryBox.json'

export function isAddress(address) {
    try {
        ethers.utils.getAddress(address);
    } catch (e) { return false; }
    return true;
}

export function toEth(amount, decimal) {
    return ethers.utils.formatUnits(String(amount), decimal);
}

export function toWei(amount, decimal) {
    return ethers.utils.parseUnits(String(amount), decimal);
}

/**
 * Payment Token Contract Management
 */


/**
 * getTokenBalance(account, tokenAddr, library)
 * account : user address
 * tokenAddr : payment token address
 */
export async function getTokenBalance(account, tokenAddr, library) {
    if (tokenAddr === '0x0000000000000000000000000000000000000000') {
        var balance = await fetchBalance({ address: account });
        var etherVal = parseFloat(ethers.utils.formatEther(String(balance.value)));
        return etherVal;
    } else {
        var tokenContract = getTokenContract(tokenAddr, library);
        if (tokenContract) {
            var balance = await tokenContract.balanceOf(account);
            var decimal = await tokenContract.decimals();
            return parseFloat(toEth(balance, decimal));
        }
    }
    return 0;
}

export async function isTokenApproved(account, tokenAddr, amount, toAddr, provider) {
    const tokenContract = getTokenContract(tokenAddr, provider);
    if (!tokenContract) return false;

    const decimal = await tokenContract.decimals();
    const allowance = await tokenContract.allowance(account, toAddr);
    if (BigNumber.from(toWei(amount, decimal)).gt(allowance)) {
        return false;
    }
    return true;
}

/**
 * approveToken(tokenAddr, to, provider)
 * tokenAddr : Payment token address
 * toAddr : address
 */
export async function approveToken(tokenAddr, toAddr, provider) {
    const tokenContract = getTokenContract(tokenAddr, provider);
    if (!tokenContract) return false;

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(toAddr, approveAmount);
        await approve_tx.wait(1);
        return true;
    } catch (e) {
        // console.log(e)
        return false;
    }
}


/**
 * NFT Contract Management
 */

/**
 * isNFTApproved(type, collection, to, account, provider)
 * type : single / multi
 * collection : collectioin address
 * account : user address
 * to : to address
 */
export async function isNFTApproved(type, collection, to, account, provider) {
    const nftToken = getCollectionContract(type, collection, provider);
    if (!nftToken) return false;
    return await nftToken.isApprovedForAll(account, to);
}

/**
 * setNFTApproval(type, collection, to, provider)
 * type : single / multi
 * collection : collectioin address
 * to : to address
 */
export async function setNFTApproval(type, collection, to, provider) {
    const nftToken = getCollectionContract(type, collection, provider);

    if (!nftToken) return false;
    try {
        const tx = await nftToken.setApprovalForAll(to, true);
        await tx.wait(1);
        return true;
    } catch (e) {
        // console.log(e)
    }
    return false;
}

export async function getNFTTokenBalance(account, collection, tokenId, provider) {
    const nftToken = getCollectionContract('multi', collection, provider);
    if (nftToken) {
        var balance = await nftToken.balanceOf(account, tokenId);
        return balance;
    }
    return 0;
}


/**
 * AddNFTCollection Contract Management
*/

/**
 * importCollection(address, name, uri, provider)
 * name : collection name
 * uri : collectioin uri
*/
export async function importCollection(address, name, uri, provider) {
    const importContract = getContractObj('AddNFTCollection', provider);
    if (!importContract) return false;
    try {
        var publicAdd = await importContract.publicAdd();
        if (publicAdd) {
            var fee = await importContract.fee();
            const tx = await importContract.importCollection(address, name, uri, {
                value: fee
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
            return false;
        } else {
            const tx = await importContract.importCollection(address, name, uri);
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
            return false;
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}

export async function isNFTAddress(address, provider) {
    const nftToken = getCollectionContract('single', address, provider);
    if (!nftToken) return false;
    try {
        const result = await nftToken.supportsInterface('0x01ffc9a7')
        return result;
    } catch (e) { return false; }
}

export async function getImportInfo(provider) {
    var info = {
        publicAdd: false,
        fee: 0,
        owner: ''
    }
    const importContract = getContractObj('AddNFTCollection', provider);
    if (!importContract) return info;
    try {
        var publicAdd = await importContract.publicAdd();
        info.publicAdd = publicAdd;

        var fee = await importContract.fee();
        info.fee = parseFloat(toEth(fee, 18));

        var owner = await importContract.owner();
        info.owner = owner;

        return info;
    } catch (e) { return info; }
}





/**
 * NFTFactory Contract Management
*/

export async function createCollection(type, name, uri, provider) {
    if (type === 'single') {
        let result = await createSingleCollection(name, uri, provider);
        return result;
    } else if (type === 'multi') {
        let result = createMultipleCollection(name, uri, provider);
        return result;
    } else {
        return false;
    }
}

/**
 * createSingleCollection(name, uri, provider)
 * name : collection name
 * uri : collectioin uri
*/
export async function createSingleCollection(name, uri, provider) {
    const factoryContract = getContractObj('NFTFactory', provider);
    if (!factoryContract) return false;
    try {
        const tx = await factoryContract.createSingleCollection(name, uri, false);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e);
        return false;
    }
}

/**
 * createMultipleCollection(name, uri, provider)
 * name : collection name
 * uri : collectioin uri
 */
export async function createMultipleCollection(name, uri, provider) {
    const factoryContract = getContractObj('NFTFactory', provider);
    if (!factoryContract) return false;
    try {
        const tx = await factoryContract.createMultipleCollection(name, uri, false);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e);
        return false;
    }
}








/**
 * NFT Collection Contract Management
*/

/**
 * addSingleItem(collection, uri, provider)
 * collection : collection address
 * uri : token uri
*/
export async function addSingleItem(collection, uri, provider) {
    const contractObj = getCollectionContract('single', collection, provider);
    if (!contractObj) return false;
    try {
        const tx = await contractObj.addItem(uri);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e)
        return false;
    }
}

/**
 * addMultiItem(collection, uri, provider)
 * collection : collection address
 * supply : number of copies
 * uri : token uri
*/
export async function addMultiItem(collection, uri, supply, provider) {
    const contractObj = getCollectionContract('multi', collection, provider);
    if (!contractObj) return false;
    try {
        const tx = await contractObj.addItem(supply, uri);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e)
        return false;
    }
}


// Trnasfer NFT

export async function sendNFT(collection, type, from, to, tokenId, amount, provider) {
    if (type === 'multi') {
        const result = await transferMultiItem(collection, from, to, tokenId, amount, provider);
        return result;
    } else {
        const result = await transferSingleItem(collection, from, to, tokenId, provider);
        return result;
    }
}


/**
 * transferSingleItem(collection, from, to, tokenId, provider)
 * collection : collection address
 * from : sender address
 * to : receiver address
 * tokenId : nft token ID
*/
export async function transferSingleItem(collection, from, to, tokenId, provider) {
    const nftToken = getCollectionContract('single', collection, provider);
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId);
        await tx.wait(1);

        return true;
    } catch (e) {
        // console.log(e);
        return false;
    }
}

/**
 * transferMultiItem(collection, from, to, tokenId, amount, provider)
 * collection : collection address
 * from : sender address
 * to : receiver address
 * tokenId : nft token ID
 * amount : transfer amount
*/
export async function transferMultiItem(collection, from, to, tokenId, amount, provider) {
    const nftToken = getCollectionContract('multi', collection, provider);
    var data = [];
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId, amount, data);
        await tx.wait(1);

        return true;
    } catch (e) {
        // console.log(e);
        return false;
    }
}




/**
 * Market Contract Management
 */

export async function approveNFTOnMarket(type, collection, account, provider) {
    try {
        let isApproved = await isNFTApproved(type, collection, CONTRACTS_BY_NETWORK.HexToysMarketV2.address, account, provider);
        if (isApproved) {
            return true;
        } else {
            isApproved = await setNFTApproval(type, collection, CONTRACTS_BY_NETWORK.HexToysMarketV2.address, provider);
            if (isApproved) {
                return true;
            } else {
                return false;
            }
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}

export async function approveTokenOnMarket(tokenAddr, amount, account, provider) {
    try {
        const Token = getTokenContract(tokenAddr, provider);
        if (!Token) return false;
        let tokenApproveStatus = await isTokenApproved(account, tokenAddr, amount, CONTRACTS_BY_NETWORK.HexToysMarketV2.address, provider);
        if (tokenApproveStatus) {
            return true;
        } else {
            tokenApproveStatus = await approveToken(tokenAddr, CONTRACTS_BY_NETWORK.HexToysMarketV2.address, provider);
            if (tokenApproveStatus) {
                return true;
            } else {
                return false;
            }
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}

export async function buyNFT(account, collection, tokenId, productId, amount, price, tokenAddr, seller, nftType, _royaltyArray, _receiverArray, _signature, provider) {
    const contract = getContractObj('HexToysMarketV2', provider);
    const contractInfo = getContractInfo('HexToysMarketV2');
    if (!contract || !contractInfo) return false;
    try {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
            const tx = await contract.buyNFT(collection,
                tokenId,
                productId,
                amount,
                toWei(price, 18),
                tokenAddr,
                seller,
                nftType,
                _royaltyArray,
                _receiverArray,
                _signature,
                {
                    value: toWei(price * amount, 18)
                })
            await tx.wait(2);
            return true;
        } else {
            const Token = getTokenContract(tokenAddr, provider);
            if (!Token) return false;
            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, price * amount, contractInfo.address, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, contractInfo.address, provider);
            }
            if (tokenApproveStatus) {
                const tx = await contract.buyNFT(collection,
                    tokenId,
                    productId,
                    amount,
                    toWei(price, 18),
                    tokenAddr,
                    seller,
                    nftType,
                    _royaltyArray,
                    _receiverArray,
                    _signature)
                await tx.wait(2);
                return true;
            }
            return false;
        }

    } catch (error) {
        // console.log(error)
        return false;
    }
}

/**
 * finalizeAuction()
 * id : auction ID
 */
export async function finalizeAuction(collection, tokenId, productId, price, tokenAddr, seller, bidder, _royaltyArray, _receiverArray, _signature, provider) {
    const contract = getContractObj('HexToysMarketV2', provider);
    if (!contract) return false;
    try {
        var decimal = 18;
        const Token = getTokenContract(tokenAddr, provider);
        if (!Token) return false;
        decimal = await Token.decimals();

        const tx = await contract.finalizeAuction(
            collection,
            tokenId,
            productId,
            toWei(price, decimal),
            tokenAddr,
            seller,
            bidder,
            _royaltyArray,
            _receiverArray,
            _signature);
        await tx.wait(2);
        return true;
    } catch (e) {
        // console.log(e)
        return false
    }
}


/**
 * MysteryBox Contract Management
*/

/**
 * createMysteryBox(name, uri, tokenAddress, price, provider)
 * name : MysteryBox name
 * uri : MysteryBox uri (it include name, description and image information)
 * tokenAddress : payment Token Address
 * price : playOncePrice
 */
export async function createMysteryBox(name, uri, tokenAddress, price, provider) {
    const factoryContract = getContractObj('MysteryBoxFactory', provider);
    if (!factoryContract) return false
    try {
        const creatingFee = await factoryContract.creatingFee();
        var decimal = 18;
        if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(tokenAddress, provider);
            decimal = await Token.decimals();
        }
        const tx = await factoryContract.createHexToysMysteryBox(name, uri, tokenAddress, toWei(price, decimal), {
            value: creatingFee
        })
        await tx.wait(2)
        return true
    } catch (error) {
        // console.log(error)
        return false
    }
}

export async function addToken(account, mysteryboxAddr, cardType, collection, tokenId, amount, provider) {
    let nftType = 'single';
    if (cardType === 1) {
        nftType = 'multi';
    }
    const mysteryboxContract = getMysteryBoxContract(mysteryboxAddr, provider);
    if (!mysteryboxContract) return false

    try {
        let isApproved = await isNFTApproved(nftType, collection, mysteryboxAddr, account, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval(nftType, collection, mysteryboxAddr, provider);
        }
        if (isApproved) {
            const tx = await mysteryboxContract.addToken(cardType, collection, tokenId, amount);
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true
            }
        }
        return false;
    } catch (e) {
        // console.log(e);
        return false;
    }
}

export async function addTokenBatch(account, mysteryboxAddr, cardTypes, collections, tokenIds, amounts, provider) {
    const mysteryboxContract = getMysteryBoxContract(mysteryboxAddr, provider);
    if (!mysteryboxContract) return false

    try {
        let nftTypes = [];
        for (let index = 0; index < collections.length; index++) {
            const cardType = cardTypes[index];
            const collection = collections[index];
            let isApproved = await isNFTApproved(cardType, collection, mysteryboxAddr, account, provider);
            if (!isApproved) {
                isApproved = await setNFTApproval(cardType, collection, mysteryboxAddr, provider);
                if (!isApproved) {
                    return false;
                }
            }
            if (cardType === 'single') {
                nftTypes.push(0);
            } else {
                nftTypes.push(1);
            }
        }
        const tx = await mysteryboxContract.addTokenBatch(nftTypes, collections, tokenIds, amounts);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true
        }
        return false;
    } catch (e) {
        // console.log(e);
        return false;
    }
}


/**
 * spin(account, mysteryboxAddr, tokenAddr, provider)
 * mysteryboxAddr : mysterybox address
 * tokenAddr : payment Token Address
 * price : price to spin
 */
export async function spin(account, mysteryboxAddr, tokenAddr, provider) {
    const mysteryboxContract = getMysteryBoxContract(mysteryboxAddr, provider);
    if (!mysteryboxContract) return false

    try {
        const price = await mysteryboxContract.price();

        if (tokenAddr === '0x0000000000000000000000000000000000000000') {

            const gasEstimated = await mysteryboxContract.estimateGas.spin({
                value: price,
            });
            const gasLimit = gasEstimated.toNumber() * 2;
            const tx = await mysteryboxContract.spin({
                value: price,
                gasLimit: gasLimit
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                const interf = new ethers.utils.Interface(MysteryBoxABI);
                const logs = receipt.logs;
                // console.log('logs:', logs);
                let key = '';
                for (let index = 0; index < logs.length; index++) {
                    const log = logs[index];
                    if (mysteryboxAddr?.toLowerCase() === log.address?.toLowerCase()) {
                        key = interf.parseLog(log).args[1];
                        // console.log('key:', key);
                        return key;
                    }
                }
            }
            return false;
        } else {
            const Token = getTokenContract(tokenAddr, provider);
            if (!Token) return false;
            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, 1, mysteryboxAddr, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, mysteryboxAddr, provider);
            }
            if (tokenApproveStatus) {
                const gasEstimated = await mysteryboxContract.estimateGas.spin();
                const gasLimit = gasEstimated.toNumber() * 2;
                const tx = await mysteryboxContract.spin({
                    gasLimit: gasLimit
                });
                const receipt = await tx.wait(2);
                if (receipt.confirmations) {
                    const interf = new ethers.utils.Interface(MysteryBoxABI);
                    const logs = receipt.logs;
                    // console.log('logs:', logs);
                    let key = '';
                    for (let index = 0; index < logs.length; index++) {
                        const log = logs[index];
                        if (mysteryboxAddr?.toLowerCase() === log.address?.toLowerCase()) {
                            key = interf.parseLog(log).args[1];
                            // console.log('key:', key);
                            return key;
                        }
                    }
                }
                return false;
            }
            return false;
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}





/**
 * NFT Staking Contract Management
 */

/**
 * createSingleNFTStaking
*/

export async function createSingleNFTStaking(
    account,
    startTime,
    subscriptionId,
    subscription_price,
    aprIndex,
    stakeNftAddress,
    rewardTokenAddress,
    stakeNftPrice,
    maxStakedNfts,
    depositTokenAmount,
    maxNftsPerUser,
    provider) {
    const factoryContract = getContractObj('SingleNFTStakingFactory', provider);
    const factoryContractInfo = getContractInfo('SingleNFTStakingFactory');

    if (!factoryContract || !factoryContractInfo) return false;
    try {
        var decimal = 18;
        if (rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(rewardTokenAddress, provider);
            if (!Token) return false;
            decimal = await Token.decimals();

            let tokenApproveStatus = await isTokenApproved(account, rewardTokenAddress, parseFloat(depositTokenAmount).toFixed(decimal), factoryContractInfo.address, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(rewardTokenAddress, factoryContractInfo.address, provider);
            }
            if (tokenApproveStatus) {
                const tx = await factoryContract.createSingleNFTStaking(
                    startTime,
                    subscriptionId,
                    aprIndex,
                    stakeNftAddress,
                    rewardTokenAddress,
                    toWei(stakeNftPrice, decimal),
                    maxStakedNfts,
                    maxNftsPerUser,
                    {
                        value: toWei(subscription_price, 18)
                    }
                );
                await tx.wait(2);
                return true;
            }
            return false;
        } else {
            const tx = await factoryContract.createSingleNFTStaking(
                startTime,
                subscriptionId,
                aprIndex,
                stakeNftAddress,
                rewardTokenAddress,
                toWei(stakeNftPrice, 18),
                maxStakedNfts,
                maxNftsPerUser,
                {
                    value: toWei(subscription_price + depositTokenAmount, 18)
                }
            );
            await tx.wait(2);
            return true;
        }

    } catch (e) {
        // console.log(e);
        return false;
    }
}

/**
 * createMultiNFTStaking
*/
export async function createMultiNFTStaking(
    account,
    startTime,
    subscriptionId,
    subscription_price,
    aprIndex,
    stakeNftAddress,
    rewardTokenAddress,
    stakeNftPrice,
    maxStakedNfts,
    depositTokenAmount,
    maxNftsPerUser,
    provider) {
    const factoryContract = getContractObj('MultiNFTStakingFactory', provider);
    const factoryContractInfo = getContractInfo('MultiNFTStakingFactory');

    if (!factoryContract || !factoryContractInfo) return false;
    try {
        var decimal = 18;
        if (rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(rewardTokenAddress, provider);
            if (!Token) return false;
            decimal = await Token.decimals();

            let tokenApproveStatus = await isTokenApproved(account, rewardTokenAddress, parseFloat(depositTokenAmount).toFixed(decimal), factoryContractInfo.address, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(rewardTokenAddress, factoryContractInfo.address, provider);
            }
            if (tokenApproveStatus) {
                const tx = await factoryContract.createMultiNFTStaking(
                    startTime,
                    subscriptionId,
                    aprIndex,
                    stakeNftAddress,
                    rewardTokenAddress,
                    toWei(stakeNftPrice, decimal),
                    maxStakedNfts,
                    maxNftsPerUser,
                    {
                        value: toWei(subscription_price, 18)
                    }
                );
                await tx.wait(2);
                return true;
            }
            return false;
        } else {
            const tx = await factoryContract.createMultiNFTStaking(
                startTime,
                subscriptionId,
                aprIndex,
                stakeNftAddress,
                rewardTokenAddress,
                toWei(stakeNftPrice, 18),
                maxStakedNfts,
                maxNftsPerUser,
                {
                    value: toWei(subscription_price + depositTokenAmount, 18)
                }
            );
            await tx.wait(2);
            return true;
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}

/**
 * getPendingRewards
*/
export async function getPendingRewards(type, staking_address, account, provider) {
    const contractObj = getStakingContract(type, staking_address, provider);
    if (!contractObj) return 0;
    try {
        const pendingRewards = await contractObj.pendingRewards(account);
        const stakingParams = await contractObj.stakingParams();
        // console.log('staking_address:', staking_address);
        // console.log('pendingRewards:', pendingRewards);
        var decimal = 18;
        if (stakingParams.rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            var tokenContract = getTokenContract(stakingParams.rewardTokenAddress, provider);
            if (tokenContract) {
                decimal = await tokenContract.decimals();
            }
        }
        return parseFloat(toEth(pendingRewards, decimal));
    } catch (error) {
        // console.log(error)
        return 0;
    }
}

/**
 * stake
*/
export async function stake(type, staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, provider) {
    if (type === 'single') {
        const result = await singleStake(staking_address, stakeNftAddress, tokenIdList, depositFeePerNft, account, provider);
        return result;
    } else if (type === 'multi') {
        const result = await multiStake(staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, provider);
        return result;
    } else {
        return false;
    }
}
// singleStake
export async function singleStake(staking_address, stakeNftAddress, tokenIdList, depositFeePerNft, account, provider) {
    const contractObj = getStakingContract('single', staking_address, provider);
    if (!contractObj) return false;
    try {

        let isApproved = await isNFTApproved('single', stakeNftAddress, staking_address, account, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('single', stakeNftAddress, staking_address, provider);
        }
        if (isApproved) {
            const countToStake = tokenIdList.length;
            const depositValue = depositFeePerNft * countToStake;
            const tx = await contractObj.stake(tokenIdList, {
                value: toWei(depositValue, 18)
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;
    } catch (e) {
        // console.log(e)
        return false;
    }
}

// multiStake
export async function multiStake(staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, provider) {
    const contractObj = getStakingContract('multi', staking_address, provider);
    if (!contractObj) return false;
    try {
        let isApproved = await isNFTApproved('multi', stakeNftAddress, staking_address, account, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('multi', stakeNftAddress, staking_address, provider);
        }
        if (isApproved) {
            var amountToStake = 0;
            for (let index = 0; index < amountList.length; index++) {
                amountToStake = amountToStake + amountList[index];
            }

            const depositValue = depositFeePerNft * amountToStake;
            const tx = await contractObj.stake(tokenIdList, amountList, {
                value: toWei(depositValue, 18)
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;

    } catch (e) {
        // console.log(e)
        return false;
    }
}


/**
 * withdraw
*/
export async function withdraw(type, staking_address, tokenIdList, amountList, withdrawFeePerNft, provider) {
    if (type === 'single') {
        const result = await singleWithdraw(staking_address, tokenIdList, withdrawFeePerNft, provider);
        return result;
    } else if (type === 'multi') {
        const result = await multiWithdraw(staking_address, tokenIdList, amountList, withdrawFeePerNft, provider);
        return result;
    } else {
        return false;
    }
}
// singleWithdraw
export async function singleWithdraw(staking_address, tokenIdList, withdrawFeePerNft, provider) {
    const contractObj = getStakingContract('single', staking_address, provider);
    if (!contractObj) return false;
    try {
        const countToWithdraw = tokenIdList.length;
        const withdrawValue = withdrawFeePerNft * countToWithdraw;
        const tx = await contractObj.withdraw(tokenIdList, {
            value: toWei(withdrawValue, 18)
        });
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e)
        return false;
    }
}

// multiWithdraw
export async function multiWithdraw(staking_address, tokenIdList, amountList, withdrawFeePerNft, provider) {
    const contractObj = getStakingContract('multi', staking_address, provider);
    if (!contractObj) return false;
    try {
        var amountToWithdraw = 0;
        for (let index = 0; index < amountList.length; index++) {
            amountToWithdraw = amountToWithdraw + amountList[index];
        }

        const withdrawValue = withdrawFeePerNft * amountToWithdraw;
        const tx = await contractObj.withdraw(tokenIdList, amountList, {
            value: toWei(withdrawValue, 18)
        });
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        // console.log(e)
        return false;
    }
}


export async function getStakingSubscriptions(type, provider) {
    var factoryContract = getContractObj('SingleNFTStakingFactory', provider);
    if (type === 'multi') {
        factoryContract = getContractObj('MultiNFTStakingFactory', provider);
    }
    if (!factoryContract) return [];

    try {
        var allSubscriptions = await factoryContract.allSubscriptions();
        if (allSubscriptions && allSubscriptions.length > 0) {
            let ret = [];
            for (let index = 0; index < allSubscriptions.length; index++) {
                const subscriptionInfo = allSubscriptions[index];
                var subscriptionItem = {
                    id: Number(subscriptionInfo[0]),
                    name: subscriptionInfo[1],
                    period: Number(subscriptionInfo[2]),
                    price: ethers.utils.formatEther(subscriptionInfo[3]),
                    bValid: subscriptionInfo[4]
                }
                ret.push(subscriptionItem)
            }
            return ret;
        }
        return [];
    } catch (error) {
        // console.log(error)
        return [];
    }
}

export async function getStakingAprs(type, provider) {

    var factoryContract = getContractObj('SingleNFTStakingFactory', provider);
    if (type === 'multi') {
        factoryContract = getContractObj('MultiNFTStakingFactory', provider);
    }
    if (!factoryContract) return [];

    try {
        var allAprs = await factoryContract.allAprs();
        if (allAprs && allAprs.length > 0) {
            let ret = [];
            for (let index = 0; index < allAprs.length; index++) {
                const aprInfo = allAprs[index];
                ret.push(Number(aprInfo))
            }
            return ret;
        }
        return [];
    } catch (error) {
        // console.log(error)
        return [];
    }
}


// nft minting enging

// get mint information
export async function getMintingInfo(provider) {
    const mintContract = getContractObj('DropERC1155', provider);
    const tokenId = CONTRACTS_BY_NETWORK.DropERC1155.tokenId;
    if (!mintContract) return null;
    try {
        var totalSupply = await mintContract.totalSupply(tokenId);
        var curMode = await mintContract.getCurrentMode();
        var modeInfo = await mintContract.getModelInfo(curMode)
        return {
            totalSupply: Number(totalSupply),
            quantity: Number(modeInfo.quantity),
            mintPrice: toEth(modeInfo.mintPrice, 18),
        };
    } catch (e) { return null; }
}

export async function claimNFT(account, mintInfo, amount, provider) {
    const mintContract = getContractObj('DropERC1155', provider);
    const tokenId = CONTRACTS_BY_NETWORK.DropERC1155.tokenId;
    const curreny = mintInfo.activeCondition.currency;
    const quantityLimitPerWallet = mintInfo.activeCondition.quantityLimitPerWallet;
    const pricePerToken = Number(toEth(mintInfo.activeCondition.pricePerToken, 18));
    const allowlistProof = {
        proof: [],
        quantityLimitPerWallet: quantityLimitPerWallet,
        pricePerToken: toWei(pricePerToken, 18),
        currency: curreny,
    };
    if (!mintContract) return null;

    try {

        const tx = await mintContract.claim(
            account,
            tokenId,
            amount,
            curreny,
            toWei(pricePerToken, 18),
            allowlistProof,
            '0x',
            {
                value: toWei(pricePerToken * amount, 18)
            })
        await tx.wait(2);
        return true;

    } catch (error) {
        // console.log(error)
        return false;
    }
}

export async function onAddItem(mintInfo, amount, provider) {
    const mintContract = getContractObj('DropERC1155', provider);
    if (!mintContract) return null;

    try {
        const tx = await mintContract.addItem(
            amount,
            {
                value: toWei(mintInfo.mintPrice * amount, 18)
            })
        await tx.wait(2);
        return true;

    } catch (error) {
        console.log(error)
        return false;
    }
}

export async function getSubscriptionFee(provider) {
    var subscriptionContract = getContractObj('Subscription', provider);
    // console.log(subscriptionContract)
    if (!subscriptionContract) return 0;
    try {
        const coinFee = await subscriptionContract.coinFee()
        // console.log(coinFee)
        return toEth(coinFee);
    } catch (error) {
        // console.log(error)
        return [];
    }
}

export async function onCollectionSubscriptions(colAddr, period, provider) {
    var subscriptionContract = getContractObj('Subscription', provider);
    if (!subscriptionContract) return false;

    try {
        const coinFee = await subscriptionContract.coinFee()
        var tx = await subscriptionContract.paySubscription(colAddr, period, {
            value: String(period * coinFee)
        });
        const receipt = await tx.wait(1);
        if (receipt.confirmations) return true;
        return false;
    } catch (error) {
        // console.log(error)
        return false;
    }
}

export async function approveNFTOnClaim(type, collection, account, provider) {
    try {
        let isApproved = await isNFTApproved(type, collection, CONTRACTS_BY_NETWORK.Claim.address, account, provider);
        if (isApproved) {
            return true;
        } else {
            isApproved = await setNFTApproval(type, collection, CONTRACTS_BY_NETWORK.Claim.address, provider);
            if (isApproved) {
                return true;
            } else {
                return false;
            }
        }
    } catch (e) {
        // console.log(e);
        return false;
    }
}