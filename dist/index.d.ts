import { Lambda, KMS } from 'aws-sdk';
import { Options, KEKCipher } from './types';
export default class  {
    lambda: Lambda;
    kms: KMS;
    private functionName;
    private tableName;
    private documentName;
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
    get<T>(key?: string, options?: Partial<Options>): Promise<T>;
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
    getFresh<T>(key?: string, options?: Partial<Options>): Promise<T>;
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
    has(key?: string, options?: Partial<Options>): Promise<boolean>;
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
     * @apiParamExample {js} delete-single-config(js/promise)
     *     config1.delete('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-single-config(ts/async-await)
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
     * @apiParamExample {js} delete-whole-config(js/promise)
     *     config1.deleteDocument('version').then(() => {
     *       console.log('done');
     *     });
     * @apiParamExample {js} delete-whole-config(ts/async-await)
     *     await config1.deleteDocument('version');
     */
    deleteDocument(documentName: string, options?: Partial<Options>): Promise<void>;
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
