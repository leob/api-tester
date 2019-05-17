import config from '../config';

import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

const URL = config.API_URL;

export type Result = {
  isError: boolean;
  data?: any;
  status?: number;
  error?: Error;
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
    const error: Error = e;

    return { isError: true, error };
  }
}

const operations: any = {};

operations.ping = async (): Promise<Result> => {
  return await request({url: `${URL}/ping`, method: 'GET', omitDefaultHeaders: true});
};

export default operations;
