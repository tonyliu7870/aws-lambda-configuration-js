define({ "api": [
  {
    "type": "",
    "url": "delete(key,options)",
    "title": "delete",
    "name": "delete_config",
    "version": "2.0.0",
    "group": "Delete_Configuration",
    "description": "<p>Delete one specific configuration</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The property of your configuration. The library will resolve your key as object path. If the key containing a &quot;.&quot;, you must pass an String[] to enforce your customized path traversal. You must specify a key(path) to delete one property. If you would like to delete the whole document, use DeleteDocument()</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>The options to this delete configuration request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The dynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.documentName",
            "defaultValue": "settings",
            "description": "<p>The document name to delete the configuration</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"direct\"",
              "\"core\""
            ],
            "optional": true,
            "field": "options.mode",
            "defaultValue": "direct",
            "description": "<p>Does the library directly delete config from dynamoDB or though aws-lambda-configuration-core</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "delete-single-config(js/promise)",
          "content": "config1.delete('version').then(() => {\n  console.log('done');\n});",
          "type": "js"
        },
        {
          "title": "delete-single-config(ts/async-await)",
          "content": "await config1.delete('version');",
          "type": "js"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Delete_Configuration"
  },
  {
    "type": "",
    "url": "deleteDocument(documentName,options)",
    "title": "deleteDocument",
    "name": "delete_whole_configuration",
    "version": "2.0.0",
    "group": "Delete_Configuration",
    "description": "<p>Delete the whole configuration</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "documentName",
            "description": "<p>The name of your configuration. You must specify the documentName. Default value is not applicable here. If you would like to delete only one property in a document, use delete()</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>The options to this delete configuration request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The DynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"direct\"",
              "\"core\""
            ],
            "optional": true,
            "field": "options.mode",
            "defaultValue": "direct",
            "description": "<p>Does the library directly access dynamoDB or though aws-lambda-configuration-core</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "delete-whole-config(js/promise)",
          "content": "config1.deleteDocument('version').then(() => {\n  console.log('done');\n});",
          "type": "js"
        },
        {
          "title": "delete-whole-config(ts/async-await)",
          "content": "await config1.deleteDocument('version');",
          "type": "js"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Delete_Configuration"
  },
  {
    "type": "",
    "url": "decryptKEK<T>(data)",
    "title": "decryptKEK",
    "name": "decrypt_KEK_data",
    "version": "1.1.0",
    "group": "En_Decryption",
    "description": "<p>Decrypt the data by Key-encryption-key (KEK). This function will decrypt your data by your data key which is encrypted by your AWS cmk.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "KEKCiper",
            "optional": false,
            "field": "data",
            "description": "<p>The data to be decrypted</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.cipher",
            "description": "<p>A base 64 encoded cipher of encrypted data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.encryptedKey",
            "description": "<p>A base 64 encoded of key-encrypted-key</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "decryptKEK(js/promise)",
          "content": "config1.get('password_group', { documentName: 'user001' })\n  .then(result => {\n    console.log(result);  // { cipher: \"ABase64String\", encryptedKey: \"ABase64String\" }\n    return config1.decryptKEK(result);\n  })\n  .then(passwordGroup => console.log(passwordGroup));  // { password: '123456', second_password: 'qwerty' }",
          "type": "js"
        },
        {
          "title": "decryptKEK(ts/async-promise)",
          "content": "const result = await config1.get<KEKCipher>('password_group', { documentName: 'user001' });\nconsole.log(result);  // { cipher: \"ABase64String\", encryptedKey: \"ABase64String\" }\nconst passwordGroup = await config1.decryptKEK(result);\nconsole.log(passwordGroup);  // { password: '123456', second_password: 'qwerty' }",
          "type": "js"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": ".",
            "description": "<p>The data you encrypted, in exactly same format of what you pass into encryptKEK()</p>"
          }
        ]
      }
    },
    "filename": "src/index.ts",
    "groupTitle": "En_Decryption"
  },
  {
    "type": "",
    "url": "decrypt<T>(data)",
    "title": "decrypt",
    "name": "decrypt_config",
    "version": "1.1.0",
    "group": "En_Decryption",
    "description": "<p>Decrypt the data directly though AWS KMS</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The encrypted cipher generated by encrypt()</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "decrypt(js/promise)",
          "content": "config1.get().then(myConfig => {\n  return config1.decrypt(myConfig.jwtToken);\n}).then(jwtToken => {\n  console.log(jwtToken);  // \"abcde12345\"\n});",
          "type": "js"
        },
        {
          "title": "decrypt(ts/async-await)",
          "content": "const myConfig = await config1.get();\nconst jwtToken = config1.decrypt<string>(myConfig.jwtToken);\nconsole.log(jwtToken);  // \"abcde12345\"",
          "type": "js"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Any",
            "optional": false,
            "field": ".",
            "description": "<p>The data you encrypted, in exactly same format of what you pass into encrypt()</p>"
          }
        ]
      }
    },
    "filename": "src/index.ts",
    "groupTitle": "En_Decryption"
  },
  {
    "type": "",
    "url": "encryptKEK(data,cmk)",
    "title": "encryptKEK",
    "name": "encrypt_KEK_data",
    "version": "1.1.0",
    "group": "En_Decryption",
    "description": "<p>Encrypt the data by Key-encryption-key (KEK). This function will encrypt your data by a new random key which is encrypted by your AWS cmk. If the data itself is random, non-predictable, non-structural, non-repeat, you MAY use encrypt() for simplicity.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "data",
            "description": "<p>The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cmk",
            "defaultValue": "alias/lambda-configuration-key",
            "description": "<p>The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a &quot;alias/&quot;, i.e. &quot;alias/my-key&quot;.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "encryptKEK(js/promise)",
          "content": "config1.encryptKEK({ password: '123456', second_password: 'qwerty' })\n  .then(result => {\n    console.log(result);  // { cipher: \"ABase64String\", encryptedKey: \"ABase64String\" }\n    return config1.set(result, 'password_group', { documentName: 'user001' });\n  })\n  .then(() => console.log('change password success'));",
          "type": "js"
        },
        {
          "title": "encryptKEK(ts/async-promise)",
          "content": "const result = await config1.encryptKEK({ password: '123456', second_password: 'qwerty' });\nconsole.log(result);  // { cipher: \"ABase64String\", encryptedKey: \"ABase64String\" }\nawait config1.set(result, 'password_group', { documentName: 'user001' });\nconsole.log('change password success');",
          "type": "js"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cipher",
            "description": "<p>A base64 encoded string contains the encrypted data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "encryptedKey",
            "description": "<p>A base64 encoded string contains the data key used to encrypt the data. This key is encrypted by your AWS cmk.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Cipher-object",
          "content": "{\n  \"cipher\": \"ABase64String\",\n  \"encryptedKey\": \"ABase64String\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "En_Decryption"
  },
  {
    "type": "",
    "url": "encrypt(data,cmk)",
    "title": "encrypt",
    "name": "encrypt_config",
    "version": "1.1.0",
    "group": "En_Decryption",
    "description": "<p>Encrypt the data directly though AWS KMS. This function should only be used to encrypt data itself is random, e.g. access token, access secret, etc. If you want to encrypt more predictable data, e.g. user password. Use encryptKEK instead.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Any",
            "optional": false,
            "field": "data",
            "description": "<p>The data to be encrypted. The data can be in arbitrarily format, the library will do serialization for you.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "cmk",
            "defaultValue": "alias/lambda-configuration-key",
            "description": "<p>The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a &quot;alias/&quot;, i.e. &quot;alias/my-key&quot;.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "encrypt-data(js/promise)",
          "content": "config1.encrypt({ jwtToken: 'abcde12345' }).then((cipher) => {\n  console.log(cipher);  // \"ABase64String\"\n});",
          "type": "js"
        },
        {
          "title": "encrypt-data(ts/async-await)",
          "content": "const cipher = await config1.encrypt({ jwtToken: 'abcde12345' });\nconsole.log(cipher);  // \"ABase64String\"",
          "type": "js"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": ".",
            "description": "<p>A base64 encoded string contains the encrypted data.</p>"
          }
        ]
      }
    },
    "filename": "src/index.ts",
    "groupTitle": "En_Decryption"
  },
  {
    "version": "2.0.0",
    "group": "Get_Configuration",
    "description": "<p>Alias function for check if the configuration document exists. It do the same as has(undefined, options).</p>",
    "type": "",
    "url": "",
    "filename": "src/index.ts",
    "groupTitle": "Get_Configuration",
    "name": ""
  },
  {
    "type": "",
    "url": "get<T>(key,options)",
    "title": "get",
    "name": "get_config",
    "version": "2.0.0",
    "group": "Get_Configuration",
    "description": "<p>Get one specific config or the whole configuration document</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Type",
            "optional": false,
            "field": "T",
            "description": "<p>The type of configuration you are getting, available in typescript</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The sub-path to your configuration. The library will resolve your key as object path. If the key containing a &quot;.&quot;, you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will get the whole configuration object</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>The options to this get configuration request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The DynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.documentName",
            "defaultValue": "settings",
            "description": "<p>The document name to get the configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"direct\"",
              "\"core\"",
              "\"cache\""
            ],
            "optional": true,
            "field": "options.mode",
            "defaultValue": "direct",
            "description": "<p>Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "get-single-config-direct(js/promise)",
          "content": "config1.get('version').then((serverVerison) => {\n  console.log(serverVerison);\n});",
          "type": "js"
        },
        {
          "title": "get-whole-config-with-cache(ts/async-await)",
          "content": "type ConfigModel = {\n  version: string;\n  ...\n  ...\n  ...\n}\nconst myConfig = await config1.get<ConfigModel>({ mode: 'cache' });\nconsole.log(myConfig.version);",
          "type": "js"
        },
        {
          "title": "path-with-a-dot",
          "content": "config1.get([\"subObj\", \"key.with.dot\"]).then((result) => {\n  console.log(result);    // 1234\n})",
          "type": "js"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Type",
            "optional": false,
            "field": ".",
            "description": "<p>The configuration stored.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "with-key",
          "content": "\"user001\"",
          "type": "String"
        },
        {
          "title": "without-key",
          "content": "{\n  \"userId\": \"user001\",\n  \"password_group\": {\n    \"cipher\": \"abcdefghij...\",    // a base64 string\n    \"encryptedKey\": \"KLMNOPQ...\"  // a base64 string\n  },\n  \"something\": [\"else\", true, 1234],\n  \"subObj\": {\n    \"key.with.dot\": 1234\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Get_Configuration"
  },
  {
    "type": "",
    "url": "has(key,options)",
    "title": "has",
    "name": "has_config",
    "version": "2.0.0",
    "group": "Get_Configuration",
    "description": "<p>Check if the configuration exists. It is useful to reduce data transmission between lambdas &amp; database when you only want to check if it exists.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The sub-path to your configuration. The library will resolve your key as object path. If the key containing a &quot;.&quot;, you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will check if the document exist</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>The options to this check configuration request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The DynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.documentName",
            "defaultValue": "settings",
            "description": "<p>The document name to check the configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"direct\"",
              "\"core\"",
              "\"cache\""
            ],
            "optional": true,
            "field": "options.mode",
            "defaultValue": "direct",
            "description": "<p>Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "has-single-config(js/promise)",
          "content": "config1.has('version').then((isExist) => {\n  console.log(isExist);  // true\n});",
          "type": "String"
        },
        {
          "title": "has-whole-document(ts/async-await)",
          "content": "const isExist = await config1.has({ documentName: 'tempDocument' });\nconsole.log(isExist); // true",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": ".",
            "description": "<p>Does the configuration contains the document / the document contains the path</p>"
          }
        ]
      }
    },
    "filename": "src/index.ts",
    "groupTitle": "Get_Configuration"
  },
  {
    "type": "",
    "url": "constructor(options)",
    "title": "constructor",
    "name": "constructor",
    "version": "2.0.0",
    "group": "Initialization",
    "description": "<p>Initialization</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Options",
            "optional": true,
            "field": "options",
            "description": "<p>The options to construct library. Will override the original default settings</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The DynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.documentName",
            "defaultValue": "settings",
            "description": "<p>The document name to access the configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.cmk",
            "defaultValue": "alias/lambda-configuration-key",
            "description": "<p>Customer Master Key (CMK). The id/arn/alias of key in AWS KMS to encrypt to data. If a alias name is supplied, prepend a &quot;alias/&quot;, i.e. &quot;alias/my-key&quot;.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "construction(js)",
          "content": "const Config = require('aws-lambda-configuration-js').default;\nconst config1 = new Config();",
          "type": "js"
        },
        {
          "title": "construction(ts)",
          "content": "import Config from 'aws-lambda-configuration-js';\nconst config1 = new Config();",
          "type": "js"
        },
        {
          "title": "with-options",
          "content": "import Config from 'aws-lambda-configuration-js';\nconst config1 = new Config({\n  functionName: 'my-lambda',\n  tableName: 'my-table',\n  documentName: 'my-configuration',\n  cmk: 'alias/my-key-for-lambda'\n})",
          "type": "js"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Initialization"
  },
  {
    "type": "",
    "url": "set(data,key,options)",
    "title": "set",
    "name": "set_config",
    "version": "2.0.0",
    "group": "Set_Configuration",
    "description": "<p>Set the configuration/Create new document</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "any",
            "optional": false,
            "field": "data",
            "description": "<p>The configuration to store. If key is undefined, this should be an object (unless you really want to store one config per one document). This could happen if you decided to encrypt the whole config document.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The sub-path to your configuration. The library will resolve your key as object path. If the key containing a &quot;.&quot;, you must pass an String[] to enforce your customized path traversal. Skip the parameter or leave undefined will create/replace the whole configuration document</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>The options to this set configuration request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.functionName",
            "defaultValue": "lambda-configuration",
            "description": "<p>The core configuration lambda function name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.tableName",
            "defaultValue": "lambda-configurations",
            "description": "<p>The DynamoDB table name to store all configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.documentName",
            "defaultValue": "settings",
            "description": "<p>The document name to set the configurations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"direct\"",
              "\"core\""
            ],
            "optional": true,
            "field": "options.mode",
            "defaultValue": "direct",
            "description": "<p>Does the library directly access the dynamoDB or invoke aws-lambda-configuration-core</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "set-single-config(js/promise)",
          "content": "const data = 'HI, This is my secret';\nconfig1.set(data, 'additionField').then(() => {\n  console.log('done');\n});",
          "type": "js"
        },
        {
          "title": "create-new-config(ts/async-await)",
          "content": "type ConfigModel = {\n  a: string;\n  c: number;\n  d: boolean;\n  ...\n}\nconst data: ConfigModel = { a: 'b', c: 1, d: true, f: ['i', 'jk'] };\nawait config1.set(data, { documentName: 'my2ndConfiguration' });",
          "type": "js"
        }
      ]
    },
    "filename": "src/index.ts",
    "groupTitle": "Set_Configuration"
  }
] });
