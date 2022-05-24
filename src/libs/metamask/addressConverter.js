import {
  isValidChecksumAddress,
  stripHexPrefix,
  toChecksumAddress,
} from "crypto-addr-codec";

import { decode, encode, fromWords, toWords } from "bech32";

export const makeChecksummedHexEncoder = (chainId) => {
  return (data) => toChecksumAddress(data.toString("hex"), chainId || null);
};

export const makeChecksummedHexDecoder = (chainId) => {
  return (data) => {
    const stripped = stripHexPrefix(data);
    if (
      !isValidChecksumAddress(data, chainId || null) &&
      stripped !== stripped.toLowerCase() &&
      stripped !== stripped.toUpperCase()
    ) {
      throw Error("Invalid address checksum");
    }
    return Buffer.from(stripHexPrefix(data), "hex");
  };
};

const hexChecksumChain = (name, chainId) => ({
  decoder: makeChecksummedHexDecoder(chainId),
  encoder: makeChecksummedHexEncoder(chainId),
  name,
});

export const ETH = hexChecksumChain("ETH");

function makeBech32Encoder(prefix) {
  return (data) => encode(prefix, toWords(data));
}

function makeBech32Decoder(currentPrefix) {
  return (data) => {
    const { prefix, words } = decode(data);
    if (prefix !== currentPrefix) {
      throw Error("Unrecognised address format");
    }
    return Buffer.from(fromWords(words));
  };
}

const bech32Chain = (name, prefix) => ({
  decoder: makeBech32Decoder(prefix),
  encoder: makeBech32Encoder(prefix),
  name,
});

export const ETHERMINT = bech32Chain("ETHERMINT", "ethm");

export const ethToEthermint = (ethAddress) => {
  let data = ETH.decoder(ethAddress);
  return ETHERMINT.encoder(data);
};

export const ethermintToEth = (ethermintAddress) => {
  let data = ETHERMINT.decoder(ethermintAddress);
  return ETH.encoder(data);
};

export const EVMOS = bech32Chain("EVMOS", "evmos");

export const ethToEvmos = (ethAddress) => {
  let data = ETH.decoder(ethAddress);
  return EVMOS.encoder(data);
};

export const evmosToEth = (evmosAddress) => {
  let data = EVMOS.decoder(evmosAddress);
  return ETH.encoder(data);
};

export const REAP = bech32Chain("REAP", "reap");

export const ethToReap = (ethAddress) => {
  let data = ETH.decoder(ethAddress);
  return REAP.encoder(data);
};

export const reapToEth = (evmosAddress) => {
  let data = REAP.decoder(evmosAddress);
  return ETH.encoder(data);
};
