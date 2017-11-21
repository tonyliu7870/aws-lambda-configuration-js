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
    get(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    tableName: options.tableName || this.tableName,
                    documentName: options.documentName || this.documentName,
                    key,
                    type: 'get',
                    noCache: options.noCache,
                }),
            }).promise();
            return JSON.parse(response.Payload);
        });
    }
    /**
     * @api getFresh(key,options) getFresh
     * @apiName get-fresh-config
     * @apiVersion 0.0.1
     * @apiGroup Get Configuration
     * @apiDescription Same as get-config but just help you set the noCache to true. Get the fresh, non-cached configuration by invoking core lambda function
     *
     */
    getFresh(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(key, Object.assign({}, options, { noCache: true }));
        });
    }
}
exports.default = default_1;
