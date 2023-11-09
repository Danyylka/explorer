/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cosmos.orm.v1alpha1";

/** StorageType */
export enum StorageType {
  /**
   * STORAGE_TYPE_DEFAULT_UNSPECIFIED - STORAGE_TYPE_DEFAULT_UNSPECIFIED indicates the persistent
   * KV-storage where primary key entries are stored in merkle-tree
   * backed commitment storage and indexes and seqs are stored in
   * fast index storage. Note that the Cosmos SDK before store/v2alpha1
   * does not support this.
   */
  STORAGE_TYPE_DEFAULT_UNSPECIFIED = 0,
  /**
   * STORAGE_TYPE_MEMORY - STORAGE_TYPE_MEMORY indicates in-memory storage that will be
   * reloaded every time an app restarts. Tables with this type of storage
   * will by default be ignored when importing and exporting a module's
   * state from JSON.
   */
  STORAGE_TYPE_MEMORY = 1,
  /**
   * STORAGE_TYPE_TRANSIENT - STORAGE_TYPE_TRANSIENT indicates transient storage that is reset
   * at the end of every block. Tables with this type of storage
   * will by default be ignored when importing and exporting a module's
   * state from JSON.
   */
  STORAGE_TYPE_TRANSIENT = 2,
  /**
   * STORAGE_TYPE_INDEX - STORAGE_TYPE_INDEX indicates persistent storage which is not backed
   * by a merkle-tree and won't affect the app hash. Note that the Cosmos SDK
   * before store/v2alpha1 does not support this.
   */
  STORAGE_TYPE_INDEX = 3,
  /**
   * STORAGE_TYPE_COMMITMENT - STORAGE_TYPE_INDEX indicates persistent storage which is backed by
   * a merkle-tree. With this type of storage, both primary and index keys
   * will affect the app hash and this is generally less efficient
   * than using STORAGE_TYPE_DEFAULT_UNSPECIFIED which separates index
   * keys into index storage. Note that modules built with the
   * Cosmos SDK before store/v2alpha1 must specify STORAGE_TYPE_COMMITMENT
   * instead of STORAGE_TYPE_DEFAULT_UNSPECIFIED or STORAGE_TYPE_INDEX
   * because this is the only type of persistent storage available.
   */
  STORAGE_TYPE_COMMITMENT = 4,
  UNRECOGNIZED = -1,
}

export function storageTypeFromJSON(object: any): StorageType {
  switch (object) {
    case 0:
    case "STORAGE_TYPE_DEFAULT_UNSPECIFIED":
      return StorageType.STORAGE_TYPE_DEFAULT_UNSPECIFIED;
    case 1:
    case "STORAGE_TYPE_MEMORY":
      return StorageType.STORAGE_TYPE_MEMORY;
    case 2:
    case "STORAGE_TYPE_TRANSIENT":
      return StorageType.STORAGE_TYPE_TRANSIENT;
    case 3:
    case "STORAGE_TYPE_INDEX":
      return StorageType.STORAGE_TYPE_INDEX;
    case 4:
    case "STORAGE_TYPE_COMMITMENT":
      return StorageType.STORAGE_TYPE_COMMITMENT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return StorageType.UNRECOGNIZED;
  }
}

