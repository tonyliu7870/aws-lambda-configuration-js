import Configuration from './index';
import { Mode, GetConfigurationRequestParam, CheckConfigurationRequestParam, SetConfigurationRequestParam, DeleteConfigurationRequestParam } from './types';
import { Lambda } from 'aws-sdk';

type SampleConfig = {
  key1: string;
  key2: boolean;
  key3: number;
}

describe('aws-lambda-configuration-js library', () => {
  let config: Configuration;
  let _originalConsoleError: any;
  beforeEach(() => {
    _originalConsoleError = console.error;
    config = new Configuration();
  });
  afterEach(() => {
    console.error = _originalConsoleError;
  });

  describe('constructor', () => {
    it('initialization with default', () => {
      config = new Configuration();
      expect((config as any).functionName).toBe('lambda-configuration');
      expect((config as any).tableName).toBe('lambda-configurations');
      expect((config as any).documentName).toBe('settings');
      expect((config as any).cmk).toBe('alias/lambda-configuration-key');
    });

    it('initialization with options', () => {
      config = new Configuration({
        functionName: 'my-function',
        tableName: 'my-table',
        documentName: 'my-document',
        cmk: 'alias/my-key'
      });
      expect((config as any).functionName).toBe('my-function');
      expect((config as any).tableName).toBe('my-table');
      expect((config as any).documentName).toBe('my-document');
      expect((config as any).cmk).toBe('alias/my-key');
    });
  });

  describe('get config', async () => {
    it('should get config from core', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: GetConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.key).toBe('sampleConfig');
          expect(payload.noCache).toBeFalsy();
          expect(payload.type).toBe('GET');
          const result = 'sampleValue';
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.get<string>('sampleConfig', { mode: Mode.Cache });
      expect(sampleConfig).toBe('sampleValue');
    });

    it('should get config from core', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambdaA');
          const payload: GetConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('tableA');
          expect(payload.documentName).toBe('documentA');
          expect(payload.key).toBe('sampleConfigA');
          expect(payload.noCache).toBe(true);
          expect(payload.type).toBe('GET');
          const result = <SampleConfig> { key1: 'a', key2: true, key3: 123 };
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.get<SampleConfig>('sampleConfigA', {
        tableName: 'tableA',
        documentName: 'documentA',
        functionName: 'lambdaA',
        mode: Mode.Core
      });
      expect(sampleConfig!.key1).toBe('a');
      expect(sampleConfig!.key2).toBe(true);
      expect(sampleConfig!.key3).toBe(123);
    });

    it('should get config from dynamoDB (whole document)', async () => {
      spyOn(config.dynamo, 'get').and.callFake((params: AWS.DynamoDB.DocumentClient.GetItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.ProjectionExpression).toBe('#path0');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({ '#path0': 'data' }));
        const result = { data: { hello: 'world' } };
        return { promise: () => Promise.resolve({ Item: result }) };
      });

      const result = await config.get<object>({ mode: Mode.Direct });
      expect(result).toEqual(<any> jasmine.objectContaining({ hello: 'world' }));
    });

    it('should get config from dynamoDB (string key)', async () => {
      spyOn(config.dynamo, 'get').and.callFake((params: AWS.DynamoDB.DocumentClient.GetItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.ProjectionExpression).toBe('#path0.#path1.#path2');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({
          '#path0': 'data',
          '#path1': 'key1',
          '#path2': 'key2'
        }));
        const result = { data: { key1: { key2: 'hello world' } } };
        return { promise: () => Promise.resolve({ Item: result }) };
      });
      const result = await config.get<string>('key1.key2', { mode: Mode.Direct });
      expect(result).toBe('hello world');
    });

    it('should get config from dynamoDB (array key)', async () => {
      spyOn(config.dynamo, 'get').and.callFake((params: AWS.DynamoDB.DocumentClient.GetItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.ProjectionExpression).toBe('#path0.#path1.#path2.#path3');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({
          '#path0': 'data',
          '#path1': 'key1',
          '#path2': 'key2a.key2b',
          '#path3': 'key3'
        }));
        const result = {data:{key1:{'key2a.key2b':{key3:'hello world'}}}};
        return { promise: () => Promise.resolve({ Item: result }) };
      });

      const result = await config.get<string>(['key1', 'key2a.key2b', 'key3'], { mode: Mode.Direct });
      expect(result).toBe('hello world');
    });
  });

  describe('has config', async () => {
    it('should check config from core (single config)', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: CheckConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.key).toBe('sampleConfig');
          expect(payload.type).toBe('CHECK');
          expect(payload.noCache).toBeTruthy();
          const result = false;
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.has('sampleConfig', { mode: Mode.Core });
      expect(sampleConfig).toBe(false);
    });

    it('should check config from core (whole document)', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: CheckConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.type).toBe('CHECK');
          expect(payload.noCache).toBeFalsy();
          const result = false;
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.has({ mode: Mode.Cache });
      expect(sampleConfig).toBe(false);
    });

    it('should check config from dynamoDB (single config)', async () => {
      spyOn(config.dynamo, 'get').and.callFake((params: AWS.DynamoDB.DocumentClient.GetItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.ProjectionExpression).toBe('#path0.#path1');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({
          '#path0': 'data',
          '#path1': 'key1'
        }));
        return { promise: () => Promise.resolve({ Item: undefined }) };
      });

      const result = await config.has('key1', { mode: Mode.Direct });
      expect(result).toBe(false);
    });

    it('should check config from dynamoDB (document)', async () => {
      spyOn(config.dynamo, 'get').and.callFake((params: AWS.DynamoDB.DocumentClient.GetItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.ProjectionExpression).toBe('configName');
        const result = { configName: 'settings' };
        return { promise: () => Promise.resolve({ Item: result }) };
      });

      const result = await config.has({ mode: Mode.Direct });
      expect(result).toBe(true);
    });

    it('should redirect function to hasDocumentDirect()', async () => {
      const param = { mode: Mode.Direct };
      spyOn(config as any, 'hasDocumentDirect');
      const result = await config.hasDocument(param);
      expect((config as any).hasDocumentDirect).toHaveBeenCalledWith(param);
    });

    it('should redirect function to hasByCore()', async () => {
      spyOn(config as any, 'hasByCore');
      const result = await config.hasDocument({ mode: Mode.Core });
      expect((config as any).hasByCore).toHaveBeenCalledWith(undefined, jasmine.objectContaining({ mode: Mode.Core }));
    });
  });

  describe('set config', async () => {
    it('should put the config to core', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: SetConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.type).toBe('PUT');
          expect(payload.data).toEqual(jasmine.objectContaining({ sampleConfig: { subConfig: 'subValue' } }));
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: null }) };
        }
      };
      await config.set({ sampleConfig: { subConfig: 'subValue' } }, { mode: Mode.Core });
    });

    it('should put the config to dynamoDB (single config)', async () => {
      spyOn(config.dynamo, 'update').and.callFake((params: AWS.DynamoDB.DocumentClient.UpdateItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.UpdateExpression).toEqual('SET #path0.#path1.#path2 = :data');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({ '#path0': 'data', '#path1': 'path1', '#path2': 'path2' }));
        expect(params.ExpressionAttributeValues).toEqual(<any> jasmine.objectContaining({ ':data': 'data' }))
        return { promise: () => Promise.resolve() };
      });

      const result = await config.set('data', ['path1', 'path2']);
    });

    it('should put the config to dynamoDB (whole document)', async () => {
      spyOn(config.dynamo, 'put').and.callFake((params: AWS.DynamoDB.DocumentClient.PutItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Item).toEqual(<any>jasmine.objectContaining({ configName: 'settings', 'data': 'data' }));
        return { promise: () => Promise.resolve() };
      });

      const result = await config.set('data');
    });
  });

  describe('delete config', async () => {
    it('should delete config from core (single config)', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: DeleteConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.type).toBe('DELETE');
          expect(payload.key).toBe('outDatedConfig');
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: null }) };
        }
      };
      await config.delete('outDatedConfig', { mode: Mode.Core });
    });

    it('should delete config from dynamoDB (single config)', async () => {
      spyOn(config.dynamo, 'update').and.callFake((params: AWS.DynamoDB.DocumentClient.UpdateItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(jasmine.objectContaining({ configName: 'settings' }));
        expect(params.UpdateExpression).toEqual('REMOVE #path0.#path1.#path2');
        expect(params.ExpressionAttributeNames).toEqual(<any> jasmine.objectContaining({ '#path0': 'data', '#path1': 'path1', '#path2': 'path2' }));
        return { promise: () => Promise.resolve() };
      });

      const result = await config.delete(['path1', 'path2']);
    });
  });

  describe('delete config document', async () => {
    it('should delete whole document config', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: DeleteConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('temp_config');
          expect(payload.type).toBe('DELETE');
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: null }) };
        }
      };
      await config.deleteDocument('temp_config', { mode: Mode.Core });
    });

    it('should delete config from dynamoDB (whole document)', async () => {
      spyOn(config.dynamo, 'delete').and.callFake((params: AWS.DynamoDB.DocumentClient.DeleteItemInput) => {
        expect(params.TableName).toBe('lambda-configurations');
        expect(params.Key).toEqual(<any>jasmine.objectContaining({ configName: 'temp_config' }));
        return { promise: () => Promise.resolve() };
      });
      await config.deleteDocument('temp_config');
    });
  });

  describe('encryption', async () => {
    it('should log error for invalid aws kms key', async () => {
      spyOn(config.kms, 'encrypt').and.callFake((params: AWS.KMS.EncryptRequest) => {
        if (params.KeyId === 'abc') {
          return { promise: () => Promise.reject({ code: 'NotFoundException', message: 'blah blah blah...' }) };
        }
        return { promise: () => Promise.resolve() };
      });
      spyOn(console, 'error').and.callFake((message: string) => {
        expect(message).toContain('Can not encrypt the data using key:');
      })
      await config.encrypt('data', 'abc').catch(error => {});
    });

    it('should encrypt, decrypt by kms', async () => {
      spyOn(config.kms, 'encrypt').and.callFake((params: AWS.KMS.EncryptRequest) => {
        expect(params.KeyId).toBe('alias/lambda-configuration-key');
        expect(typeof params.Plaintext).toBe('string');
        return { promise: () => Promise.resolve(<AWS.KMS.EncryptResponse>{ CiphertextBlob: new Buffer(params.Plaintext as string)}) };
      });
      spyOn(config.kms, 'decrypt').and.callFake((params: AWS.KMS.DecryptRequest) => {
        return { promise: () => Promise.resolve(<AWS.KMS.DecryptResponse>{ Plaintext: new Buffer(params.CiphertextBlob as string, 'base64')}) };
      });

      const secret = { password: '123', valid: true, second_password: 456 };
      const cipher = await config.encrypt(secret);
      const recover = await config.decrypt(cipher);
      expect(recover).toEqual(jasmine.objectContaining(secret));
    });

    it('should log error for invalid aws kms key', async () => {
      spyOn(config.kms, 'generateDataKey').and.callFake((params: AWS.KMS.GenerateDataKeyRequest) => {
        if (params.KeyId === 'abc') {
          return { promise: () => Promise.reject({ code: 'NotFoundException', message: 'blah blah blah...' }) };
        }
        return { promise: () => Promise.resolve() };
      });
      spyOn(console, 'error').and.callFake((message: string) => {
        expect(message).toContain('Can not generate a random data key under your aws key');
      })
      await config.encryptKEK('data', 'abc').catch(error => {});
    });

    it('should encrypt, decrypt by KEK', async () => {
      spyOn(config.kms, 'generateDataKey').and.callFake((params: AWS.KMS.GenerateDataKeyRequest) => {
        expect(params.KeyId).toBe('alias/lambda-configuration-key');
        expect(params.KeySpec).toBe('AES_256');
        const dataKey = {
          Plaintext: new Buffer(new Array(32).fill(0)),
          CiphertextBlob: new Buffer(new Array(32).fill(1))
        }
        return { promise: () => Promise.resolve(<AWS.KMS.GenerateDataKeyResponse> dataKey) };
      });
      spyOn(config.kms, 'decrypt').and.callFake((params: AWS.KMS.DecryptRequest) => {
        expect(new Buffer(new Array(32).fill(1)).equals(params.CiphertextBlob as Buffer)).toBeTruthy();
        return { promise: () => Promise.resolve(<AWS.KMS.DecryptResponse>{ Plaintext: new Buffer(new Array(32).fill(0))}) };
      });

      const secret = { password: '123', valid: true, second_password: 456 };
      const cipher = await config.encryptKEK(secret);
      const recover = await config.decryptKEK(cipher);
      expect(recover).toEqual(jasmine.objectContaining(secret));
    });
  });
});

