import { Lambda } from 'aws-sdk';
import { Options } from './types';
export default class  {
    lambda: Lambda;
    private functionName;
    private tableName;
    private documentName;
    constructor(options?: Partial<Options>);
    /**
     * @api get<T>(key,options) get
     * @apiName get-config
     * @apiVersion 0.0.1
     * @apiGroup Get Configuration
     * @apiDescription Get the configuration by invoking core lambda function
     *
     * @apiParam {Type} T The type of configuration you are getting, available in typescript
     * @apiParam {String} [key] The sub-path to your configuration. Leave undefined will get the whole configuration object
     * @apiParam {Options} [options] The options to this get configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to get the configurations
     * @apiParam {Boolean} [options.noCache] Does the core return/save cached for the configuration
     *
     * @apiParamExample {String} get-single-config(js/promise)
     *     const Config = require('aws-lambda-configuration-js');
     *     const config1 = new Config();
     *
     *     config1.get('version').then((serverVerison) => {
     *       console.log(serverVerison);
     *     });
     * @apiParamExample {json} get-whole-config(ts/async-await)
     *     import Config from 'aws-lambda-configuration-js';
     *     const config1 = new Config();
     *
     *     type ConfigModel = {
     *       version: string;
     *       ...
     *       ...
     *       ...
     *     }
     *     const myConfig = config1.get<ConfigModel>();
     *     console.log(myConfig.version);
     */
    get<T>(key?: string, options?: Partial<Options>): Promise<T>;
    /**
     * @api getFresh<T>(key,options) getFresh
     * @apiName get-fresh-config
     * @apiVersion 0.0.1
     * @apiGroup Get Configuration
     * @apiDescription Same as get-config but just help you set the noCache to true. Get the fresh, non-cached configuration by invoking core lambda function
     *
     * @apiParamExample {String} get-single-config(js/promise)
     *     const Config = require('aws-lambda-configuration-js');
     *     const config1 = new Config();
     *
     *     config1.getFresh('version').then(serverVerison => {
     *       console.log(serverVerison);
     *     });
     * @apiParamExample {json} get-whole-config(ts/async-await)
     *     import Config from 'aws-lambda-configuration-js';
     *     const config1 = new Config();
     *
     *     type ConfigModel = {
     *       version: string;
     *       ...
     *       ...
     *       ...
     *     }
     *     const myConfig = config1.getFresh<ConfigModel>();
     *     console.log(myConfig.version);
     */
    getFresh<T>(key?: string, options?: Partial<Options>): Promise<T>;
    set(data: any, key?: string, options?: Partial<Options>): Promise<void>;
    /**
     * @api delete(key,options) delete
     * @apiName delete-config
     * @apiVersion 0.0.2
     * @apiGroup Delete Configuration
     * @apiDescription Delete one specific configuration by invoking core lambda function
     *
     * @apiParam {String} key The property of your configuration. You must specify a key(path) to delete one property. If you would like to delete the whole document, use DeleteDocument
     * @apiParam {Options} [options] The options to this get configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to delete the configuration
     *
     * @apiParamExample {String} delete-single-config(js/promise)
     *     config1.delete('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {json} delete-single-config(ts/async-await)
     *     await config1.delete('version');
     */
    delete(key: string, options?: Partial<Options>): Promise<void>;
    /**
     * @api deleteDocument(documentName,options) deleteDocument
     * @apiName delete-whole-config
     * @apiVersion 0.0.2
     * @apiGroup Delete Configuration
     * @apiDescription Delete the whole configuration by invoking core lambda function
     *
     * @apiParam {String} documentName The name of your configuration. You must specify the documentName, default value is not applicable here. If you would like to delete only one property, use delete
     * @apiParam {Options} [options] The options to this get configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     *
     * @apiParamExample {String} delete-whole-config(js/promise)
     *     config1.deleteDocument('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {json} delete-whole-config(ts/async-await)
     *     await config1.deleteDocument('version');
     */
    deleteDocument(documentName: string, options?: Partial<Options>): Promise<void>;
}
