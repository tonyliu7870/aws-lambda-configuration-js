export declare type Options = {
    functionName: string;
    tableName: string;
    documentName: string;
    noCache: boolean;
};
export declare type ConfigurationRequestParam = {
    tableName: string;
    documentName: string;
    key?: string;
    type: string;
};
export declare type GetConfigurationRequestParam = ConfigurationRequestParam & {
    noCache: boolean;
};
export declare type SetConfigurationRequestParam = ConfigurationRequestParam & {
    data: any;
};
export declare type DeleteConfigurationRequestParam = ConfigurationRequestParam & {};
export declare enum UpdateType {
    get = "GET",
    put = "PUT",
    delete = "DELETE",
}
