/* eslint-disable */
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
import {
  MsgDelegate,
  MsgBeginRedelegate,
  MsgUndelegate,
} from "@keplr-wallet/proto-types/cosmos/staking/v1beta1/tx";
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from "@keplr-wallet/proto-types/cosmos/distribution/v1beta1/tx";
import { MsgSend } from "@keplr-wallet/proto-types/cosmos/bank/v1beta1/tx";
import {
  MsgSubmitProposal,
  MsgDeposit,
  MsgVote,
} from "@keplr-wallet/proto-types/cosmos/gov/v1beta1/tx";
import { TextProposal } from "@keplr-wallet/proto-types/cosmos/gov/v1beta1/gov";
import { PubKey } from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";
import { SignMode } from "@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing";
import { chainInfo } from "@/chains/config/reapchain.config";
import { ParameterChangeProposal } from "@terra-money/feather.js";
import { ParameterChangeProposal as ParameterChangeProposal_pb } from "@terra-money/terra.proto/cosmos/params/v1beta1/params";
import {
  SoftwareUpgradeProposal,
  CancelSoftwareUpgradeProposal,
} from "@keplr-wallet/proto-types/cosmos/upgrade/v1beta1/upgrade";

export const keplrSendTx = async (type, txData) => {
  try {
    const keplrAccount = await getAccounts();
    if (!keplrAccount) {
      return false;
    }

    let { data: apiAccount } = await axios.get(
      generateEndpointAccount(keplrAccount.address)
    );

    if (!apiAccount) {
      console.log("error : account Info...");
    }

    let baseAccountEntry;
    if (apiAccount.account.base_vesting_account) {
      baseAccountEntry = apiAccount.account.base_vesting_account.base_account;
    } else if (apiAccount.account.base_account) {
      baseAccountEntry = apiAccount.account.base_account;
    }
    const sender = {
      accountAddress: keplrAccount.address,
      pubkey: keplrAccount.pubkey.key || "",
      sequence: baseAccountEntry.sequence,
      accountNumber: baseAccountEntry.account_number,
    };
    const txMessageSet = createKeplrTxMessageSet(type, txData, sender);

    const fee = {
      amount: [
        {
          amount: txData.fee.amount,
          denom: txData.fee.denom,
        },
      ],
      gas: txData.fee.gas,
    };
    const signDoc = makeSignDoc(
      txMessageSet.aminoMsgs,
      fee,
      chainInfo.cosmosChainId,
      txData.memo,
      baseAccountEntry.account_number,
      baseAccountEntry.sequence
    );

    const signResponse = await window.keplr.signAmino(
      chainInfo.cosmosChainId,
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
      chainInfo.cosmosChainId,
      signedTx,
      "async"
    );

    return {
      result: true,
      txhash: Buffer.from(sendTxRes).toString("hex") || "",
    };
  } catch (error) {
    return {
      result: false,
      txhash: "",
      msg: error,
    };
  }
};

