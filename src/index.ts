import { Lambda } from 'aws-sdk';
import { Options, UpdateType, GetConfigurationRequestParam, SetConfigurationRequestParam, DeleteConfigurationRequestParam } from './types';

export default class {
  public lambda = new Lambda();
  private functionName = 'lambda-configuration';
  private tableName = 'lambda-configurations';
  private documentName = 'settings';

  constructor (options: Partial<Options> = {}) {
    if (options.functionName) this.functionName = options.functionName;
    if (options.tableName) this.tableName = options.tableName;
    if (options.documentName) this.documentName = options.documentName;
  }

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
  async get<T> (key?: string, options: Partial<Options> = {}): Promise<T> {
    const response = await this.lambda.invoke({
      FunctionName: options.functionName || this.functionName,
      Payload: JSON.stringify(<GetConfigurationRequestParam>{
        type: UpdateType.get,
        tableName: options.tableName || this.tableName,
        documentName: options.documentName || this.documentName,
        key,
        noCache: options.noCache,
      }),
    }).promise();
    return JSON.parse(<string> response.Payload) as T;
  }

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
  async getFresh<T> (key?: string, options: Partial<Options> = {}): Promise<T> {
    return this.get<T>(key, <GetConfigurationRequestParam>{ ...options, noCache: true });
  }

  async set (data: any, key?: string, options: Partial<Options> = {}): Promise<void> {
    await this.lambda.invoke({
      FunctionName: options.functionName || this.functionName,
      Payload: JSON.stringify(<SetConfigurationRequestParam>{
        type: UpdateType.put,
        tableName: options.tableName || this.tableName,
        documentName: options.documentName || this.documentName,
        key,
        data,
      }),
    }).promise();
  }

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
  async delete (key: string, options: Partial<Options> = {}): Promise<void> {
    await this.lambda.invoke({
      FunctionName: options.functionName || this.functionName,
      Payload: JSON.stringify(<DeleteConfigurationRequestParam>{
        type: UpdateType.delete,
        tableName: options.tableName || this.tableName,
        documentName: options.documentName || this.documentName,
        key,
      }),
    }).promise();
  }

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
  async deleteDocument (documentName: string, options: Partial<Options> = {}): Promise<void> {
    await this.lambda.invoke({
      FunctionName: options.functionName || this.functionName,
      Payload: JSON.stringify(<DeleteConfigurationRequestParam>{
        type: UpdateType.delete,
        tableName: options.tableName || this.tableName,
        documentName: documentName,
      }),
    }).promise();
  }
}
