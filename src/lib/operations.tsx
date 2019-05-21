import { Scenario, ScenarioStep, SuccessResultField } from './types';

import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

export type Result = {
  isError: boolean;
  data?: any;
  status?: number;
  error?: Error;
  message?: string;
};

type RequestParams = {
  url: string;
  method: string;
  headers?: {} | null;
  omitDefaultHeaders?: boolean;
  params?: {} | null;
  data?: {} | null;
};

async function request(
  {url, method, headers = null, omitDefaultHeaders = false, params = null, data = null}: RequestParams): Promise<Result> {

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  headers = omitDefaultHeaders ? headers : {...defaultHeaders, ...(headers || {})}

  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      params,
      data
    };

    const result = await axios.request(config);
    return { isError: false, data: result.data, status: result.status };

  } catch (e) {

    if (e.response) {
      const result = e.response;
      return { isError: false, data: result.data, status: result.status };
    }

    const error: Error = e;

    return { isError: true, error, message: error.message };
  }
}

function expectStatus(result: Result, step: ScenarioStep) {
  if (result.isError) {
    return result;
  }

  const httpStatus = step && step.successResult && step.successResult.status ? step.successResult.status : 200;

  if (result.status !== httpStatus) {
    result.isError = true;
    result.message = `Expected HTTP ${httpStatus}, got ${result.status}`;

    return result;
  }

  return result;
}

function expectFields(result: Result, step: ScenarioStep) {
  if (result.isError || !step.successResult || !step.successResult.fields) {
    return result;
  }

  const fields: SuccessResultField[] = step.successResult.fields;
  let field: SuccessResultField;

  for (field of fields) {
    if (!result.data || !result.data[field.name]) {
      result.isError = true;
      result.message = `Expected field ${field} in result.data`;

      return result;
    }
  }

  return result;
}

function getUrl(scenario: Scenario, url: string) {
  return scenario.configuration.url + '/' + url;
}

// OPERATIONS

const operations: any = {};

operations.ping = async (scenario: Scenario, step: ScenarioStep): Promise<Result> => {
  let result = await request({url: getUrl(scenario, `ping`), method: 'GET', omitDefaultHeaders: true});

  return expectStatus(result, step);
};

operations.createUser = async (scenario: Scenario, step: ScenarioStep): Promise<Result> => {
  let result = await request({url: getUrl(scenario, `user`), method: 'POST', data: step.data});

  result = expectStatus(result, step);
  result = expectFields(result, step);

  return result;
};

export default operations;