export const createKeplrTxMessageSet = (type, txData, sender) => {
  try {
    let msgValue = txData.msg[0].value;
    switch (type) {
      case "Transfer":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgSend",
              value: {
                from_address: msgValue.fromAddress,
                to_address: msgValue.toAddress,
                amount: msgValue.amount,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.bank.v1beta1.MsgSend",
              value: MsgSend.encode({
                fromAddress: msgValue.fromAddress,
                toAddress: msgValue.toAddress,
                amount: msgValue.amount,
              }).finish(),
            },
          ],
        };
      case "Delegate":
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
      case "Withdraw":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgWithdrawDelegationReward",
              value: {
                delegator_address: msgValue.delegatorAddress,
                validator_address: msgValue.validatorAddress,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl:
                "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
              value: MsgWithdrawDelegatorReward.encode({
                delegatorAddress: msgValue.delegatorAddress,
                validatorAddress: msgValue.validatorAddress,
              }).finish(),
            },
          ],
        };
      case "WithdrawCommission":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgWithdrawValidatorCommission",
              value: {
                validator_address: msgValue.validatorAddress,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl:
                "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission",
              value: MsgWithdrawValidatorCommission.encode({
                validatorAddress: msgValue.validatorAddress,
              }).finish(),
            },
          ],
        };
      case "Redelegate":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgBeginRedelegate",
              value: {
                delegator_address: msgValue.delegatorAddress,
                validator_src_address: msgValue.validatorSrcAddress,
                validator_dst_address: msgValue.validatorDstAddress,
                amount: msgValue.amount,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
              value: MsgBeginRedelegate.encode({
                delegatorAddress: msgValue.delegatorAddress,
                validatorSrcAddress: msgValue.validatorSrcAddress,
                validatorDstAddress: msgValue.validatorDstAddress,
                amount: msgValue.amount,
              }).finish(),
            },
          ],
        };
      case "Unbond":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgUndelegate",
              value: {
                delegator_address: msgValue.delegatorAddress,
                validator_address: msgValue.validatorAddress,
                amount: msgValue.amount,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
              value: MsgUndelegate.encode({
                delegatorAddress: msgValue.delegatorAddress,
                validatorAddress: msgValue.validatorAddress,
                amount: msgValue.amount,
              }).finish(),
            },
          ],
        };
      case "Vote":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgVote",
              value: {
                option: msgValue.option,
                proposal_id: msgValue.proposalId.toString(),
                voter: msgValue.voter,
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.gov.v1beta1.MsgVote",
              value: MsgVote.encode({
                option: msgValue.option,
                proposalId: msgValue.proposalId.toString(),
                voter: msgValue.voter,
              }).finish(),
            },
          ],
        };
      case "GovDeposit":
        return {
          aminoMsgs: [
            {
              type: "cosmos-sdk/MsgDeposit",
              value: {
                amount: msgValue.amount,
                depositor: msgValue.depositor,
                proposal_id: msgValue.proposalId.toString(),
              },
            },
          ],
          protoMsgs: [
            {
              typeUrl: "/cosmos.gov.v1beta1.MsgDeposit",
              value: MsgDeposit.encode({
                amount: msgValue.amount,
                depositor: msgValue.depositor,
                proposalId: msgValue.proposalId.toString(),
              }).finish(),
            },
          ],
        };
      case "GovProposal":
        if (msgValue.type === "Text") {
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "cosmos-sdk/TextProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                    },
                  },
                  initial_deposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                },
              },
            ],
            protoMsgs: [
              {
                typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
                value: MsgSubmitProposal.encode({
                  content: {
                    typeUrl: "/cosmos.gov.v1beta1.TextProposal",
                    value: TextProposal.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "Parameter") {
          const proposalSubObj = new ParameterChangeProposal(
            msgValue.title,
            msgValue.description,
            [
              {
                subspace: "inflation",
                key: "ParamStoreKeyEnableInflation",
                value: "false",
              },
            ]
          );

          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: proposalSubObj.toAmino(),
                  initial_deposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                },
              },
            ],
            protoMsgs: [
              {
                typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
                value: MsgSubmitProposal.encode({
                  content: {
                    typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
                    value: ParameterChangeProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      changes: [
                        {
                          subspace: "inflation",
                          key: "ParamStoreKeyEnableInflation",
                          value: "false",
                        },
                      ],
                    }).finish(),
                  },
                  // content: proposalSubObj.toProto()proposalSubObj.toData(),
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "Upgrade") {
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "cosmos-sdk/SoftwareUpgradeProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      // plan: {
                      //   name: "name",
                      //   height: 1000000,
                      //   info: "info",
                      // },
                    },
                  },
                  initial_deposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                },
              },
            ],
            protoMsgs: [
              {
                typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
                value: MsgSubmitProposal.encode({
                  content: {
                    typeUrl: "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
                    value: SoftwareUpgradeProposal.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      // plan: {
                      //   name: "name",
                      //   height: 1000000,
                      //   info: "info",
                      // },
                      // plan: {
                      //   value: Plan.encode({
                      //     name: "name",
                      //     height: "10",
                      //     info: "info",
                      //   }).finish(),
                      // },
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else {
          return {};
        }

      default:
        return {};
    }
  } catch (e) {
    console.log(e);
  }
};
