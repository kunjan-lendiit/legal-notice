import { HttpService, Injectable } from '@nestjs/common';
import * as env from 'dotenv';
import * as Razorpay from 'razorpay';
import { RAZORPAY_API_URL, RAZORPAY_CALLBACK_URL } from 'src/constants/network';
import { APIService } from './api.service';
import { CommonService } from './common.service';

env.config();

@Injectable()
export class RazorpayService {
  razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_ID,
    key_secret: process.env.RAZOR_PAY_KEY,
  });

  constructor(
    private readonly apiService: APIService,
    private readonly commonService: CommonService,
  ) {}

  async fetchPaymemtByPaymentid(paymentId: string): Promise<any> {
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      return null;
    }
  }

  // async createOrder(orderData: RazorOrderCreate): Promise<any> {
  //   return await this.razorpay.orders.create(orderData);
  // }

  async fetchCardDetails(payment_id: string): Promise<any> {
    return await this.apiService.get(
      `${RAZORPAY_API_URL}payments/${payment_id}/?expand[]=card`,
      undefined,
      undefined,
      {
        auth: {
          username: process.env.RAZOR_PAY_ID,
          password: process.env.RAZOR_PAY_KEY,
        },
      },
    );
  }

  async fetchOrderByOrderid(orderId: string) {
    return await this.razorpay.orders.fetch(orderId);
  }

  // async fetchPaymentFromOrderId(orderId: string) {
  //   return await this.razorpay.orders.fetchPayments(orderId);
  // }

  // async createPayout(payoutData) {
  //   return await this.httpService
  //     .post(`https://api.razorpay.com/v1/payouts`, payoutData, {
  //       auth: {
  //         username: this.key_id,
  //         password: this.key_secret,
  //       },
  //     })
  //     .toPromise();
  // }

  async fetchPayoutById(payoutId: string) {
    return await this.apiService.get(
      `${RAZORPAY_API_URL}payouts/${payoutId}`,
      undefined,
      undefined,
      {
        auth: {
          username: process.env.RAZOR_PAY_ID,
          password: process.env.RAZOR_PAY_KEY,
        },
      },
    );
  }

  // async cancelPayoutById(payoutId: string) {
  //   return await this.httpService
  //     .post(`https://api.razorpay.com/v1/payouts/${payoutId}/cancel`, null, {
  //       auth: {
  //         username: this.key_id,
  //         password: this.key_secret,
  //       },
  //     })
  //     .toPromise();
  // }

  // async createPaylink(paylinkData: CreatePaylink) {
  //   return await this.httpService
  //     .post(`https://api.razorpay.com/v1/payment_links/`, paylinkData, {
  //       auth: {
  //         username: this.key_id,
  //         password: this.key_secret,
  //       },
  //     })
  //     .toPromise();
  // }

  // async fetchPaylink(paylinkId: string) {
  //   return await this.httpService
  //     .get(`https://api.razorpay.com/v1/payment_links/${paylinkId}`, {
  //       auth: {
  //         username: this.key_id,
  //         password: this.key_secret,
  //       },
  //     })
  //     .toPromise();
  // }

  async createRazorPaylink(
    amount: number,
    loanId: number,
    userInfo: any,
    smsStatus = false,
  ) {
    const date = new Date();
    date.setMinutes(24.5 * 60);
    const unixDate = parseInt((date.getTime() / 1000).toFixed(0));
    const payRequest = {
      customer: {
        name: userInfo.fullName,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      reminder_enable: smsStatus === true ? true : false,
      email_notify: smsStatus === true ? true : false,
      sms_notify: smsStatus === true ? true : false,
      type: 'link',
      amount: amount * 100,
      currency: 'INR',
      description: `EMI payment against loan id - ${loanId}`,
      receipt: this.commonService.getRandomId(),
      callback_url: RAZORPAY_CALLBACK_URL,
      callback_method: 'get',
      expire_by: unixDate,
    };
    try {
      return await this.apiService.post(
        `${RAZORPAY_API_URL}invoices/`,
        payRequest,
        undefined,
        {
          username: process.env.RAZOR_PAY_ID,
          password: process.env.RAZOR_PAY_KEY,
        },
      );
    } catch (error) {
      return null;
    }
  }

  async getPaymentStatus(receiptId: string) {
    try {
      return await this.apiService.get(
        `${RAZORPAY_API_URL}invoices/${receiptId}`,
        undefined,
        undefined,
        {
          auth: {
            password: process.env.RAZOR_PAY_KEY,
            username: process.env.RAZOR_PAY_ID,
          },
        },
      );
    } catch (error) {
      return null;
    }
  }

  async getPaymentDetails(payment_id: string): Promise<any> {
    try {
      return await this.apiService.get(
        `${RAZORPAY_API_URL}payments/${payment_id}/?expand[]=card`,
        undefined,
        undefined,
        {
          auth: {
            password: process.env.RAZOR_PAY_KEY,
            username: process.env.RAZOR_PAY_ID,
          },
        },
      );
    } catch (error) {
      return null;
    }
  }
}
