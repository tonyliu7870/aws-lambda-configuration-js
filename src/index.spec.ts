import Configuration from './index';
import { GetConfigurationRequestParam, CheckConfigurationRequestParam, SetConfigurationRequestParam, DeleteConfigurationRequestParam } from './types';
import { Lambda } from 'aws-sdk';

type SampleConfig = {
  key1: string;
  key2: boolean;
  key3: number;
}

describe('aws-lambda-configuration-js library', () => {
  let config: Configuration;
  beforeEach(() => {
    config = new Configuration();
  });

  describe('get config', async () => {
    it('should use the default setting to get config', async () => {
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
      const sampleConfig = await config.get<string>('sampleConfig');
      expect(sampleConfig).toBe('sampleValue');
    });

    it('should use the new setting to get config', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambdaA');
          const payload: GetConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('tableA');
          expect(payload.documentName).toBe('documentA');
          expect(payload.key).toBe('sampleConfigA')
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
        noCache: true,
      });
      expect(sampleConfig.key1).toBe('a');
      expect(sampleConfig.key2).toBe(true);
      expect(sampleConfig.key3).toBe(123);
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

      const result = await config.getDirect<object>();
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

      const result = await config.getDirect<string>('key1.key2');
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

      const result = await config.getDirect<string>(['key1', 'key2a.key2b', 'key3']);
      expect(result).toBe('hello world');
    });
  });

  // describe('get fresh config & defualt options', async () => {
  //   it('should use the set options to get fresh config', async () => {
  //     config = new Configuration({
  //       tableName: 'tableB',
  //       documentName: 'documentB',
  //       functionName: 'lambdaB',
  //     });

  //     config.lambda = <any>{
  //       invoke: (params: Lambda.InvocationRequest) => {
  //         expect(params.FunctionName).toBe('lambdaB');
  //         const payload: GetConfigurationRequestParam = JSON.parse(<string> params.Payload);
  //         expect(payload.tableName).toBe('tableB');
  //         expect(payload.documentName).toBe('documentB');
  //         expect(payload.key).toBe('sampleConfigB');
  //         expect(payload.noCache).toBe(true);
  //         expect(payload.type).toBe('GET');
  //         const result = 'sampleValueB';
  //         return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
  //       }
  //     };
  //     const sampleConfig = await config.getFresh<string>('sampleConfigB');
  //     expect(sampleConfig).toBe('sampleValueB');
  //   });
  // });

  describe('has config', async () => {
    it('should check if the config exists', async () => {
      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambda-configuration');
          const payload: CheckConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('lambda-configurations');
          expect(payload.documentName).toBe('settings');
          expect(payload.key).toBe('sampleConfig');
          expect(payload.type).toBe('CHECK');
          const result = false;
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.has('sampleConfig');
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

      const result = await config.hasDirect('key1');
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

      const result = await config.hasDirect();
      expect(result).toBe(true);
    });
  });

  describe('set config', async () => {
    it('should put the config', async () => {
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
      await config.set({ sampleConfig: { subConfig: 'subValue' } });
    });
  });

  describe('delete config', async () => {
    it('should delete one specific config', async () => {
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
      await config.delete('outDatedConfig');
    });

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
      await config.deleteDocument('temp_config');
    });
  });
})

