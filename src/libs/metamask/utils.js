import axios from "../common/axios";
import {
  generateEndpointAccount,
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
} from "@tharsis/provider";
import {
  createMessageSend,
  createTxRawEIP712,
  signatureToWeb3Extension,
  createTxMsgDelegate,
  createTxMsgWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgUndelegate,
  // createTxMsgWithdraw
} from "@tharsis/transactions";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethToReap } from "./addressConverter";
import { Secp256k1 } from "@cosmjs/crypto";
import { utils } from "ethers";
import { chainInfo } from "@/chains/config/reapchain.config";

const chainAddParams = {
  chainId: chainInfo.chainIdHex,
  chainName: chainInfo.chainName,
  nativeCurrency: {
    name: "Reapchain",
    symbol: "REAP",
    decimals: 18,
  },
  rpcUrls: [chainInfo.evmEndpoint],
  blockExplorerUrls: [chainInfo.ethAccountExplorerUrl],
  iconUrls: ["https://dashboard.reapchain.com/reapchain_logo.png"],
};

const chain = {
  chainId: chainInfo.chainIdHex,
  cosmosChainId: chainInfo.cosmosChainId,
};

const pubkeyType = "/ethermint.crypto.v1.ethsecp256k1.PubKey";

export const metamaskSendTx = async (type, txData) => {
  try {
    const enable = await window.ethereum.enable();
    if (!enable) {
      return;
    }
    const addressETH = enable[0];
    const addressReap = ethToReap(addressETH);
    let { data: myAccount } = await axios.get(
      generateEndpointAccount(addressReap)
    );

    if (!myAccount.account.base_account.pub_key) {
      let pubkey = getLocalPubkey(addressETH);
      if (!pubkey) {
        pubkey = await setLocalPubkey(ethAddress);
        if (!pubkey) {
          throw new Error("personal sign is required.");
        }
      }
      myAccount.account.base_account.pub_key = {
        "@type": pubkeyType,
        key: pubkey,
      };
    } else {
      myAccount.account.base_account.pub_key = {
        "@type": pubkeyType,
        key: myAccount.account.base_account.pub_key.key,
      };
    }

    const sender = {
      accountAddress: myAccount.account.base_account.address,
      sequence: myAccount.account.base_account.sequence,
      accountNumber: myAccount.account.base_account.account_number,
      pubkey: myAccount.account.base_account.pub_key.key || "",
    };
    const msg = createMetamaskTxMessage(type, txData, sender);

    let signature = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params: [addressETH, JSON.stringify(msg.eipToSign)],
    });
    let extension = signatureToWeb3Extension(chain, sender, signature);
    let rawTx = createTxRawEIP712(
      msg.legacyAmino.body,
      msg.legacyAmino.authInfo,
      extension
    );
    const res = await axios.post(
      generateEndpointBroadcast(),
      JSON.parse(generatePostBodyBroadcast(rawTx))
    );
    if (res.data) {
      if (res.data.tx_response.raw_log === "signature verification failed") {
        return {
          result: false,
          msg: "signature verification failed",
        };
      }
    }
    return {
      result: true,
      txhash: res.data.tx_response.txhash || "",
    };
  } catch (error) {
    console.log(error);
    let msg = error.message;
    if (error.message.indexOf("Provided chainId") > -1) {
      msg = "select the correct network in metamask";
    }

    return {
      result: false,
      msg,
    };
  }
};

