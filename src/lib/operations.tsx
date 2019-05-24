import { Scenario, ScenarioStep } from './types';

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
  params?: {} | null;
  data?: {} | null;
};

async function request({ url, method, headers = null, params = null, data = null }: RequestParams): Promise<Result> {

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

function getUrl(scenario: Scenario, url: string) {
  return scenario.configuration.apiUrl + '/' + url;
}

function getApiKey(scenario: Scenario) {
  return scenario.configuration.apiKey;
}

function getApiKeyHeaders(scenario: Scenario, step: ScenarioStep) {
  const apiKey = getApiKey(scenario);
  const headers = {}; headers[apiKey] = step.data.token;

  return headers;
}

// OPERATIONS

const operations: any = {};

operations.ping = async (scenario: Scenario, step: ScenarioStep): Promise<Result> => {
  return await request({url: getUrl(scenario, `ping`), method: 'GET'});
};

operations.createUser = async (scenario: Scenario, step: ScenarioStep): Promise<Result> => {
  return await request({url: getUrl(scenario, `user`), method: 'POST', data: step.data});
};

operations.getUser = async (scenario: Scenario, step: ScenarioStep): Promise<Result> => {
  const url = getUrl(scenario, `user`) + '/' + step.data.user_id;

  return await request({url, method: 'GET', headers: getApiKeyHeaders(scenario, step)});
};

export default operations;

