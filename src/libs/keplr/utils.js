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
import {
  ParameterChangeProposal,
  CommunityPoolSpendProposal,
  SoftwareUpgradeProposal as SoftwareUpgradeProposal2,
  Plan as Plan2,
} from "@terra-money/feather.js";
import { ParameterChangeProposal as ParameterChangeProposal_pb } from "@terra-money/terra.proto/cosmos/params/v1beta1/params";
import { CommunityPoolSpendProposal as CommunityPoolSpendProposal_pb } from "@terra-money/terra.proto/cosmos/distribution/v1beta1/distribution";
import { SoftwareUpgradeProposal as SoftwareUpgradeProposal_pb } from "@terra-money/terra.proto/cosmos/upgrade/v1beta1/upgrade";
import {
  Plan,
  SoftwareUpgradeProposal,
  CancelSoftwareUpgradeProposal,
} from "@keplr-wallet/proto-types/cosmos/upgrade/v1beta1/upgrade";
import {
  MsgRegisterStandingMemberProposal as RegisterStandingMemberProposal_pb,
  MsgRemoveStandingMemberProposal as RemoveStandingMemberProposal_pb,
  MsgReplaceStandingMemberProposal as ReplaceStandingMemberProposal_pb,
} from "@/libs/proto/permissions/tx";
import * as Long from "long";
import { convertValidatorAddress, sendTx, simulate } from "@/libs/utils";
import { Bech32, toHex } from "@cosmjs/encoding";
const { sha256, sha512 } = require("@cosmjs/crypto");
import { MsgSendToEth as MsgSendtoEthTest } from "@chain-clients/gravitybridge/main/codegen/gravity/v1/msgs";

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

    const txMessageSet = createKeplrTxMessageSet(type, txData);

    if (txMessageSet.error) {
      return {
        result: false,
        txhash: "",
        msg: txMessageSet.msg,
      };
    }

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

    // for keplr
    // const sendTxRes = await window.keplr?.sendTx(
    //   chainInfo.cosmosChainId,
    //   signedTx,
    //   "sync"
    // );
    // const txHash = sendTxRes.tx_response.txhash || "no txhash..."; // <-error

    // for MQ
    const txBytes = Buffer.from(signedTx).toString("base64");

    const txResponse = await sendTx({
      tx_bytes: txBytes,
      mode: "BROADCAST_MODE_SYNC",
    });
    const txHash = txResponse.tx_response.txhash || "no txhash...";

    return {
      result: true,
      txhash: txHash,
    };
  } catch (e) {
    console.log(e);
    return {
      result: false,
      txhash: "no txhash...",
      msg: e,
    };
  }
};

export const createKeplrTxMessageSet = (type, txData) => {
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
        if (txData.msg.length > 1) {
          const aminoMsgs = [];
          const protoMsgs = [];
          for (const tempMsg of txData.msg) {
            const aminoMsg = {
              type: "cosmos-sdk/MsgWithdrawDelegationReward",
              value: {
                delegator_address: tempMsg.value.delegatorAddress,
                validator_address: tempMsg.value.validatorAddress,
              },
            };
            const protoMsg = {
              typeUrl:
                "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
              value: MsgWithdrawDelegatorReward.encode({
                delegatorAddress: tempMsg.value.delegatorAddress,
                validatorAddress: tempMsg.value.validatorAddress,
              }).finish(),
            };

            aminoMsgs.push(aminoMsg);
            protoMsgs.push(protoMsg);
          }
          return {
            aminoMsgs: aminoMsgs,
            protoMsgs: protoMsgs,
          };
        }

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
            msgValue.changes
          );

          // {
          //   subspace: "inflation",
          //   key: "ParamStoreKeyEnableInflation",
          //   value: "false",
          // },

          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "cosmos-sdk/ParameterChangeProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      changes: msgValue.changes,
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
                    typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
                    value: ParameterChangeProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      changes: msgValue.changes,
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "Community") {
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "cosmos-sdk/CommunityPoolSpendProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      recipient: msgValue.recipient,
                      amount: msgValue.amount,
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
                    typeUrl:
                      "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
                    value: CommunityPoolSpendProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      recipient: msgValue.recipient,
                      amount: msgValue.amount,
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "Upgrade") {
          const testObj = new SoftwareUpgradeProposal2(
            msgValue.title,
            msgValue.description,
            new Plan2("name", new Date(), "1000000", "info")
          );
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  // content: testObj.toAmino(),
                  content: {
                    type: "cosmos-sdk/SoftwareUpgradeProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      plan: {
                        name: "test_upgrade",
                        // time: new Date(),
                        height: new Long(1000000),
                        info: "info",
                        // upgradedClientState: {},
                      },
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
                    value: SoftwareUpgradeProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      plan: {
                        name: "name",
                        time: new Date(),
                        height: "1000000",
                        info: "info",
                      },
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "RegisterStanding") {
          const validatorAddress = convertValidatorAddress(
            msgValue.registerAddress
          );
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "permissions/MsgRegisterStandingMemberProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      validatorAddress: validatorAddress,
                      accountAddress: msgValue.registerAddress,
                      moniker: msgValue.registerMoniker,
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
                    typeUrl:
                      "/reapchain.permissions.v1.MsgRegisterStandingMemberProposal",
                    value: RegisterStandingMemberProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      validatorAddress: validatorAddress,
                      accountAddress: msgValue.registerAddress,
                      moniker: msgValue.registerMoniker,
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "RemoveStanding") {
          const removeValidatorAddress = convertValidatorAddress(
            msgValue.removeAddress
          );
          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "permissions/MsgRemoveStandingMemberProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      validatorAddress: removeValidatorAddress,
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
                    typeUrl:
                      "/reapchain.permissions.v1.MsgRemoveStandingMemberProposal",
                    value: RemoveStandingMemberProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      validatorAddress: removeValidatorAddress,
                    }).finish(),
                  },
                  initialDeposit: msgValue.initialDeposit,
                  proposer: msgValue.proposer,
                }).finish(),
              },
            ],
          };
        } else if (msgValue.type === "ReplaceStanding") {
          const existValidatorAddress = convertValidatorAddress(
            msgValue.existAddress
          );
          const replaceValidatorAddress = convertValidatorAddress(
            msgValue.replaceAddress
          );

          return {
            aminoMsgs: [
              {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                  content: {
                    type: "permissions/MsgReplaceStandingMemberProposal",
                    value: {
                      title: msgValue.title,
                      description: msgValue.description,
                      existingValidatorAddress: existValidatorAddress,
                      replacementValidatorAddress: replaceValidatorAddress,
                      replacementAccountAddress: msgValue.replaceAddress,
                      replacementMoniker: msgValue.replaceMoniker,
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
                    typeUrl:
                      "/reapchain.permissions.v1.MsgReplaceStandingMemberProposal",
                    value: ReplaceStandingMemberProposal_pb.encode({
                      title: msgValue.title,
                      description: msgValue.description,
                      existingValidatorAddress: existValidatorAddress,
                      replacementValidatorAddress: replaceValidatorAddress,
                      replacementAccountAddress: msgValue.replaceAddress,
                      replacementMoniker: msgValue.replaceMoniker,
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
    console.error(e);
    return {
      error: true,
      msg: e,
    };
  }
};
