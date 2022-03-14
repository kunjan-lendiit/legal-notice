import { Injectable } from '@nestjs/common';
import { MAX_FEMALE_INTEREST, MAX_MALE_INTEREST } from 'src/constants/globals';

@Injectable()
export class CommonService {
  constructor() {}
  updateInterestRateByGender(gender: string, oldRate: number) {
    try {
      if (gender.toUpperCase() == 'MALE') return MAX_MALE_INTEREST;
      else if (gender.toUpperCase() == 'FEMALE') return MAX_FEMALE_INTEREST;
      return oldRate;
    } catch (error) {
      return oldRate;
    }
  }
  getRandomId() {
    return 'lenditt' + Math.random().toString(36).substr(2, 9) + Date.now();
  }
  async softapprovalFunction(
    approvedAmount: any,
    interestRate,
    installmentDate: any,
    installmentDays,
    totaldays,
  ) {
    let tempApprovedAmount = approvedAmount;
    let toatlEmiamount: number = 0;
    let totalInterestAmount: number = 0;
    let softApproval: any = [];
    let perDay = Math.round(approvedAmount / totaldays).toFixed(2);
    for (let index = 0; index < installmentDays.length; index++) {
      const element = installmentDays[index];
      let prinAmount = (approvedAmount / totaldays) * element;
      let emiInterestAmount =
        ((tempApprovedAmount * interestRate) / 100) * element;
      tempApprovedAmount = tempApprovedAmount - prinAmount;
      softApproval.push({
        Date: installmentDate[index],
        Emi: Math.round(prinAmount + emiInterestAmount).toFixed(2),
        Days: element,
        PrincipalCovered: Math.round(prinAmount).toFixed(2),
        InterestCalculate: Math.round(emiInterestAmount).toFixed(2),
        RateofInterest: parseFloat(interestRate).toFixed(3) + '%',
      });
      toatlEmiamount += +Math.round(prinAmount + emiInterestAmount).toFixed(2);
      totalInterestAmount += +Math.round(emiInterestAmount).toFixed(2);
    }
    return { softApproval, toatlEmiamount, totalInterestAmount, perDay };
  }
}