export function storageTypeToJSON(object: StorageType): string {
  switch (object) {
    case StorageType.STORAGE_TYPE_DEFAULT_UNSPECIFIED:
      return "STORAGE_TYPE_DEFAULT_UNSPECIFIED";
    case StorageType.STORAGE_TYPE_MEMORY:
      return "STORAGE_TYPE_MEMORY";
    case StorageType.STORAGE_TYPE_TRANSIENT:
      return "STORAGE_TYPE_TRANSIENT";
    case StorageType.STORAGE_TYPE_INDEX:
      return "STORAGE_TYPE_INDEX";
    case StorageType.STORAGE_TYPE_COMMITMENT:
      return "STORAGE_TYPE_COMMITMENT";
    case StorageType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** ModuleSchemaDescriptor describe's a module's ORM schema. */
export interface ModuleSchemaDescriptor {
  schemaFile: ModuleSchemaDescriptor_FileEntry[];
  /**
   * prefix is an optional prefix that precedes all keys in this module's
   * store.
   */
  prefix: Uint8Array;
}

/** FileEntry describes an ORM file used in a module. */
export interface ModuleSchemaDescriptor_FileEntry {
  /**
   * id is a prefix that will be varint encoded and prepended to all the
   * table keys specified in the file's tables.
   */
  id: number;
  /**
   * proto_file_name is the name of a file .proto in that contains
   * table definitions. The .proto file must be in a package that the
   * module has referenced using cosmos.app.v1.ModuleDescriptor.use_package.
   */
  protoFileName: string;
  /**
   * storage_type optionally indicates the type of storage this file's
   * tables should used. If it is left unspecified, the default KV-storage
   * of the app will be used.
   */
  storageType: StorageType;
}

function createBaseModuleSchemaDescriptor(): ModuleSchemaDescriptor {
  return { schemaFile: [], prefix: new Uint8Array(0) };
}

export const ModuleSchemaDescriptor = {
  encode(message: ModuleSchemaDescriptor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.schemaFile) {
      ModuleSchemaDescriptor_FileEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.prefix.length !== 0) {
      writer.uint32(18).bytes(message.prefix);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleSchemaDescriptor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleSchemaDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.schemaFile.push(ModuleSchemaDescriptor_FileEntry.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.prefix = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ModuleSchemaDescriptor {
    return {
      schemaFile: globalThis.Array.isArray(object?.schemaFile)
        ? object.schemaFile.map((e: any) => ModuleSchemaDescriptor_FileEntry.fromJSON(e))
        : [],
      prefix: isSet(object.prefix) ? bytesFromBase64(object.prefix) : new Uint8Array(0),
    };
  },

  toJSON(message: ModuleSchemaDescriptor): unknown {
    const obj: any = {};
    if (message.schemaFile?.length) {
      obj.schemaFile = message.schemaFile.map((e) => ModuleSchemaDescriptor_FileEntry.toJSON(e));
    }
    if (message.prefix.length !== 0) {
      obj.prefix = base64FromBytes(message.prefix);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ModuleSchemaDescriptor>, I>>(base?: I): ModuleSchemaDescriptor {
    return ModuleSchemaDescriptor.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ModuleSchemaDescriptor>, I>>(object: I): ModuleSchemaDescriptor {
    const message = createBaseModuleSchemaDescriptor();
    message.schemaFile = object.schemaFile?.map((e) => ModuleSchemaDescriptor_FileEntry.fromPartial(e)) || [];
    message.prefix = object.prefix ?? new Uint8Array(0);
    return message;
  },
};

function createBaseModuleSchemaDescriptor_FileEntry(): ModuleSchemaDescriptor_FileEntry {
  return { id: 0, protoFileName: "", storageType: 0 };
}

export const ModuleSchemaDescriptor_FileEntry = {
  encode(message: ModuleSchemaDescriptor_FileEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.protoFileName !== "") {
      writer.uint32(18).string(message.protoFileName);
    }
    if (message.storageType !== 0) {
      writer.uint32(24).int32(message.storageType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleSchemaDescriptor_FileEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleSchemaDescriptor_FileEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.protoFileName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.storageType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ModuleSchemaDescriptor_FileEntry {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      protoFileName: isSet(object.protoFileName) ? globalThis.String(object.protoFileName) : "",
      storageType: isSet(object.storageType) ? storageTypeFromJSON(object.storageType) : 0,
    };
  },

  toJSON(message: ModuleSchemaDescriptor_FileEntry): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.protoFileName !== "") {
      obj.protoFileName = message.protoFileName;
    }
    if (message.storageType !== 0) {
      obj.storageType = storageTypeToJSON(message.storageType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ModuleSchemaDescriptor_FileEntry>, I>>(
    base?: I,
  ): ModuleSchemaDescriptor_FileEntry {
    return ModuleSchemaDescriptor_FileEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ModuleSchemaDescriptor_FileEntry>, I>>(
    object: I,
  ): ModuleSchemaDescriptor_FileEntry {
    const message = createBaseModuleSchemaDescriptor_FileEntry();
    message.id = object.id ?? 0;
    message.protoFileName = object.protoFileName ?? "";
    message.storageType = object.storageType ?? 0;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}