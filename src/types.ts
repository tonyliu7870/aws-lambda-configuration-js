export type Options = {
  functionName: string;
  tableName: string;
  documentName: string;
  noCache: boolean;
  cmk: string;
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

// Core functions types
export type ConfigurationRequestParam = {
  tableName: string;
  documentName: string;
  key?: string;
  type: string;
}

export type GetConfigurationRequestParam = ConfigurationRequestParam & {
  noCache: boolean;
}

export type CheckConfigurationRequestParam = ConfigurationRequestParam & {}

export type SetConfigurationRequestParam = ConfigurationRequestParam & {
  data: any;
}

export type DeleteConfigurationRequestParam = ConfigurationRequestParam & {}

export enum UpdateType {
  get = 'GET',
  put = 'PUT',
  delete = 'DELETE',
  check = 'CHECK',
}

