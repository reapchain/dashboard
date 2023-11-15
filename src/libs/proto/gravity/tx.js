export const MsgSendToEth = {
  typeUrl: "/gravity.v1.MsgSendToEth",
  encode(message, writer = BinaryWriter.create()) {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.ethDest !== "") {
      writer.uint32(18).string(message.ethDest);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
    }
    if (message.bridgeFee !== undefined) {
      Coin.encode(message.bridgeFee, writer.uint32(34).fork()).ldelim();
    }
    if (message.chainFee !== undefined) {
      Coin.encode(message.chainFee, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  fromJSON(object) {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      ethDest: isSet(object.ethDest) ? String(object.ethDest) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      bridgeFee: isSet(object.bridgeFee)
        ? Coin.fromJSON(object.bridgeFee)
        : undefined,
      chainFee: isSet(object.chainFee)
        ? Coin.fromJSON(object.chainFee)
        : undefined,
    };
  },
  fromPartial(object: Partial<MsgSendToEth>): MsgSendToEth {
    const message = createBaseMsgSendToEth();
    message.sender = object.sender ?? "";
    message.ethDest = object.ethDest ?? "";
    message.amount =
      object.amount !== undefined && object.amount !== null
        ? Coin.fromPartial(object.amount)
        : undefined;
    message.bridgeFee =
      object.bridgeFee !== undefined && object.bridgeFee !== null
        ? Coin.fromPartial(object.bridgeFee)
        : undefined;
    message.chainFee =
      object.chainFee !== undefined && object.chainFee !== null
        ? Coin.fromPartial(object.chainFee)
        : undefined;
    return message;
  },
  fromAmino(object: MsgSendToEthAmino): MsgSendToEth {
    return {
      sender: object.sender,
      ethDest: object.eth_dest,
      amount: object?.amount ? Coin.fromAmino(object.amount) : undefined,
      bridgeFee: object?.bridge_fee
        ? Coin.fromAmino(object.bridge_fee)
        : undefined,
      chainFee: object?.chain_fee
        ? Coin.fromAmino(object.chain_fee)
        : undefined,
    };
  },
  toAmino(message: MsgSendToEth): MsgSendToEthAmino {
    const obj: any = {};
    obj.sender = message.sender;
    obj.eth_dest = message.ethDest;
    obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
    obj.bridge_fee = message.bridgeFee
      ? Coin.toAmino(message.bridgeFee)
      : undefined;
    obj.chain_fee = message.chainFee
      ? Coin.toAmino(message.chainFee)
      : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSendToEthAminoMsg): MsgSendToEth {
    return MsgSendToEth.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSendToEthProtoMsg): MsgSendToEth {
    return MsgSendToEth.decode(message.value);
  },
  toProto(message: MsgSendToEth): Uint8Array {
    return MsgSendToEth.encode(message).finish();
  },
  toProtoMsg(message: MsgSendToEth): MsgSendToEthProtoMsg {
    return {
      typeUrl: "/gravity.v1.MsgSendToEth",
      value: MsgSendToEth.encode(message).finish(),
    };
  },
};
