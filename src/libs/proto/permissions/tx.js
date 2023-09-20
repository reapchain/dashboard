"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcWebError = exports.GrpcWebImpl = exports.MsgDesc = exports.MsgClientImpl = exports.MsgReplaceStandingMemberProposalResponse = exports.MsgReplaceStandingMemberProposal = exports.MsgRemoveStandingMemberProposalResponse = exports.MsgRemoveStandingMemberProposal = exports.MsgRegisterStandingMemberProposalResponse = exports.MsgRegisterStandingMemberProposal = exports.protobufPackage = void 0;
/* eslint-disable */
const grpc_web_1 = require("@improbable-eng/grpc-web");
const browser_headers_1 = require("browser-headers");
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "";
function createBaseMsgRegisterStandingMemberProposal() {
  return {
    title: "",
    description: "",
    validatorAddress: "",
    accountAddress: "",
    moniker: "",
  };
}
exports.MsgRegisterStandingMemberProposal = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.validatorAddress !== "") {
      writer.uint32(26).string(message.validatorAddress);
    }
    if (message.accountAddress !== "") {
      writer.uint32(34).string(message.accountAddress);
    }
    if (message.moniker !== "") {
      writer.uint32(42).string(message.moniker);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterStandingMemberProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.validatorAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.accountAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.moniker = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      validatorAddress: isSet(object.validatorAddress)
        ? String(object.validatorAddress)
        : "",
      accountAddress: isSet(object.accountAddress)
        ? String(object.accountAddress)
        : "",
      moniker: isSet(object.moniker) ? String(object.moniker) : "",
    };
  },
  toJSON(message) {
    const obj = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined &&
      (obj.description = message.description);
    message.validatorAddress !== undefined &&
      (obj.validatorAddress = message.validatorAddress);
    message.accountAddress !== undefined &&
      (obj.accountAddress = message.accountAddress);
    message.moniker !== undefined && (obj.moniker = message.moniker);
    return obj;
  },
  create(base) {
    return exports.MsgRegisterStandingMemberProposal.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(object) {
    var _a, _b, _c, _d, _e;
    const message = createBaseMsgRegisterStandingMemberProposal();
    message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
    message.description =
      (_b = object.description) !== null && _b !== void 0 ? _b : "";
    message.validatorAddress =
      (_c = object.validatorAddress) !== null && _c !== void 0 ? _c : "";
    message.accountAddress =
      (_d = object.accountAddress) !== null && _d !== void 0 ? _d : "";
    message.moniker = (_e = object.moniker) !== null && _e !== void 0 ? _e : "";
    return message;
  },
};
function createBaseMsgRegisterStandingMemberProposalResponse() {
  return {};
}
exports.MsgRegisterStandingMemberProposalResponse = {
  encode(_, writer = minimal_1.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterStandingMemberProposalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return exports.MsgRegisterStandingMemberProposalResponse.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(_) {
    const message = createBaseMsgRegisterStandingMemberProposalResponse();
    return message;
  },
};
function createBaseMsgRemoveStandingMemberProposal() {
  return { title: "", description: "", validatorAddress: "" };
}
exports.MsgRemoveStandingMemberProposal = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.validatorAddress !== "") {
      writer.uint32(26).string(message.validatorAddress);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveStandingMemberProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.validatorAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      validatorAddress: isSet(object.validatorAddress)
        ? String(object.validatorAddress)
        : "",
    };
  },
  toJSON(message) {
    const obj = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined &&
      (obj.description = message.description);
    message.validatorAddress !== undefined &&
      (obj.validatorAddress = message.validatorAddress);
    return obj;
  },
  create(base) {
    return exports.MsgRemoveStandingMemberProposal.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(object) {
    var _a, _b, _c;
    const message = createBaseMsgRemoveStandingMemberProposal();
    message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
    message.description =
      (_b = object.description) !== null && _b !== void 0 ? _b : "";
    message.validatorAddress =
      (_c = object.validatorAddress) !== null && _c !== void 0 ? _c : "";
    return message;
  },
};
function createBaseMsgRemoveStandingMemberProposalResponse() {
  return {};
}
exports.MsgRemoveStandingMemberProposalResponse = {
  encode(_, writer = minimal_1.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveStandingMemberProposalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return exports.MsgRemoveStandingMemberProposalResponse.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(_) {
    const message = createBaseMsgRemoveStandingMemberProposalResponse();
    return message;
  },
};
function createBaseMsgReplaceStandingMemberProposal() {
  return {
    title: "",
    description: "",
    existingValidatorAddress: "",
    replacementValidatorAddress: "",
    replacementAccountAddress: "",
    replacementMoniker: "",
  };
}
exports.MsgReplaceStandingMemberProposal = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.existingValidatorAddress !== "") {
      writer.uint32(26).string(message.existingValidatorAddress);
    }
    if (message.replacementValidatorAddress !== "") {
      writer.uint32(34).string(message.replacementValidatorAddress);
    }
    if (message.replacementAccountAddress !== "") {
      writer.uint32(42).string(message.replacementAccountAddress);
    }
    if (message.replacementMoniker !== "") {
      writer.uint32(50).string(message.replacementMoniker);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgReplaceStandingMemberProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.existingValidatorAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.replacementValidatorAddress = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.replacementAccountAddress = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.replacementMoniker = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      existingValidatorAddress: isSet(object.existingValidatorAddress)
        ? String(object.existingValidatorAddress)
        : "",
      replacementValidatorAddress: isSet(object.replacementValidatorAddress)
        ? String(object.replacementValidatorAddress)
        : "",
      replacementAccountAddress: isSet(object.replacementAccountAddress)
        ? String(object.replacementAccountAddress)
        : "",
      replacementMoniker: isSet(object.replacementMoniker)
        ? String(object.replacementMoniker)
        : "",
    };
  },
  toJSON(message) {
    const obj = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined &&
      (obj.description = message.description);
    message.existingValidatorAddress !== undefined &&
      (obj.existingValidatorAddress = message.existingValidatorAddress);
    message.replacementValidatorAddress !== undefined &&
      (obj.replacementValidatorAddress = message.replacementValidatorAddress);
    message.replacementAccountAddress !== undefined &&
      (obj.replacementAccountAddress = message.replacementAccountAddress);
    message.replacementMoniker !== undefined &&
      (obj.replacementMoniker = message.replacementMoniker);
    return obj;
  },
  create(base) {
    return exports.MsgReplaceStandingMemberProposal.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(object) {
    var _a, _b, _c, _d, _e, _f;
    const message = createBaseMsgReplaceStandingMemberProposal();
    message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
    message.description =
      (_b = object.description) !== null && _b !== void 0 ? _b : "";
    message.existingValidatorAddress =
      (_c = object.existingValidatorAddress) !== null && _c !== void 0
        ? _c
        : "";
    message.replacementValidatorAddress =
      (_d = object.replacementValidatorAddress) !== null && _d !== void 0
        ? _d
        : "";
    message.replacementAccountAddress =
      (_e = object.replacementAccountAddress) !== null && _e !== void 0
        ? _e
        : "";
    message.replacementMoniker =
      (_f = object.replacementMoniker) !== null && _f !== void 0 ? _f : "";
    return message;
  },
};
function createBaseMsgReplaceStandingMemberProposalResponse() {
  return {};
}
exports.MsgReplaceStandingMemberProposalResponse = {
  encode(_, writer = minimal_1.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : minimal_1.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgReplaceStandingMemberProposalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return exports.MsgReplaceStandingMemberProposalResponse.fromPartial(
      base !== null && base !== void 0 ? base : {}
    );
  },
  fromPartial(_) {
    const message = createBaseMsgReplaceStandingMemberProposalResponse();
    return message;
  },
};
class MsgClientImpl {
  constructor(rpc) {
    this.rpc = rpc;
  }
}
exports.MsgClientImpl = MsgClientImpl;
exports.MsgDesc = { serviceName: "Msg" };
class GrpcWebImpl {
  constructor(host, options) {
    this.host = host;
    this.options = options;
  }
  unary(methodDesc, _request, metadata) {
    var _a;
    const request = Object.assign(
      Object.assign({}, _request),
      methodDesc.requestType
    );
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new browser_headers_1.BrowserHeaders(
            Object.assign(
              Object.assign(
                {},
                (_a = this.options) === null || _a === void 0
                  ? void 0
                  : _a.metadata.headersMap
              ),
              metadata === null || metadata === void 0
                ? void 0
                : metadata.headersMap
            )
          )
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc_web_1.grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function(response) {
          if (response.status === grpc_web_1.grpc.Code.OK) {
            resolve(response.message.toObject());
          } else {
            const err = new GrpcWebError(
              response.statusMessage,
              response.status,
              response.trailers
            );
            reject(err);
          }
        },
      });
    });
  }
}
exports.GrpcWebImpl = GrpcWebImpl;
var tsProtoGlobalThis = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();
if (minimal_1.default.util.Long !== long_1.default) {
  minimal_1.default.util.Long = long_1.default;
  minimal_1.default.configure();
}
function isSet(value) {
  return value !== null && value !== undefined;
}
class GrpcWebError extends tsProtoGlobalThis.Error {
  constructor(message, code, metadata) {
    super(message);
    this.code = code;
    this.metadata = metadata;
  }
}
exports.GrpcWebError = GrpcWebError;
