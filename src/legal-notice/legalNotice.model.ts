import { EmiEntity } from 'src/entities/emi.entity';
import { loanTransaction } from 'src/entities/loan.entity';
import { PartialEntity } from 'src/entities/partial.entity';

export class LegalNoticeModel {
  id: number;
  userId: string;
  approvedDuration: string = '';
  approvedLoanAmount: number = 0;
  fullName: string = '';
  email: string = '';
  phone: string = '';
  aadharAddress: string = '';
  panNumber: string = '';
  utr: string = '';
  ifsc: string = '';
  account_number: string = '';
  bank_name: string = '';
  disbursementDate: Date;
  emiList: EMIModel[] = [];
  partialList: PartPayModel[] = [];
  partpayAmount: number = 0;
  toLoanData(data: loanTransaction) {
    let legalnoticeData: LegalNoticeModel = new LegalNoticeModel();
    try {
      legalnoticeData.id = data.id;
      legalnoticeData.userId = data.userId;
      legalnoticeData.approvedLoanAmount = Math.floor(
        +(data?.netApprovedAmount ?? '0'),
      );
      legalnoticeData.approvedDuration = data?.approvedDuration ?? '';
      legalnoticeData.fullName = data?.registeredUsers?.fullName ?? '';
      legalnoticeData.email = data?.registeredUsers?.email ?? '';
      legalnoticeData.phone = data?.registeredUsers?.phone ?? '';
      legalnoticeData.panNumber = data?.registeredUsers?.panNumber ?? '';
      legalnoticeData.aadharAddress = this.getAadhaarAddress(
        data?.registeredUsers?.aadharAddress ?? '',
      );
      legalnoticeData.utr = data?.disbursementData[0].utr ?? '';
      legalnoticeData.ifsc = data?.disbursementData[0].ifsc ?? '';
      legalnoticeData.account_number =
        data?.disbursementData[0].account_number ?? '';
      legalnoticeData.bank_name = data?.disbursementData[0].bank_name ?? '';
      legalnoticeData.disbursementDate = data?.disbursementData[0].createdAt;
      try {
        data?.emiData.forEach((element) => {
          const tempEmiData: EMIModel = new EMIModel().toEmIData(
            element,
            data.netEmiData,
          );
          if (tempEmiData) legalnoticeData.emiList.push(tempEmiData);
        });
      } catch (error) {}
      try {
        data?.partialData.forEach((element) => {
          const tempData: PartPayModel = new PartPayModel().toEmIData(
            element,
            legalnoticeData.emiList,
          );
          if (tempData) legalnoticeData.partialList.push(tempData);
        });
      } catch (error) {}
      // console.log(data);
    } catch (error) {
      legalnoticeData = new LegalNoticeModel();
    }
    return legalnoticeData;
  }

  getAadhaarAddress(aadharAddress): string {
    try {
      let aadhaarAddress = JSON.parse(aadharAddress);
      let house = aadhaarAddress['house'];
      let street = aadhaarAddress['street'];
      let landmark = aadhaarAddress['landmark'];
      let subdist = aadhaarAddress['subdist'];
      let dist = aadhaarAddress['dist'];
      let state = aadhaarAddress['state'];
      let country = aadhaarAddress['country'];
      let aadhaarAddress1 = '';
      aadhaarAddress1 += house ? this.getAadhaarAddressStyle(house + ',') : '';
      aadhaarAddress1 += street
        ? this.getAadhaarAddressStyle(street + ',')
        : '';
      aadhaarAddress1 += subdist
        ? this.getAadhaarAddressStyle(
            (landmark ? landmark + ', ' : '') + subdist + ',',
          )
        : landmark
        ? this.getAadhaarAddressStyle(landmark + ',')
        : '';
      aadhaarAddress1 += dist ? this.getAadhaarAddressStyle(dist + ',') : '';
      aadhaarAddress1 += state ? this.getAadhaarAddressStyle(state + ',') : '';
      aadhaarAddress1 += country
        ? this.getAadhaarAddressStyle(country + '.')
        : '';
      return aadhaarAddress1;
    } catch (error) {
      return '';
    }
  }

  getAadhaarAddressStyle(address): string {
    return (
      '<tr><td colspan="2" style="padding:10px 0 0 0;letter-spacing: 0.6px;">' +
      address +
      '</td></tr>'
    );
  }
}

export class EMIModel {
  emiId: number;
  emi_amount: number;
  emiWithpenalty: number;
  penalty_days: number;
  payment_due_status: string = '';
  payment_status: string = '';
  autoPay_status: string = '';
  autoPay_date: Date;
  autoPay_message: string = '';
  type: string = '';
  toEmIData(data: EmiEntity, netEmiData: any) {
    const emiData: EMIModel = new EMIModel();
    try {
      emiData.emiId = data.id;
      netEmiData.forEach((element) => {
        try {
          const netEmi = JSON.parse(element);
          if (netEmi['Date'].substring(0, 10) == data.emi_date.substring(0, 10))
            emiData.emi_amount = Math.floor(+netEmi['Emi']);
        } catch (error) {}
      });
      emiData.emiWithpenalty = Math.floor(
        +(data.emi_amount ?? '0') + +(data.penalty ?? 0),
      );
      emiData.payment_status = data.payment_status;
      emiData.payment_due_status = data.payment_due_status;
      emiData.penalty_days = data.penalty_days;
      if (data.payment_status === '1') {
        emiData.type = 'Razorpay';
        try {
          if (data.autoPayId) emiData.type = 'Auto debit';
          else if (data.upiPayId) emiData.type = 'UPI';
        } catch (error) {}
      }
      try {
        if (data.autoPayData.length > 0) {
          emiData.autoPay_status = data.autoPayData[0].status;
          emiData.autoPay_date = data.autoPayData[0].createdAt;
          emiData.autoPay_message = JSON.parse(
            data.autoPayData[0].signdesk_response,
          )['error_description'];
        }
      } catch (error) {}
    } catch (error) {}
    return emiData;
  }
}
export class PartPayModel {
  amount: number;
  status: string = '';
  type: string = '';
  toEmIData(data: PartialEntity, emiList: EMIModel[] = []) {
    let partPayData: PartPayModel = new PartPayModel();
    try {
      const isADD = emiList.find(
        (a) => a.emiId == data.emiId && a.payment_status != '1',
      );
      if (data.status == 'COMPLETED' && isADD) {
        partPayData.amount = Math.floor(+data.amount);
        partPayData.status = data.status;
        partPayData.type = data.type;
      } else partPayData = null;
    } catch (error) {
      partPayData = null;
    }
    return partPayData;
  }
}
