import Configuration from './index';
import { GetConfigurationRequestParam } from './types';
import { Lambda } from 'aws-sdk';

type SampleConfig = {
  key1: string;
  key2: boolean;
  key3: number;
}

describe('aws-lambda-configuration-js library', () => {
  let config: Configuration;
  beforeAll(() => {
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
          expect(payload.type).toBe('get');
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
          expect(payload.type).toBe('get');
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
  });

  describe('get fresh config & defualt options', async () => {
    it('should use the set optinos to get fresh config', async () => {
      config = new Configuration({
        tableName: 'tableB',
        documentName: 'documentB',
        functionName: 'lambdaB',
      });

      config.lambda = <any>{
        invoke: (params: Lambda.InvocationRequest) => {
          expect(params.FunctionName).toBe('lambdaB');
          const payload: GetConfigurationRequestParam = JSON.parse(<string> params.Payload);
          expect(payload.tableName).toBe('tableB');
          expect(payload.documentName).toBe('documentB');
          expect(payload.key).toBe('sampleConfigB');
          expect(payload.noCache).toBe(true);
          expect(payload.type).toBe('get');
          const result = 'sampleValueB';
          return { promise: () => Promise.resolve({ StatusCode: 200, Payload: JSON.stringify(result) }) };
        }
      };
      const sampleConfig = await config.getFresh<string>('sampleConfigB');
      expect(sampleConfig).toBe('sampleValueB');
    });
  });
})

