export type Options = {
  functionName: string;
  tableName: string;
  documentName: string;
  cmk: string;
  mode: Mode;
}

export class DocumentNotFound extends Error {
  constructor (message?: string) {
    super(message);
    this.name = 'DocumentNotFound';
  }
}

export type KEKCipher = {
  cipher: string;
  encryptedKey: string;
}

export enum Mode {
  Direct = 'direct',
  Core = 'core',
  Cache = 'cache',
}

// Core functions types
export type ConfigurationRequestParam = {
  tableName: string;
  documentName: string;
  key?: string | string[];
  type: UpdateType;
}

export type GetConfigurationRequestParam = ConfigurationRequestParam & {
  noCache: boolean;
}

export type CheckConfigurationRequestParam = ConfigurationRequestParam & {
  noCache: boolean;
}

export type SetConfigurationRequestParam = ConfigurationRequestParam & {
  data: any;
}

export type DeleteConfigurationRequestParam = ConfigurationRequestParam & {}

export enum UpdateType {
  Get = 'GET',
  Put = 'PUT',
  Delete = 'DELETE',
  Check = 'CHECK',
}

