import { Injectable } from '@nestjs/common';
import { MSG91_URL } from 'src/constants/network';
import { APIService } from './api.service';
var http = require('https');

const headers = {
  authkey: process.env.MSG91_AUTH_KEY,
  'content-type': 'application/JSON',
};

@Injectable()
export class Msg91Service {
  constructor(private readonly apiService: APIService) {}

  async KYCverification(mobile, name) {
    if (process.env.SMS_STATUS !== 'TRUE') return;
    try {
      const body = {
        flow_id: process.env.KYC_FLOW_ID,
        mobiles: '91' + mobile,
        name: name,
        sender: 'LNDITT',
      };
      this.apiService.post(MSG91_URL, body, headers);
    } catch (error) {
      return '500';
    }
  }

  async sendOtp(otp, phone) {
    // if (process.env.CRON_STATUS != 'TRUE') {
    //   return;
    // } else {
    var key = 'ntQQ6sKa/8u';
    var otpData = {
      method: 'GET',
      hostname: 'api.msg91.com',
      port: null,
      path: `/api/v5/otp?template_id=60ed946b84c9b56f1d66b926&mobile=91${phone}&authkey=347914A7shVCTrM8fl5fbe2ed6P1&otp=${otp}&extra_param=%7B%22OTP%22%3A%22${otp}%22%2C%22KEY%22%3A%22ntQQ6sKa%5C%2F8u%22%7D`,
      headers: {
        'content-type': 'application/json',
      },
    };
    var req = http.request(otpData, function (res) {
      var chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        var body = Buffer.concat(chunks);
      });
    });

    req.write(JSON.stringify({ OTP: otp, KEY: key }));
    req.end();
    // }
  }
}
