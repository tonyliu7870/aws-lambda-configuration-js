export declare type Options = {
    functionName: string;
    tableName: string;
    documentName: string;
    cmk: string;
    mode: Mode;
};
export declare class DocumentNotFound extends Error {
    constructor(message?: string);
}
export declare type KEKCipher = {
    cipher: string;
    encryptedKey: string;
};
export declare enum Mode {
    Direct = "direct",
    Core = "core",
    Cache = "cache",
}
export declare type ConfigurationRequestParam = {
    tableName: string;
    documentName: string;
    key?: string | string[];
    type: UpdateType;
};
export declare type GetConfigurationRequestParam = ConfigurationRequestParam & {
    noCache: boolean;
};
export declare type CheckConfigurationRequestParam = ConfigurationRequestParam & {};
export declare type SetConfigurationRequestParam = ConfigurationRequestParam & {
    data: any;
};
export declare type DeleteConfigurationRequestParam = ConfigurationRequestParam & {};
export declare enum UpdateType {
    Get = "GET",
    Put = "PUT",
    Delete = "DELETE",
    Check = "CHECK",
}
