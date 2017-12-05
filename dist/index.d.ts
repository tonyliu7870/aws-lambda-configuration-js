import { Lambda, KMS, DynamoDB } from 'aws-sdk';
import { Options, KEKCipher } from './types';
export default class  {
    lambda: Lambda;
    kms: KMS;
    dynamo: DynamoDB.DocumentClient;
    private functionName;
    private tableName;
    private documentName;
    private cmk;
    /**
     * @api constructor(options) constructor
     * @apiName constructor
     * @apiVersion 2.0.0
     * @apiGroup Initialization
     * @apiDescription Initialization
     *
     * @apiParam {Options} [options] The options to construct library. Will override the original default settings
     * @apiParam {String} [options.functionName="lambda-configuration"] The core configuration lambda function name
     * @apiParam {String} [options.tableName="lambda-configurations"] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName="settings"] The document name to access the configurations
     * @apiParam {String} [options.cmk="alias/lambda-configuration-key"] Customer Master Key (CMK). The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a "alias/", i.e. "alias/my-key".
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
     *       documentName: 'my-configuration',
     *       cmk: 'alias/my-key-for-lambda'
     *     })
     */
    constructor(options?: Partial<Options>);
    /**
     * @api get<T>(key,options) get
     * @apiName get-config
     * @apiVersion 2.0.0
     * @apiGroup Get Configuration
     * @apiDescription Get one specific config or the whole configuration document
     *
     * @apiParam {Type} T The type of configuration you are getting, available in typescript
     * @apiParam {String} [key] The sub-path to your configuration. The library will resolve your key as object path. If the key containing a ".", you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will get the whole configuration object
     * @apiParam {object} [options] The options to this get configuration request
     * @apiParam {String} [options.functionName=lambda-configuration] The core configuration lambda function name
     * @apiParam {String} [options.tableName=lambda-configurations] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName=settings] The document name to get the configurations
     * @apiParam {String="direct","core","cache"} [options.mode="cache"] Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core.
     *
     * @apiParamExample {js} get-single-config-with-cache(js/promise)
     *     config1.get('version').then((serverVerison) => {
     *       console.log(serverVerison);
     *     });
     * @apiParamExample {js} get-whole-config-directly(ts/async-await)
     *     type ConfigModel = {
     *       version: string;
     *       ...
     *       ...
     *       ...
     *     }
     *     const myConfig = await config1.get<ConfigModel>({ mode: 'direct' });
     *     console.log(myConfig.version);
     * @apiParamExample {js} path-with-a-dot
     *     config1.get(["subObj", "key.with.dot"]).then((result) => {
     *       console.log(result);    // 1234
     *     })
     *
     * @apiSuccess {Type} . The configuration stored.
     * @apiSuccessExample {String} with-key
     *     "user001"
     * @apiSuccessExample {json} without-key
     *     {
     *       "userId": "user001",
     *       "password_group": {
     *         "cipher": "abcdefghij...",    // a base64 string
     *         "encryptedKey": "KLMNOPQ..."  // a base64 string
     *       },
     *       "something": ["else", true, 1234],
     *       "subObj": {
     *         "key.with.dot": 1234
     *       }
     *     }
     */
    get<T>(key?: string | string[], options?: Partial<Options>): Promise<T | undefined>;
    /**
     * Get config though aws-lambda-configuration-core. Recommended to use get(____, { mode: 'core' }) or get(____, { mode: 'cache' })
     */
    private getByCore<T>(key?, options?);
    /**
     * Get config directly from dynamoDB. Recommended to use get(____, { mode: 'direct' })
     */
    private getDirect<T>(key?, options?);
    /**
     * @api has(key,options) has
     * @apiName has-config
     * @apiVersion 2.0.0
     * @apiGroup Get Configuration
     * @apiDescription Check if the configuration exists. It is useful to reduce data transmission between lambdas & database when you only want to check if it exists.
     *
     * @apiParam {String} [key] The sub-path to your configuration. The library will resolve your key as object path. If the key containing a ".", you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will check if the document exist
     * @apiParam {object} [options] The options to this check configuration request
     * @apiParam {String} [options.functionName="lambda-configuration"] The core configuration lambda function name
     * @apiParam {String} [options.tableName="lambda-configurations"] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName="settings"] The document name to check the configurations
     * @apiParam {String="direct","core","cache"} [options.mode="cache"] Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core.
     *
     * @apiParamExample {String} has-single-config(js/promise)
     *     config1.has('version').then((isExist) => {
     *       console.log(isExist);  // true
     *     });
     * @apiParamExample {json} has-whole-document(ts/async-await)
     *     const isExist = await config1.has({ documentName: 'tempDocument' });
     *     console.log(isExist); // true
     *
     * @apiSuccess {boolean} . Does the configuration contains the document / the document contains the path
     */
    has(key?: string | string[], options?: Partial<Options>): Promise<boolean>;
    /**
     * Check existence of config though aws-lambda-configuration-core. Recommended to use has(___, { mode: 'core' })
     */
    private hasByCore(key?, options?);
    /**
     * Check existence of config directly from dynamoDB. Recommend to use has(___, { mode: 'direct' })
     */
    private hasDirect(key?, options?);
    /**
     * api hasDocument(options) hasDocument
     * @apiVersion 2.0.0
     * @apiGroup Get Configuration
     * @apiDescription Alias function for check if the configuration document exists. It do the same as has(undefined, options).
     */
    hasDocument(options?: Partial<Options>): Promise<boolean>;
    /**
     * Check existence of configuration document directly from dynamoDB. Recommend to use hasDocument({ mode: 'direct' })
     */
    private hasDocumentDirect(options?);
    /**
     * @api set(data,key,options) set
     * @apiName set-config
     * @apiVersion 2.0.0
     * @apiGroup Set Configuration
     * @apiDescription Set the configuration/Create new document
     *
     * @apiParam {any} data The configuration to store. If key is undefined, this should be an object (unless you really want to store one config per one document). This could happen if you decided to encrypt the whole config document.
     * @apiParam {String} [key] The sub-path to your configuration. The library will resolve your key as object path. If the key containing a ".", you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will create/replace the whole configuration document
     * @apiParam {object} [options] The options to this set configuration request
     * @apiParam {String} [options.functionName="lambda-configuration"] The core configuration lambda function name
     * @apiParam {String} [options.tableName="lambda-configurations"] The DynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName="settings"] The document name to set the configurations
     * @apiParam {String="direct","core"} [options.mode="direct"] Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core
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
     *     await config1.set(data, { documentName: 'my2ndConfiguration' });
     */
    set(data: any, key?: string | string[], options?: Partial<Options>): Promise<void>;
    /**
     * Create/Set config though aws-lambda-configuration-core. Recommend to use set(__, __, { mode: 'core' })
     */
    private setByCore(data, key?, options?);
    /**
     * Create/Set config directly to dynamoDB. Recommend to use set(__, __, { mode: 'direct' })
     */
    private setDirect(data, key?, options?);
    /**
     * @api delete(key,options) delete
     * @apiName delete-config
     * @apiVersion 2.0.0
     * @apiGroup Delete Configuration
     * @apiDescription Delete one specific configuration
     *
     * @apiParam {String} key The property of your configuration. The library will resolve your key as object path. If the key containing a ".", you must pass an String[] to enforce your customized path traversal. You must specify a key(path) to delete one property. If you would like to delete the whole document, use DeleteDocument()
     * @apiParam {object} [options] The options to this delete configuration request
     * @apiParam {String} [options.functionName="lambda-configuration"] The core configuration lambda function name
     * @apiParam {String} [options.tableName="lambda-configurations"] The dynamoDB table name to store all configurations
     * @apiParam {String} [options.documentName="settings"] The document name to delete the configuration
     * @apiParam {String="direct","core"} [options.mode="direct"] Does the library directly delete config from dynamoDB or though aws-lambda-configuration-core
     *
     *
     * @apiParamExample {js} delete-single-config(js/promise)
     *     config1.delete('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-single-config(ts/async-await)
     *     await config1.delete('version');
     */
    delete(key: string | string[], options?: Partial<Options>): Promise<void>;
    /**
     * Delete config though aws-lambda-configuration-core. Recommend to use delete(___, { mode: 'core' });
     */
    private deleteByCore(key, options?);
    /**
     * Delete config directly from dynamoDB. Recommend to use delete(___, { mode: 'direct' })
     */
    private deleteDirect(key, options?);
    /**
     * @api deleteDocument(documentName,options) deleteDocument
     * @apiName delete-whole-configuration
     * @apiVersion 2.0.0
     * @apiGroup Delete Configuration
     * @apiDescription Delete the whole configuration
     *
     * @apiParam {String} documentName The name of your configuration. You must specify the documentName. Default value is not applicable here. If you would like to delete only one property in a document, use delete()
     * @apiParam {object} [options] The options to this delete configuration request
     * @apiParam {String} [options.functionName="lambda-configuration"] The core configuration lambda function name
     * @apiParam {String} [options.tableName="lambda-configurations"] The DynamoDB table name to store all configurations
     * @apiParam {String="direct","core"} [options.mode="direct"] Does the library directly access dynamoDB or though aws-lambda-configuration-core
     *
     * @apiParamExample {js} delete-whole-config(js/promise)
     *     config1.deleteDocument('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-whole-config(ts/async-await)
     *     await config1.deleteDocument('version');
     */
    deleteDocument(documentName: string, options?: Partial<Options>): Promise<void>;
    /**
     * Delete configuration document though aws-lambda-configuration-core. Recommend to use deleteDocument(____, { mode: 'core' })
     */
    private deleteDocumentByCore(documentName, options?);
    /**
     * Delete configuration document directly from dynamoDB. Recommend to use deleteDocument(____, { mode: 'direct' })
     */
    private deleteDocumentDirect(documentName, options?);
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
    encrypt(data: any, cmk?: string): Promise<String>;
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
    decrypt<T>(data: string): Promise<T>;
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
    encryptKEK(data: any, cmk?: string): Promise<KEKCipher>;
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
    decryptKEK<T>(data: KEKCipher): Promise<T>;
}