export const createMetamaskTxMessage = (type, txData, sender) => {
  try {
    switch (type) {
      case "Transfer":
        return createMessageSend(chain, sender, txData.fee, txData.memo, {
          destinationAddress: txData.msg[0].value.toAddress,
          amount: txData.msg[0].value.amount[0].amount,
          denom: txData.msg[0].value.amount[0].denom,
        });
      case "Delegate":
        return createTxMsgDelegate(chain, sender, txData.fee, txData.memo, {
          validatorAddress: txData.msg[0].value.validatorAddress,
          amount: txData.msg[0].value.amount.amount.toString(),
          denom: txData.msg[0].value.amount.denom,
        });
      case "Withdraw":
        if (txData.msg.length > 1) {
          return createTxMsgMultipleWithdrawDelegatorReward(
            chain,
            sender,
            txData.fee,
            txData.memo,
            {
              validatorAddresses: txData.msg.map(
                (ele) => ele.value.validatorAddress
              ),
            }
          );
        }
        return createTxMsgWithdrawDelegatorReward(
          chain,
          sender,
          txData.fee,
          txData.memo,
          {
            validatorAddress: txData.msg[0].value.validatorAddress,
          }
        );
      case "Redelegate":
        return createTxMsgBeginRedelegate(
          chain,
          sender,
          txData.fee,
          txData.memo,
          {
            validatorSrcAddress: txData.msg[0].value.validatorSrcAddress,
            validatorDstAddress: txData.msg[0].value.validatorDstAddress,
            amount: txData.msg[0].value.amount.amount.toString(),
            denom: txData.msg[0].value.amount.denom,
          }
        );
      case "Unbond":
        return createTxMsgUndelegate(chain, sender, txData.fee, txData.memo, {
          validatorAddress: txData.msg[0].value.validatorAddress,
          amount: txData.msg[0].value.amount.amount.toString(),
          denom: txData.msg[0].value.amount.denom,
        });
      default:
        return null;
    }
  } catch (e) {
    console.log(e);
  }
};

const getLocalPubkey = (ethAddress) => {
  const locals = localStorage.getItem(`ethPubkey`);
  if (!locals) {
    return;
  }

  const val = JSON.parse(locals)[ethAddress];
  if (!val) {
    return;
  }

  return val;
};

const setLocalPubkey = async (ethAddress) => {
  let data = JSON.parse(localStorage.getItem(`ethPubkey`)) || {};

  if (data.ethAddress) {
    return;
  }

  const signMsg = "generate_pubkey";
  const signMsgHex = "0x" + Buffer.from(signMsg).toString("hex");

  try {
    const sign = await ethereum.request({
      method: "personal_sign",
      params: [signMsgHex, ethAddress],
    });

    const msgHash = utils.hashMessage(signMsg);
    const msgHashBytes = utils.arrayify(msgHash);
    const recoveredPubKey = utils.recoverPublicKey(msgHashBytes, sign);
    const pubKey = Secp256k1.compressPubkey(
      Buffer.from(recoveredPubKey.substring(2), "hex")
    );
    const pubKeyBase64 = Buffer.from(pubKey).toString("base64");

    data[ethAddress] = pubKeyBase64;
    localStorage.setItem("ethPubkey", JSON.stringify(data));
    return pubKeyBase64;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const metamaskGetAccount = async () => {
  const enable = await window.ethereum.enable();
  if (!enable || enable.length < 1) {
    console.log("metamask is not enable");
    return null;
  }
  let { data: myAccount } = await axios.get(
    generateEndpointAccount(ethToReap(enable[0]))
  );
  if (!myAccount) {
    return null;
  }

  const ethAddress = enable[0];
  let pubkey = getLocalPubkey(ethAddress);
  if (!pubkey) {
    pubkey = await setLocalPubkey(ethAddress);
    if (!pubkey) {
      return null;
    }
  }

  return {
    address: myAccount.account.base_account.address,
    algo: "ethsecp256k1",
    pubkey: {
      type: pubkeyType,
      key: pubkey,
    },
  };
};

export const connectMetamaskWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  const provider = await detectEthereumProvider();
  if (!provider) {
    return;
  } else {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
      return;
    }
  }
  const enable = await window.ethereum.enable();
  if (!enable || enable.length < 1) {
    console.log("metamask is not enable");
    return null;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainAddParams.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chainAddParams],
        });
      } catch (addError) {
        console.error(addError);
        return;
      }
    }
    return;
  }

  const accountList = await ethereum.request({ method: "eth_requestAccounts" });

  if (!accountList || accountList.length < 1) {
    return null;
  }

  const ethAddress = await enable[0];
  const pubkey = getLocalPubkey(ethAddress);

  if (!pubkey) {
    await setLocalPubkey(ethAddress);
  }

  return accountList;
};
