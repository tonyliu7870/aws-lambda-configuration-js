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
// aes-js missing declaration file
const AES = require('aes-js');
const _get = require("lodash.get");
const types_1 = require("./types");
class default_1 {
    /**
     * @api constructor(options) constructor
     * @apiName constrcutor
     * @apiVersion 0.0.2
     * @apiGroup Initialization
     * @apiDescription Initialization
     *
     * @apiParam {Options} [options] The options to this get configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to access the configurations
     * @apiParam {String} [options.cmk] Customer Master Key (CMK). The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a "alias/", i.e. "alias/my-key".
     *
     * @apiParamExample {js} construction(js)
     *     const Config = require('aws-lambda-configuration-js').default;
     *     const config1 = new Config();
     * @apiParamExample {js} construction(ts)
     *     import Config from 'aws-lambda-configuration-js';
     *     const config1 = new Config();
     * @apiParamExample {js} with-options
     *     import Config from 'aws-lambda-configuration-js';
     *     const config1 = new Config({
     *       functionName: 'my-lambda',
     *       tableName: 'my-table',
     *       documentName: 'my-configuration'
     *     })
     */
    constructor(options = {}) {
        this.lambda = new aws_sdk_1.Lambda();
        this.kms = new aws_sdk_1.KMS();
        this.dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
        this.functionName = 'lambda-configuration';
        this.tableName = 'lambda-configurations';
        this.documentName = 'settings';
        this.cmk = 'alias/lambda-configuration-key';
        if (options.functionName)
            this.functionName = options.functionName;
        if (options.tableName)
            this.tableName = options.tableName;
        if (options.documentName)
            this.documentName = options.documentName;
        if (options.cmk)
            this.cmk = options.cmk;
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
     * @apiParamExample {js} get-single-config(js/promise)
     *     config1.get('version').then((serverVerison) => {
     *       console.log(serverVerison);
     *     });
     * @apiParamExample {js} get-whole-config(ts/async-await)
     *     type ConfigModel = {
     *       version: string;
     *       ...
     *       ...
     *       ...
     *     }
     *     const myConfig = await config1.get<ConfigModel>();
     *     console.log(myConfig.version);
     *
     * @apiSuccess {Type} . The config you stored.
     * @apiSuccessExample {String} with-key
     *     "user001"
     * @apiSuccessExample {json} without-key
     *     {
     *       "userId": "user001",
     *       "password_group": {
     *         "cipher": Buffer<XX XX XX ...>,
     *         "encryptedKey": Buffer<YY YY YY ...>
     *       },
     *       "something": ["else", true, 1234]
     *     }
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
     * @apiParamExample {js} get-single-config(js/promise)
     *     config1.getFresh('version').then(serverVerison => {
     *       console.log(serverVerison);
     *     });
     * @apiParamExample {js} get-whole-config(ts/async-await)
     *     type ConfigModel = {
     *       version: string;
     *       ...
     *       ...
     *       ...
     *     }
     *     const myConfig = await config1.getFresh<ConfigModel>();
     *     console.log(myConfig.version);
     *
     * @apiSuccess {Type} . The config you stored.
     * @apiSuccessExample {String} with-key
     *     "user001"
     * @apiSuccessExample {json} without-key
     *     {
     *       "userId": "user001",
     *       "password_group": {
     *         "cipher": Buffer<XX XX XX ...>,
     *         "encryptedKey": Buffer<YY YY YY ...>
     *       },
     *       "something": ["else", true, 1234]
     *     }
     */
    getDirect(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //return this.get<T>(key, <GetConfigurationRequestParam>{ ...options, noCache: true });
            // transform key into path array
            const paths = Array.isArray(key) ? ['data', ...key] : (key === undefined) ? ['data'] : ('data.' + key).split('.');
            // prepare request parameter
            const tableName = options.tableName || this.tableName;
            const documentName = options.documentName || this.documentName;
            const projectionExpression = `${paths.map((subPath, index) => '#path' + index).join('.')}`;
            const projectionKeys = {};
            paths.forEach((subPath, index) => projectionKeys['#path' + index] = subPath);
            const response = yield this.dynamo.get({
                TableName: tableName,
                Key: { configName: documentName },
                ProjectionExpression: projectionExpression,
                ExpressionAttributeNames: projectionKeys,
            }).promise();
            // decide return type
            if (response.Item === undefined) {
                throw new types_1.DocumentNotFound(`Request resource ${documentName} not found`);
            }
            if (key === undefined) {
                return response.Item.data;
            }
            return _get(response.Item, paths.map(path => path.replace(/\[\d+\]/g, '[0]')));
        });
    }
    /**
     * @api has(key,options) has
     * @apiName has-config
     * @apiVersion 0.0.1
     * @apiGroup Get Configuration
     * @apiDescription Check if the configuration exists by invoking core lambda function. It is useful to save data transmission between lambdas when you only want to check if it contains a property.
     *
     * @apiParam {String} [key] The sub-path to your configuration. Leave undefined will check if the document exist
     * @apiParam {Options} [options] The options to this check configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to check the configurations
     *
     * @apiParamExample {String} has-single-config(js/promise)
     *     config1.has('version').then((isExist) => {
     *       console.log(isExist);  // true
     *     });
     * @apiParamExample {json} has-whole-document(ts/async-await)
     *     const isExist = await config1.has(undefined, { documentName: 'tempDocument' });
     *     console.log(isExist); // true
     *
     * @apiSuccess {boolean} . Does the configuration contains the document / the document contains the path
     */
    has(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.lambda.invoke({
                FunctionName: options.functionName || this.functionName,
                Payload: JSON.stringify({
                    type: types_1.UpdateType.check,
                    tableName: options.tableName || this.tableName,
                    documentName: options.documentName || this.documentName,
                    key,
                }),
            }).promise();
            return JSON.parse(response.Payload);
        });
    }
    hasDirect(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key === undefined) {
                return yield this.hasDocumentDirect(key, options);
            }
            try {
                return ((yield this.getDirect(key, options)) !== undefined);
            }
            catch (error) {
                if (error instanceof types_1.DocumentNotFound) {
                    return false;
                }
                throw error;
            }
        });
    }
    hasDocument(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.has(undefined, options);
        });
    }
    hasDocumentDirect(documentName, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamo.get({
                TableName: options.tableName || this.tableName,
                Key: { configName: options.documentName || this.documentName },
                ProjectionExpression: 'configName',
            }).promise();
            return result.Item !== undefined;
        });
    }
    /**
     * @api set(data,key,options) set
     * @apiName set-config
     * @apiVersion 0.0.1
     * @apiGroup Set Configuration
     * @apiDescription Set the configuration/Create a new Document by invoking core lambda function
     *
     * @apiParam {any} data The configuration to store. If key is undefined, this should be an object (unless you really want to store one config per one document). This could happen if you decided to encrypt the whole config document.
     * @apiParam {String} [key] The sub-path to your configuration. Leave undefined will create/replace the whole configuration document
     * @apiParam {Options} [options] The options to this set configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to set the configurations
     *
     * @apiParamExample {js} set-single-config(js/promise)
     *     const data = 'HI, This is my secret';
     *     config1.set(data, 'additionField').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} create-new-config(ts/async-await)
     *     type ConfigModel = {
     *       a: string;
     *       c: number;
     *       d: boolean;
     *       ...
     *     }
     *     const data: ConfigModel = { a: 'b', c: 1, d: true, f: ['i', 'jk'] };
     *     await config1.set(data, undefined, { documentName: 'my2ndConfiguration' });
     */
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
    setDirect(data, key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableName = options.tableName || this.tableName;
            const documentName = options.documentName || this.documentName;
            if (key === undefined) {
                // create/replace document
                yield this.dynamo.put({
                    TableName: tableName,
                    Item: { configName: documentName, data },
                }).promise();
            }
            else {
                // update partial key in existing document
                const paths = ('data.' + key).split('.');
                const updateExpression = `SET ${paths.map((subPath, index) => '#path' + index).join('.')} = :data`;
                const updateKeys = {};
                paths.forEach((subPath, index) => updateKeys['#path' + index] = subPath);
                yield this.dynamo.update({
                    TableName: tableName,
                    Key: { configName: documentName },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeNames: updateKeys,
                    ExpressionAttributeValues: { ':data': data },
                }).promise();
            }
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
     * @apiParamExample {js} delete-single-config(js/promise)
     *     config1.delete('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-single-config(ts/async-await)
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
    deleteDirect(key, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = ('data.' + key).split('.');
            const updateExpression = `REMOVE ${paths.map((subPath, index) => '#path' + index).join('.')}`;
            const updateKeys = {};
            paths.forEach((subPath, index) => updateKeys['#path' + index] = subPath);
            yield this.dynamo.update({
                TableName: options.tableName || this.tableName,
                Key: { configName: options.documentName || this.documentName },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: updateKeys,
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
     * @apiParamExample {js} delete-whole-config(js/promise)
     *     config1.deleteDocument('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-whole-config(ts/async-await)
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
    deleteDocumentDirect(documentName, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dynamo.delete({
                TableName: options.tableName || this.tableName,
                Key: { configName: documentName },
            }).promise();
        });
    }
    /**
     * @api encrypt(data,cmk) encrypt
     * @apiName encrypt-config
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Encrypt the data directly though AWS KMS. This function should only be used to encrypt data itself is random, e.g. access token, access secret, etc. If you want to encrypt more predict able data, e.g. user password. Use encryptKEK instead.
     *
     * @apiParam {Any} data The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.
     * @apiParam {String} [cmk=alias/lambda-configuration-key] The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a "alias/", i.e. "alias/my-key".
     * @apiParamExample {js} encrypt-data(js/promise)
     *     config1.encrypt({ jwtToken: 'abcde12345' }).then((cipher) => {
     *       console.log(cipher);  // Buffer<00 02 ff ....>
     *     });
     * @apiParamExample {js} encrypt-data(ts/async-await)
     *     const cipher = await config1.encrypt({ jwtToken: 'abcde12345' });
     *     console.log(cipher);  // Buffer<00 02 ff ....>
     *
     * @apiSuccess {Buffer} . A buffer contains the encrypted data.
     * @apiSuccessExample {Buffer}
     *     Buffer <00 01 02 03 04 05 06 ...>
     */
    encrypt(data, cmk = 'alias/lambda-configuration-key') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.kms.encrypt({
                KeyId: cmk,
                Plaintext: JSON.stringify(data),
            }).promise().catch(error => {
                if (error.code === 'NotFoundException') {
                    console.error(`Can not encrypt the data using key: ${cmk}.
          Please check if the key is available in ${aws_sdk_1.config.region} or the lambda executor has the corresponding access right.
          If the key you passed is a alias name, it should look like "alias/my-key"`);
                }
                throw error;
            });
            return response.CiphertextBlob.toString('base64');
        });
    }
    /**
     * @api decrypt(data) decrypt
     * @apiName decrypt-config
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Decrypt the data directly though AWS KMS
     *
     * @apiParam {Buffer} data The encrypted cipher generated by encrypt()
     * @apiParamExample {js} decrypt(js/promise)
     *     config1.get().then(myConfig => {
     *       return config1.decrypt(myConfig.jwtToken);
     *     }).then(jwtToken => {
     *       console.log(jwtToken);  // "abcde12345"
     *     });
     * @apiParamExample {js} decrypt(ts/async-await)
     *     const myConfig = await config1.get();
     *     const jwtToken = config1.decrypt(myConfig.jwtToken);
     *     console.log(jwtToken);  // "abcde12345"
     *
     * @apiSuccess {Type} . The data you encrypted, in exactly same format of what you pass into encrypt()
     */
    decrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.kms.decrypt({ CiphertextBlob: new Buffer(data, 'base64') }).promise();
            return JSON.parse(response.Plaintext);
        });
    }
    /**
     * @api encryptKEK(data,cmk) encryptKEK
     * @apiName encrypt-KEK-data
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Encrypt the data by Key-encryption-key (KEK). This function will encrypt your data by a new random key which is encrypted by your AWS cmk. If the data itself is random, non-predictable, non-structural, non-repeat, you MAY use encrypt() for simplicity.
     *
     * @apiParam {Any} data The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.
     * @apiParam {String} [cmk=alias/lambda-configuration-key] The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a "alias/", i.e. "alias/my-key".
     * @apiParamExample {js} encryptKEK(js/promise)
     *     config1.encryptKEK({ password: '123456', second_password: 'qwerty' })
     *       .then(result => {
     *         console.log(result);  // { cipher: Buffer<XX XX XX ...>, encryptedKey: Buffer<YY YY YY ...> }
     *         return config1.set(result, 'password_group', { documentName: 'user001' });
     *       })
     *       .then(() => console.log('change password success'));
     * @apiParamExample {js} encryptKEK(ts/async-promise)
     *     const result = await config1.encryptKEK({ password: '123456', second_password: 'qwerty' });
     *     console.log(result);  // { cipher: Buffer<XX XX XX ...>, encryptedKey: Buffer<YY YY YY ...> }
     *     await config1.set(result, 'password_group', { documentName: 'user001' });
     *     console.log('change password success');
     *
     * @apiSuccess {Buffer} cipher A buffer contains the encrypted data
     * @apiSuccess {Buffer} encryptedKey A buffer contains the data key used to encrypt the data. This key is encrypted by your AWS cmk.
     * @apiSuccessExample {json}
     *     {
     *       "cipher": Buffer<XX XX XX ...>,
     *       "encryptedKey": Buffer<YY YY YY ...>
     *     }
     */
    encryptKEK(data, cmk = 'alias/lambda-configuration-key') {
        return __awaiter(this, void 0, void 0, function* () {
            let plainTextBytesArray = AES.utils.utf8.toBytes(JSON.stringify(data)); // convert arbitrarily data type payload to BytesArray
            let dataKey = yield this.kms.generateDataKey({
                KeyId: cmk,
                KeySpec: 'AES_256',
            }).promise().catch(error => {
                if (error.code === 'NotFoundException') {
                    console.error(`Can not generate a random data key under your aws key: ${cmk}.
          Please check if the key is available in ${aws_sdk_1.config.region} or the lambda executor has the corresponding access right.
          If the key you passed is a alias name, it should look like "alias/my-key"`);
                }
                throw error;
            });
            ;
            // encrypt data
            let encryptor = new AES.ModeOfOperation.ctr([...dataKey.Plaintext], new AES.Counter(0)); // convert Buffer data key to BytesArray
            //const cipher = new Buffer(encryptor.encrypt(plainTextBytesArray));
            const cipher = AES.utils.hex.fromBytes(encryptor.encrypt(plainTextBytesArray));
            const result = {
                cipher: cipher,
                encryptedKey: dataKey.CiphertextBlob.toString('base64'),
            };
            // clean up key's data immediately after usage
            encryptor = null;
            plainTextBytesArray = null;
            dataKey = null;
            try {
                global.gc();
            }
            catch (e) { }
            return result;
        });
    }
    /**
     * @api decryptKEK(data) decryptKEK
     * @apiName decrypt-KEK-data
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Decrypt the data by Key-encryption-key (KEK). This function will decrypt your data by your data key which is encrypted by your AWS cmk.
     *
     * @apiParam {Any} data The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.
     * @apiParamExample {json} decryptKEK(js/promise)
     *     config1.get('password_group', { documentName: 'user001' })
     *       .then(result => {
     *         console.log(result);  // { cipher: Buffer<XX XX XX ...>, encryptedKey: Buffer<YY YY YY ...> }
     *         return config1.decryptKEK(result);
     *       })
     *       .then(passwordGroup => console.log(passwordGroup));  // { password: '123456', second_password: 'qwerty' }
     * @apiParamExample {json} decryptKEK(ts/async-promise)
     *     const result = await config1.get<KEKCipher>('password_group', { documentName: 'user001' });
     *     console.log(result);  // { cipher: Buffer<XX XX XX ...>, encryptedKey: Buffer<YY YY YY ...> }
     *     const passwordGroup = await config1.decryptKEK({ password: '123456', second_password: 'qwerty' });
     *     console.log(passwordGroup);  // { password: '123456', second_password: 'qwerty' }
     *
     * @apiSuccess {Type} . The data you encrypted, in exactly same format of what you pass into encryptKEK()
     */
    decryptKEK(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataKey = (yield this.kms.decrypt({ CiphertextBlob: new Buffer(data.encryptedKey, 'base64') }).promise()).Plaintext;
            // decrypt data
            let decryptor = new AES.ModeOfOperation.ctr([...dataKey], new AES.Counter(0)); // convert Buffer data key to BytesArray
            const plainText = AES.utils.utf8.fromBytes(decryptor.decrypt(AES.utils.hex.toBytes(data.cipher))); // convert Buffer cipher text to BytesArray
            // clean up key's data immediately after usage
            dataKey = null;
            decryptor = null;
            try {
                global.gc();
            }
            catch (e) { }
            return JSON.parse(plainText);
        });
    }
}
exports.default = default_1;
