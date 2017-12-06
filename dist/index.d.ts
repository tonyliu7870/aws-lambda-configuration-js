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
    get<T>(options?: Partial<Options>): Promise<T | undefined>;
    get<T>(key?: string | string[], options?: Partial<Options>): Promise<T | undefined>;
    /**
     * Get config though aws-lambda-configuration-core. Recommended to use get(____, { mode: 'core' }) or get(____, { mode: 'cache' })
     */
    private getByCore<T>(key?, options?);
    /**
     * Get config directly from dynamoDB. Recommended to use get(____, { mode: 'direct' })
     */
    private getDirect<T>(key?, options?);
    has(options?: Partial<Options>): Promise<boolean>;
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
    set(data: any, options?: Partial<Options>): Promise<void>;
    set(data: any, key: string | string[], options?: Partial<Options>): Promise<void>;
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
     * @apiDescription Encrypt the data directly though AWS KMS. This function should only be used to encrypt data itself is random, e.g. access token, access secret, etc. If you want to encrypt more predictable data, e.g. user password. Use encryptKEK instead.
     *
     * @apiParam {Any} data The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.
     * @apiParam {String} [cmk=alias/lambda-configuration-key] The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a "alias/", i.e. "alias/my-key".
     * @apiParamExample {js} encrypt-data(js/promise)
     *     config1.encrypt({ jwtToken: 'abcde12345' }).then((cipher) => {
     *       console.log(cipher);  // "ABase64String"
     *     });
     * @apiParamExample {js} encrypt-data(ts/async-await)
     *     const cipher = await config1.encrypt({ jwtToken: 'abcde12345' });
     *     console.log(cipher);  // "ABase64String"
     *
     * @apiSuccess {String} . A buffer contains the encrypted data.
     * @apiSuccessExample {String}
     *     "ABase64String"
     */
    encrypt(data: any, cmk?: string): Promise<String>;
    /**
     * @api decrypt<T>(data) decrypt
     * @apiName decrypt-config
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Decrypt the data directly though AWS KMS
     *
     * @apiParam {String} data The encrypted cipher generated by encrypt()
     * @apiParamExample {js} decrypt(js/promise)
     *     config1.get().then(myConfig => {
     *       return config1.decrypt(myConfig.jwtToken);
     *     }).then(jwtToken => {
     *       console.log(jwtToken);  // "abcde12345"
     *     });
     * @apiParamExample {js} decrypt(ts/async-await)
     *     const myConfig = await config1.get();
     *     const jwtToken = config1.decrypt<string>(myConfig.jwtToken);
     *     console.log(jwtToken);  // "abcde12345"
     *
     * @apiSuccess {Any} . The data you encrypted, in exactly same format of what you pass into encrypt()
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
     *         console.log(result);  // { cipher: "ABase64String", encryptedKey: "ABase64String" }
     *         return config1.set(result, 'password_group', { documentName: 'user001' });
     *       })
     *       .then(() => console.log('change password success'));
     * @apiParamExample {js} encryptKEK(ts/async-promise)
     *     const result = await config1.encryptKEK({ password: '123456', second_password: 'qwerty' });
     *     console.log(result);  // { cipher: "ABase64String", encryptedKey: "ABase64String" }
     *     await config1.set(result, 'password_group', { documentName: 'user001' });
     *     console.log('change password success');
     *
     * @apiSuccess {Buffer} cipher A buffer contains the encrypted data
     * @apiSuccess {Buffer} encryptedKey A buffer contains the data key used to encrypt the data. This key is encrypted by your AWS cmk.
     * @apiSuccessExample {json}
     *     {
     *       "cipher": "ABase64String",
     *       "encryptedKey": "ABase64String"
     *     }
     */
    encryptKEK(data: any, cmk?: string): Promise<KEKCipher>;
    /**
     * @api decryptKEK<T>(data) decryptKEK
     * @apiName decrypt-KEK-data
     * @apiVersion 1.1.0
     * @apiGroup En/Decryption
     * @apiDescription Decrypt the data by Key-encryption-key (KEK). This function will decrypt your data by your data key which is encrypted by your AWS cmk.
     *
     * @apiParam {KEKCiper} data The data to be decrypted
     * @apiParam {String} data.cipher A base 64 encoded cipher of encrypted data
     * @apiParam {String} data.encryptedKey A base 64 encoded of key-encrypted-key
     * @apiParamExample {json} decryptKEK(js/promise)
     *     config1.get('password_group', { documentName: 'user001' })
     *       .then(result => {
     *         console.log(result);  // { cipher: "ABase64String", encryptedKey: "ABase64String" }
     *         return config1.decryptKEK(result);
     *       })
     *       .then(passwordGroup => console.log(passwordGroup));  // { password: '123456', second_password: 'qwerty' }
     * @apiParamExample {json} decryptKEK(ts/async-promise)
     *     const result = await config1.get<KEKCipher>('password_group', { documentName: 'user001' });
     *     console.log(result);  // { cipher: "ABase64String", encryptedKey: "ABase64String" }
     *     const passwordGroup = await config1.decryptKEK({ password: '123456', second_password: 'qwerty' });
     *     console.log(passwordGroup);  // { password: '123456', second_password: 'qwerty' }
     *
     * @apiSuccess {Any} . The data you encrypted, in exactly same format of what you pass into encryptKEK()
     */
    decryptKEK<T>(data: KEKCipher): Promise<T>;
}
