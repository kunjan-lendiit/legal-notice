import axios from 'axios';
import { k500Error } from 'src/constants/misc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('request');

export class APIService {
  async post(url: string, body: any = {}, headers: any = {}, auth: any = {}) {
    try {
      const response = await axios.post(url, body, { headers, auth });
      if (!response) return k500Error;
      const result = response.data;
      if (!result) return k500Error;
      return result;
    } catch (error) {
      return k500Error;
    }
  }

  async requestPost(url: string, body: any = {}, headers: any = {}) {
    try {
      const response: any = await new Promise((resolve, reject) => {
        const options = {
          rejectUnauthorized: false,
          method: 'POST',
          body: body,
          url,
          json: true,
          headers: headers,
        };
        request(options, function (error, response, body) {
          if (error) reject(new Error(error));
          resolve(body);
        });
      });
      if (!response) return '500';
      const result = response;
      if (!result) return '500';
      return result;
    } catch (error) {
      return '500';
    }
  }

  async get(
    url: string,
    params: any = {},
    headers: any = {},
    config: any = {},
  ) {
    try {
      const response = await axios.get(url, { headers, params, ...config });
      if (!response) return k500Error;
      const result = response.data;
      if (!result) return k500Error;
      return result;
    } catch (error) {
      return k500Error;
    }
  }
}
