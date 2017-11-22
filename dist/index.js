"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const types_1 = require("./types");
class default_1 {
    constructor(options = {}) {
        this.lambda = new aws_sdk_1.Lambda();
        this.functionName = 'lambda-configuration';
        this.tableName = 'lambda-configurations';
        this.documentName = 'settings';
        if (options.functionName)
            this.functionName = options.functionName;
        if (options.tableName)
            this.tableName = options.tableName;
        if (options.documentName)
            this.documentName = options.documentName;
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
    get(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    type: types_1.UpdateType.get,
                    tableName: options.tableName || this.tableName,
                    documentName: options.documentName || this.documentName,
                    key,
                    noCache: options.noCache,
                }),
            }).promise();
            return JSON.parse(response.Payload);
        });
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
    getFresh(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(key, Object.assign({}, options, { noCache: true }));
        });
    }
    set(data, key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    type: types_1.UpdateType.put,
                    tableName: options.tableName || this.tableName,
                    documentName: options.documentName || this.documentName,
                    key,
                    data,
                }),
            }).promise();
        });
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
    delete(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    type: types_1.UpdateType.delete,
                    tableName: options.tableName || this.tableName,
                    documentName: options.documentName || this.documentName,
                    key,
                }),
            }).promise();
        });
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
    deleteDocument(documentName, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    type: types_1.UpdateType.delete,
                    tableName: options.tableName || this.tableName,
                    documentName: documentName,
                }),
            }).promise();
        });
    }
}
exports.default = default_1;
