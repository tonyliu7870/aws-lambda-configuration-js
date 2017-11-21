import { Lambda } from 'aws-sdk';
import { Options, GetConfigurationRequestParam } from './types';

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
   * @api get(key,options) get
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
   * @apiParamExample {String} get-single-config(js)
   *     const Config = require('aws-lambda-configuration-js');
   *     const config1 = new Config();
   *
   *     const serverVersion = config1.get('version');
   * @apiParamExample {json} get-whole-config(ts)
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
   *
   */
  async get<T> (key?: string, options: Partial<Options> = {}): Promise<T> {
    const response = await this.lambda.invoke({
      FunctionName: options.functionName || this.functionName,
      Payload: JSON.stringify(<GetConfigurationRequestParam>{
        tableName: options.tableName || this.tableName,
        documentName: options.documentName || this.documentName,
        key,
        type: 'get',
        noCache: options.noCache,
      }),
    }).promise();
    return JSON.parse(<string> response.Payload) as T;
  }

  /**
   * @api getFresh(key,options) getFresh
   * @apiName get-fresh-config
   * @apiVersion 0.0.1
   * @apiGroup Get Configuration
   * @apiDescription Same as get-config but just help you set the noCache to true. Get the fresh, non-cached configuration by invoking core lambda function
   *
   */
  async getFresh<T> (key?: string, options: Partial<Options> = {}): Promise<T> {
    return this.get<T>(key, <GetConfigurationRequestParam>{ ...options, noCache: true });
  }
}
