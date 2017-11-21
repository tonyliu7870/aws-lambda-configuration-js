export type Options = {
  functionName: string;
  tableName: string;
  documentName: string;

  noCache: boolean;
}

export type GetConfigurationRequestParam = {
  tableName: string;
  documentName: string;
  key?: string;
  type: string;
  noCache: boolean;
}
