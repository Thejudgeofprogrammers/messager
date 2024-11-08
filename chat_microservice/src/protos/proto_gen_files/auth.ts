// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.12.4
// source: auth.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "auth";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
}

export interface LoginRequest {
  phoneNumber?: string | undefined;
  email?: string | undefined;
  password: string;
  passwordHash: string;
  userId: number;
}

export interface LoginResponse {
  userId: number;
  jwtToken: string;
}

function createBaseRegisterRequest(): RegisterRequest {
  return { username: "", email: "", password: "", phoneNumber: "" };
}

export const RegisterRequest: MessageFns<RegisterRequest> = {
  encode(message: RegisterRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(34).string(message.phoneNumber);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RegisterRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.phoneNumber = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterRequest {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      phoneNumber: isSet(object.phoneNumber) ? globalThis.String(object.phoneNumber) : "",
    };
  },

  toJSON(message: RegisterRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.phoneNumber !== "") {
      obj.phoneNumber = message.phoneNumber;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterRequest>, I>>(base?: I): RegisterRequest {
    return RegisterRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterRequest>, I>>(object: I): RegisterRequest {
    const message = createBaseRegisterRequest();
    message.username = object.username ?? "";
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    return message;
  },
};

function createBaseRegisterResponse(): RegisterResponse {
  return { username: "", email: "", passwordHash: "", phoneNumber: "" };
}

export const RegisterResponse: MessageFns<RegisterResponse> = {
  encode(message: RegisterResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.passwordHash !== "") {
      writer.uint32(26).string(message.passwordHash);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(34).string(message.phoneNumber);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RegisterResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.passwordHash = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.phoneNumber = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisterResponse {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      passwordHash: isSet(object.passwordHash) ? globalThis.String(object.passwordHash) : "",
      phoneNumber: isSet(object.phoneNumber) ? globalThis.String(object.phoneNumber) : "",
    };
  },

  toJSON(message: RegisterResponse): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.passwordHash !== "") {
      obj.passwordHash = message.passwordHash;
    }
    if (message.phoneNumber !== "") {
      obj.phoneNumber = message.phoneNumber;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterResponse>, I>>(base?: I): RegisterResponse {
    return RegisterResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisterResponse>, I>>(object: I): RegisterResponse {
    const message = createBaseRegisterResponse();
    message.username = object.username ?? "";
    message.email = object.email ?? "";
    message.passwordHash = object.passwordHash ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return { phoneNumber: undefined, email: undefined, password: "", passwordHash: "", userId: 0 };
}

export const LoginRequest: MessageFns<LoginRequest> = {
  encode(message: LoginRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.phoneNumber !== undefined) {
      writer.uint32(10).string(message.phoneNumber);
    }
    if (message.email !== undefined) {
      writer.uint32(18).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    if (message.passwordHash !== "") {
      writer.uint32(34).string(message.passwordHash);
    }
    if (message.userId !== 0) {
      writer.uint32(40).int32(message.userId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.phoneNumber = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.passwordHash = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      phoneNumber: isSet(object.phoneNumber) ? globalThis.String(object.phoneNumber) : undefined,
      email: isSet(object.email) ? globalThis.String(object.email) : undefined,
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      passwordHash: isSet(object.passwordHash) ? globalThis.String(object.passwordHash) : "",
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.phoneNumber !== undefined) {
      obj.phoneNumber = message.phoneNumber;
    }
    if (message.email !== undefined) {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.passwordHash !== "") {
      obj.passwordHash = message.passwordHash;
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(base?: I): LoginRequest {
    return LoginRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.phoneNumber = object.phoneNumber ?? undefined;
    message.email = object.email ?? undefined;
    message.password = object.password ?? "";
    message.passwordHash = object.passwordHash ?? "";
    message.userId = object.userId ?? 0;
    return message;
  },
};

function createBaseLoginResponse(): LoginResponse {
  return { userId: 0, jwtToken: "" };
}

export const LoginResponse: MessageFns<LoginResponse> = {
  encode(message: LoginResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.jwtToken !== "") {
      writer.uint32(18).string(message.jwtToken);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LoginResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.jwtToken = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginResponse {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      jwtToken: isSet(object.jwtToken) ? globalThis.String(object.jwtToken) : "",
    };
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.jwtToken !== "") {
      obj.jwtToken = message.jwtToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginResponse>, I>>(base?: I): LoginResponse {
    return LoginResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(object: I): LoginResponse {
    const message = createBaseLoginResponse();
    message.userId = object.userId ?? 0;
    message.jwtToken = object.jwtToken ?? "";
    return message;
  },
};

export interface AuthService {
  Register(request: RegisterRequest): Promise<RegisterResponse>;
  Login(request: LoginRequest): Promise<LoginResponse>;
}

export const AuthServiceServiceName = "auth.AuthService";
export class AuthServiceClientImpl implements AuthService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || AuthServiceServiceName;
    this.rpc = rpc;
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
  }
  Register(request: RegisterRequest): Promise<RegisterResponse> {
    const data = RegisterRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Register", data);
    return promise.then((data) => RegisterResponse.decode(new BinaryReader(data)));
  }

  Login(request: LoginRequest): Promise<LoginResponse> {
    const data = LoginRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Login", data);
    return promise.then((data) => LoginResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
