export const delegateTest = async () => {
  try {
    await window.keplr.enable(process.env.VUE_APP_CHAIN_ID_COSMOS);

    const myAccount = getAccounts();
    console.log("myAccount : ", myAccount);

    const msg = {
      type: "cosmos-sdk/MsgDelegate",
      value: {
        delegator_address: "reap1rmvw8z9kzgn92gct427gxzyr44czk6cxf7k8xq",
        validator_address: "reapvaloper1vk79ktww6gct2tarv9xjv87hxsxazksqc00496",
        amount: {
          denom: "areap",
          amount: "10000000000000000000",
        },
      },
    };

    const msgSet = {
      aminoMsgs: [msg],
      protoMsgs: [
        {
          typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
          value: cosmos.staking.v1beta1.MsgDelegate.encode({
            delegatorAddress: msg.value.delegator_address,
            validatorAddress: msg.value.validator_address,
            amount: msg.value.amount,
          }).finish(),
        },
      ],
    };

    return;

    // const msgSet = {
    //   aminoMsgs: [msg],
    //   protoMsgs: [
    //     {
    //       typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    //       value: cosmos.staking.v1beta1.MsgDelegate.encode({
    //         delegatorAddress: msg.value.delegator_address,
    //         validatorAddress: msg.value.validator_address,
    //         amount: msg.value.amount,
    //       }).finish(),
    //     },
    //   ],
    // };

    // const signDoc = makeSignDoc(
    //   msgSet.aminoMsgs,
    //   txFee,
    //   chainId,
    //   "memo",
    //   myAccount.account.base_account.account_number,
    //   myAccount.account.base_account.sequence
    // );

    // const signResponse = await window.keplr?.signAmino(
    //   chainId,
    //   address,
    //   signDoc
    // );
    // console.log("signResponse : ", signResponse);

    // // type_url: "ethermint.crypto.v1.ethsecp256k1.PubKey",
    // const signedTx = TxRaw.encode({
    //   bodyBytes: cosmos.tx.v1beta1.TxBody.encode({
    //     messages: msgSet.protoMsgs,
    //     memo: signResponse?.signed.memo,
    //   }).finish(),

    //   authInfoBytes: cosmos.tx.v1beta1.AuthInfo.encode({
    //     signerInfos: [
    //       {
    //         publicKey: {
    //           type_url: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
    //           value: cosmos.crypto.secp256k1.PubKey.encode({
    //             key: Buffer.from(
    //               signResponse!.signature.pub_key.value,
    //               "base64"
    //             ),
    //           }).finish(),
    //         },
    //         modeInfo: {
    //           single: {
    //             mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
    //           },
    //         },
    //         sequence: Long.fromString(signResponse!.signed.sequence),
    //       },
    //     ],
    //     fee: {
    //       amount: signResponse!.signed.fee.amount as ICoin[],
    //       gasLimit: Long.fromString(signResponse!.signed.fee.gas),
    //     },
    //   }).finish(),
    //   signatures: [Buffer.from(signResponse!.signature.signature, "base64")],
    // }).finish();

    // console.log("signedTx : ", signedTx);

    // const sendTxRes = await window.keplr?.sendTx(
    //   chainId,
    //   signedTx,
    //   "block" as BroadcastMode
    // );
    // console.log("sendTxRes : ", sendTxRes);
  } catch (error) {
    console.error(error);
  }
};

export const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

export const getAccounts = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    return [];
  }

  const chainId = process.env.VUE_APP_CHAIN_ID_COSMOS || "";
  await window.keplr.enable(chainId);
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();

  console.log("accounts : ", accounts);

  return {
    address: accounts[0].address,
    algo: accounts[0].algo,
    pubkey: {
      "@type": "/ethermint.crypto.v1.ethsecp256k1.PubKey",
      key: Buffer.from(accounts[0].pubkey).toString("base64") || "",
    },
  };
};

export const getOfflineSigner = () => {
  if (!window.getOfflineSigner || !window.keplr) {
    return null;
  }
  const chainId = process.env.VUE_APP_CHAIN_ID_COSMOS || "";
  const offlineSigner = window.getOfflineSigner(chainId);
  return offlineSigner;
};

export const initKeplr = async () => {
  window.onload = async () => {
    if (!window.getOfflineSigner || !window.keplr) {
      alert("Please install keplr extension");
      return null;
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain(chainConfig_local);
        } catch (error) {
          console.log(error);
          alert("Failed to suggest the chain");
          return null;
        }
      } else {
        alert("Please use the recent version of keplr extension");
      }
    }
  };
};

const chainConfig_local = {
  rpc: process.env.VUE_APP_API_RPC_ENDPOINT,
  rpcConfig: undefined,
  rest: process.env.VUE_APP_API_BASEURL,
  restConfig: undefined,
  chainId: process.env.VUE_APP_CHAIN_ID_COSMOS,
  chainName: process.env.VUE_APP_CHAIN_NAME,
  stakeCurrency: {
    coinDenom: "reap",
    coinMinimalDenom: "areap",
    coinDecimals: 18,
    coinGeckoId: "reap",
  },
  walletUrl: "http://explorer.reapchain.com/reapchain",
  walletUrlForStaking: "http://explorer.reapchain.com/reapchain",
  bip44: {
    coinType: 60,
  },
  bech32Config: {
    bech32PrefixAccAddr: "reap",
    bech32PrefixAccPub: "reappub",
    bech32PrefixValAddr: "reapvaloper",
    bech32PrefixValPub: "reapvaloperpub",
    bech32PrefixConsAddr: "reapvalcons",
    bech32PrefixConsPub: "reapvalconspub",
  },
  currencies: [
    {
      coinDenom: "REAP",
      coinMinimalDenom: "areap",
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "REAP",
      coinMinimalDenom: "areap",
      coinDecimals: 18,
    },
  ],
  gasPriceStep: {
    low: 10000000000,
    average: 25000000000,
    high: 40000000000,
  },
  features: ["ibc-transfer", "stargate", "no-legacy-stdTx", "ibc-go"],
  beta: true,
};
