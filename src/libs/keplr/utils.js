import axios from "../common/axios";
import { getAccounts } from "@/libs/keplr/keplr";
import { generateEndpointAccount } from "@tharsis/provider";

import { makeSignDoc } from "@cosmjs/launchpad";
import {
  AuthInfo,
  TxRaw,
  TxBody,
  Fee,
} from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import { MsgDelegate } from "@keplr-wallet/proto-types/cosmos/staking/v1beta1/tx";
import { PubKey } from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";
import { SignMode } from "@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing";

const chain = {
  chainId: process.env.VUE_APP_CHAIN_ID,
  cosmosChainId: process.env.VUE_APP_CHAIN_ID_COSMOS,
};

export const keplrSendTx = async (type, txData) => {
  try {
    const keplrAccount = await getAccounts();
    if (!keplrAccount) {
      console.log("error : keplr account info...");
      return false;
    }

    let { data: apiAccount } = await axios.get(
      generateEndpointAccount(keplrAccount.address)
    );

    if (!apiAccount) {
      console.log("error : account Info...");
    }

    const sender = {
      accountAddress: keplrAccount.address,
      sequence: apiAccount.account.base_account.sequence,
      accountNumber: apiAccount.account.base_account.account_number,
      pubkey: keplrAccount.pubkey.key || "",
    };

    const txMessageSet = createKeplrTxMessageSet(type, txData, sender);
    console.log("txMessageSet : ", txMessageSet);

    const fee = {
      amount: {
        amount: txData.fee.amount,
        denom: txData.fee.denom,
      },
      gas: txData.fee.gas,
    };

    const signDoc = makeSignDoc(
      txMessageSet.aminoMsgs,
      fee,
      chain.cosmosChainId,
      txData.memo,
      apiAccount.account.base_account.account_number,
      apiAccount.account.base_account.sequence
    );

    const signResponse = await window.keplr.signAmino(
      chain.cosmosChainId,
      keplrAccount.address,
      signDoc
    );

    const signedTx = TxRaw.encode({
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: txMessageSet.protoMsgs,
          memo: signResponse.signed.memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
              value: PubKey.encode({
                key: Buffer.from(
                  signResponse.signature.pub_key.value,
                  "base64"
                ),
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
              },
              multi: undefined,
            },
            sequence: signResponse.signed.sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: signResponse.signed.fee.amount,
          gasLimit: signResponse.signed.fee.gas,
        }),
      }).finish(),
      signatures: [Buffer.from(signResponse.signature.signature, "base64")],
    }).finish();

    const sendTxRes = await window.keplr?.sendTx(
      chain.cosmosChainId,
      signedTx,
      "async"
    );

    return {
      result: true,
      txhash: Buffer.from(sendTxRes).toString("hex") || "",
    };
  } catch (error) {
    console.error(error);
    return {
      result: false,
      txhash: "",
    };
  }
};

export const createKeplrTxMessageSet = (type, txData) => {
  console.log(type, txData);
  try {
    switch (type) {
      case "Delegate":
        const msgValue = txData.msg[0].value;
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgDelegate",
              value: {
                delegator_address: msgValue.delegatorAddress,
                validator_address: msgValue.validatorAddress,
                amount: msgValue.amount,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
              value: MsgDelegate.encode({
                delegatorAddress: msgValue.delegatorAddress,
                validatorAddress: msgValue.validatorAddress,
                amount: msgValue.amount,
              }).finish(),
            },
          ],
        };
      default:
        return {};
    }
  } catch (e) {
    console.log(e);
  }
};
