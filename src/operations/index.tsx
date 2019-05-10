import config from '../config';

import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

const URL = config.API_URL;

export type Result = {
  isError: true,
  error: Error
} | {
  isError: false,
  data: any,
  status: number
};

async function request(
  {url, method, headers = null, omitDefaultHeaders = false, params = null, data = null}): Promise<Result> {

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
  //   return axios.get(
  //   `${config.API_URL}/ping`
  // )
  return await request({url: `${URL}/ping`, method: 'GET', omitDefaultHeaders: true});
};

export default operations;

