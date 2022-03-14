import { Inject, Injectable } from '@nestjs/common';
import { EmiEntity } from 'src/entities/emi.entity';
import { TypeService } from 'src/utils/type.service';
import { EMIENTITY_REPOSITORY } from 'src/constants/entities';
import { Op, Sequelize } from 'sequelize';
import { admin } from 'src/entities/admin.entity';
import { registeredUsers } from 'src/entities/user.entity';
import { RazorPaymentEntity } from 'src/entities/razorpayment.entity';
import { AutoPayEntity } from 'src/entities/auto.pay.entity';
import { UPIEntity } from 'src/entities/upi.entity';
import { PaymentEntity } from 'src/entities/payment.entity';
import { PartialEntity } from 'src/entities/partial.entity';
import { LegalNoticeEntity } from 'src/entities/notice.entity';
import {
  LOYALTY_AVG_BALANCE_DISCOUNT,
  LOYALTY_SETTLEMENT_RATIO,
  MAX_LOAN_AMOUNT,
  MAX_PRINCIPAL_PORTION,
  MIN_LOAN_AMOUNT,
  NEXT_LOAN_AMOUNT_DISCOUNT,
} from 'src/constants/globals';
import { loanTransaction } from 'src/entities/loan.entity';
import { disbursementEntity } from 'src/entities/disbursement.entity';
import { k400Error, k500Error } from 'src/constants/misc';
import { userNetBankingDetails } from 'src/entities/netBanking.entity';

@Injectable()
export class EMIServiceV1 {
  constructor(
    @Inject(EMIENTITY_REPOSITORY)
    private readonly repository: typeof EmiEntity,
    private readonly typeService: TypeService,
  ) {}

  async getRowWhereData(attributes: string[], options: any) {
    try {
      const data = await this.repository.findOne({
        attributes,
        ...options,
      });
      if (!data) return;
      return data.get({ plain: true });
    } catch (error) {
      return k500Error;
    }
  }

  async getTableWhereData(attributes: string[], options: any) {
    try {
      const listData = await this.repository.findAll({
        attributes,
        ...options,
      });
      if (options.raw == true) return listData;
      return listData.map((element) => element.get({ plain: true }));
    } catch (error) {
      return k500Error;
    }
  }

  async countWhereData(options: any) {
    try {
      return await this.repository.count({
        ...options,
      });
    } catch (error) {
      return k500Error;
    }
  }

  async updateRawData(updatedData: any, id: number | number[]) {
    try {
      return await this.repository.update(updatedData, { where: { id } });
    } catch (error) {
      return k500Error;
    }
  }

  calculateFinalEMIs(
    salaryDate: number,
    interestRate: string,
    approvedAmount: number,
    monthlyAvgBalance: number | '500',
    onTimePaidData: any,
    appliedAmount: number,
  ) {
    try {
      const emiDaysCalculation = this.calculateEMIDays(salaryDate);
      if (emiDaysCalculation == '500') return emiDaysCalculation;
      const emiData = this.calculateEMIs(
        approvedAmount,
        monthlyAvgBalance,
        interestRate,
        emiDaysCalculation,
        onTimePaidData,
        appliedAmount,
      );
      return emiData;
    } catch (error) {
      return '500';
    }
  }

  calculateEMIDays(salaryDate: number) {
    try {
      let fromDate = this.typeService.getGlobalDate(new Date());
      let totalDays = 0;
      const emiDates = [];
      const emiDays = [];
      for (let index = 0; index <= 2; index++) {
        const nextEMIDate = this.getNextSalaryDate(fromDate, salaryDate);
        const difference = this.differenceInDays(nextEMIDate, fromDate);
        if (totalDays + difference > 75) break;
        totalDays += difference;
        fromDate = nextEMIDate;
        emiDates.push(nextEMIDate);
        emiDays.push(difference);
      }
      return { totalDays, emiDates, emiDays };
    } catch (error) {
      return '500';
    }
  }

  getNextSalaryDate(fromDate: Date, salaryDate: number) {
    const finalizedDate = this.typeService.getGlobalDate(fromDate);
    let minDifference = 41;
    let finalDate = finalizedDate;
    for (let index = 0; index <= 41; index++) {
      finalizedDate.setDate(finalizedDate.getDate() + 1);
      const difference = salaryDate - finalizedDate.getDate();
      if (difference < 5 && difference > -1) {
        const differenceForToday = this.differenceInDays(
          fromDate,
          finalizedDate,
        );
        if (differenceForToday > 10 && difference < minDifference) {
          minDifference = difference;
          finalDate = new Date(finalizedDate);
        }
      }
    }
    return finalDate;
  }

  private differenceInDays(nextDate: Date, currentdate: Date) {
    try {
      const difference =
        this.typeService.getGlobalDate(nextDate).getTime() -
        this.typeService.getGlobalDate(currentdate).getTime();
      const diff = Math.abs(difference);
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      return diffDays;
    } catch (error) {
      return null;
    }
  }

  private calculateEMIs(
    approvedAmount: any,
    monthlyAvgBalance: number | '500',
    interestRate,
    emiDaysCalculation,
    onTimePaidData: any,
    appliedAmount: number,
  ) {
    try {
      const installmentDate = emiDaysCalculation.emiDates;
      const installmentDays = emiDaysCalculation.emiDays;
      const totaldays = emiDaysCalculation.totalDays;
      const calculatedData: any = this.calculateEMIsBasedOnAmount(
        approvedAmount,
        installmentDays,
        installmentDate,
        totaldays,
        interestRate,
      );
      if (calculatedData == '500') return calculatedData;

      /* If any of the EMI's principal amount is greater than the monthly avg balance's portion
      then need to follow below logic instead of the above one */
      const finalData = this.checkAndCalculateAsPerAvgBalance(
        monthlyAvgBalance,
        calculatedData.emiData,
        emiDaysCalculation,
        interestRate,
        onTimePaidData,
        appliedAmount,
      );
      if (finalData == false) return calculatedData;
      return finalData;
    } catch (error) {
      return '500';
    }
  }

  private calculateEMIsBasedOnAmount(
    approvedAmount,
    installmentDays: any[],
    installmentDate: any[],
    totalDays,
    interestRate,
  ) {
    try {
      let tempApprovedAmount = approvedAmount;
      let totalEmiAmount = 0;
      let totalInterestAmount = 0;
      const emiData: any = [];
      const perDay = Math.round(approvedAmount / totalDays).toFixed(2);
      for (let index = 0; index < installmentDays.length; index++) {
        try {
          const element = installmentDays[index];
          const principalAmount = (approvedAmount / totalDays) * element;
          const emiInterestAmount =
            ((tempApprovedAmount * interestRate) / 100) * element;
          tempApprovedAmount = tempApprovedAmount - principalAmount;
          emiData.push({
            Date: installmentDate[index],
            Emi: Math.round(principalAmount + emiInterestAmount).toFixed(2),
            Days: element,
            PrincipalCovered: Math.round(principalAmount).toFixed(2),
            InterestCalculate: Math.round(emiInterestAmount).toFixed(2),
            RateofInterest: parseFloat(interestRate).toFixed(3) + '%',
          });
          totalEmiAmount += +Math.round(
            principalAmount + emiInterestAmount,
          ).toFixed(2);
          totalInterestAmount += +Math.round(emiInterestAmount).toFixed(2);
        } catch (error) {
          return '500';
        }
      }
      return { emiData, totalEmiAmount, totalInterestAmount, perDay };
    } catch (error) {
      return k500Error;
    }
  }

  private checkAndCalculateAsPerAvgBalance(
    monthlyAvgBalance: number | '500',
    emiData: any[],
    emiDaysCalculation,
    interestRate,
    onTimePaidData: any,
    appliedAmount: number,
  ) {
    try {
      if (monthlyAvgBalance != '500') {
        let isNotEligibleToPayPrincipal = false;
        const minBalanceReq = Math.floor(
          monthlyAvgBalance * MAX_PRINCIPAL_PORTION,
        );
        let maxPrincipalAmount = 0;
        let preApprovedEMIData: any = {};

        //Finding the max amount of EMI data
        for (let index = 0; index < emiData.length; index++) {
          try {
            const emiDetails = emiData[index];
            const principalAmount = parseFloat(emiDetails.PrincipalCovered);
            if (principalAmount > maxPrincipalAmount) {
              maxPrincipalAmount = principalAmount;
              preApprovedEMIData = emiDetails;
            }
          } catch (error) {}
        }

        if (maxPrincipalAmount > minBalanceReq)
          isNotEligibleToPayPrincipal = true;
        if (!isNotEligibleToPayPrincipal) return isNotEligibleToPayPrincipal;

        //Calculating final approval amount based on the monthly avg balance
        let approvedAmount = 0;
        const emiDays = preApprovedEMIData.Days;
        const principalAmount = minBalanceReq;
        const perDayPrincipal = parseFloat(
          (principalAmount / emiDays).toFixed(2),
        );
        approvedAmount = Math.floor(
          perDayPrincipal * emiDaysCalculation.totalDays,
        );

        /*OnTime paid users should not get the amount lower than the previous one
        if avg balance is not flactuating more than the previous one and 
        applied amount is same or more than the previous one*/
        if (onTimePaidData.valid == true) {
          const lastApprovedAmount = parseFloat(
            onTimePaidData.netApprovedAmount,
          );
          approvedAmount += lastApprovedAmount * LOYALTY_AVG_BALANCE_DISCOUNT;
          const eligibleRatio = approvedAmount / lastApprovedAmount;
          if (eligibleRatio > 1)
            approvedAmount += lastApprovedAmount * NEXT_LOAN_AMOUNT_DISCOUNT;
          else if (eligibleRatio > LOYALTY_SETTLEMENT_RATIO)
            approvedAmount = lastApprovedAmount;
        }
        if (approvedAmount < MIN_LOAN_AMOUNT) return false;
        else if (approvedAmount > MAX_LOAN_AMOUNT)
          approvedAmount = MAX_LOAN_AMOUNT;

        if (approvedAmount > appliedAmount) approvedAmount = appliedAmount;
        approvedAmount = Math.floor(approvedAmount);
        approvedAmount = approvedAmount + 100 - (approvedAmount % 100);

        return this.calculateEMIsBasedOnAmount(
          approvedAmount,
          emiDaysCalculation.emiDays,
          emiDaysCalculation.emiDates,
          emiDaysCalculation.totalDays,
          interestRate,
        );
      }
    } catch (error) {
      return '500';
    }
  }

  private getAfterSalaryDate(experimentDate: Date, salaryDate: number): Date {
    try {
      const targetDate = this.typeService.getGlobalDate(experimentDate);
      const difference = targetDate.getDate() - salaryDate;
      if (difference <= -1 && difference >= -3)
        targetDate.setHours(24 * (Math.abs(difference) + 1));
      else if (difference === 30) {
        //When salary Date is 1 this scenario comes
        targetDate.setHours(24);
        const rareDifference = targetDate.getDate() - salaryDate;
        if (rareDifference === 0) targetDate.setHours(24);
      }
      if (difference === 0) targetDate.setHours(24);
      const tempDate: Date = this.typeService.getGlobalDate(
        new Date(targetDate),
      );
      const day = tempDate.toUTCString().substr(0, 3).toLowerCase();
      //EMI Date should not be on weekends
      if (day === 'sat') targetDate.setHours(24 * 2);
      else if (day === 'sun') targetDate.setHours(24);
      return this.typeService.getGlobalDate(targetDate);
    } catch (error) {
      return experimentDate;
    }
  }

  async updateLegalDataEMIWise(loanId: number, legalId: number) {
    try {
      await this.repository.update(
        { legalId },
        { where: { loanId, payment_due_status: '1', payment_status: '0' } },
      );
    } catch (error) {
      return '500';
    }
  }

  async findAllLegalNotice(page = 1, pagesize = 10, where: any, search: any) {
    try {
      const skip1 = page * pagesize - pagesize;
      const nameWhere = { fullName: { [Op.iRegexp]: search } };
      const legalList = await this.repository.findAll({
        offset: skip1,
        limit: 1 * pagesize,
        where: { legalId: { [Op.ne]: null } },
        attributes: [
          'loanId',
          'emiDate',
          'emi_amount',
          'penalty',
          'penalty_days',
          'payment_status',
          'payment_due_status',
          'paymentId',
        ],
        include: [
          {
            where,
            attributes: [
              'id',
              'url',
              'createdAt',
              'sendAdminId',
              'emailAdminId',
              'whatsAppAdminId',
              'receivedAdminId',
              'adminId',
              'sendDate',
              'emailDate',
              'whatsAppDate',
              'receivedDate',
            ],
            model: LegalNoticeEntity,
            include: [
              {
                attributes: ['fullName'],
                model: admin,
                as: 'adminData',
              },
              {
                attributes: ['fullName'],
                model: admin,
                as: 'sendAdminData',
              },
              {
                attributes: ['fullName'],
                model: admin,
                as: 'emailAdminData',
              },
              {
                attributes: ['fullName'],
                model: admin,
                as: 'whatsAppAdminData',
              },
              {
                attributes: ['fullName'],
                model: admin,
                as: 'receivedAdminData',
              },
            ],
            order: [['createdAt', 'DESC']],
          },
          {
            where: nameWhere,
            attributes: ['fullName', 'id'],
            model: registeredUsers,
          },
          {
            attributes: ['status', 'payment_done_date'],
            model: AutoPayEntity,
          },
          {
            attributes: ['status', 'completionDate'],
            model: UPIEntity,
          },
          {
            attributes: ['status', 'payment_time'],
            model: RazorPaymentEntity,
          },
          {
            attributes: ['payment_id', 'createdAt'],
            model: PaymentEntity,
          },
          {
            attributes: ['status', 'completionDate'],
            model: PartialEntity,
          },
        ],
        nest: true,
      });

      const count = await this.repository.count({
        where: { legalId: { [Op.ne]: null } },
        include: [
          {
            where,
            model: LegalNoticeEntity,
          },
          {
            where: nameWhere,
            model: registeredUsers,
          },
        ],
      });
      return {
        legalList,
        count,
      };
    } catch (error) {
      console.log(error);

      return '500';
    }
  }

  async getAllTODAYCountLegalNotice(where: any) {
    try {
      const legalList = await this.repository.findAll({
        where: { legalId: { [Op.ne]: null } },
        attributes: ['legalId'],
        include: [
          {
            where,
            attributes: [
              [
                Sequelize.fn('count', Sequelize.col('sendAdminId')),
                'totalSendAdminId',
              ],
            ],
            model: LegalNoticeEntity,
          },
        ],
        raw: true,
        nest: true,
      });
      return {
        legalList,
      };
    } catch (error) {
      return '500';
    }
  }

  async getRemainingDateWise(fromDate: Date) {
    try {
      let where;
      const dateString = fromDate.toJSON();

      if (fromDate)
        where = {
          emi_date: dateString,
          payment_status: '0',
        };
      const emiList = await this.repository.findAll({
        attributes: ['emi_date', 'emi_amount', 'penalty'],
        include: [
          { model: registeredUsers, attributes: ['fullName', 'phone'] },
        ],
        nest: true,
        raw: true,
        where,
      });
      return emiList;
    } catch (error) {
      return '500';
    }
  }

  async getRawDataBulk(whereData = {}, attributes?: string[]) {
    try {
      return await this.repository.findAll({
        attributes,
        nest: true,
        raw: true,
        where: whereData,
        order: [['id', 'ASC']],
      });
    } catch (error) {
      return '500';
    }
  }

  async getTodayEmiCounts() {
    try {
      const todayEmiDate = await this.typeService.getGlobalDate(new Date());
      const paidEmiCount = await this.repository.count({
        where: {
          payment_status: '1',
          emi_date: { [Op.eq]: todayEmiDate.toJSON() },
        },
      });
      const unpaidEmiCount = await this.repository.count({
        where: {
          payment_status: { [Op.ne]: '1' },
          emi_date: { [Op.eq]: todayEmiDate.toJSON() },
        },
      });
      const totalEmiCount = +paidEmiCount + +unpaidEmiCount;
      return { totalEmiCount, paidEmiCount, unpaidEmiCount };
    } catch (error) {
      return '500';
    }
  }

  async getEmiDataWRange(
    page: number,
    pagesize: number,
    start_date: string,
    end_date: string,
    emiStatus: string,
    searchText = '',
    download: boolean,
  ) {
    try {
      const d = this.typeService.getGlobalDate(new Date(start_date));
      const d1 = this.typeService.getGlobalDate(new Date(end_date));

      const whereData = {
        emi_date: {
          [Op.gte]: d.toJSON(),
          [Op.lte]: d1.toJSON(),
        },
      };
      if (emiStatus === '1') whereData['payment_status'] = '1';
      else if (emiStatus === '2')
        whereData['payment_status'] = { [Op.ne]: '1' };
      if (!download) {
        const skip1 = page * pagesize - pagesize;

        return await this.repository.findAndCountAll({
          offset: skip1,
          limit: pagesize,
          where: whereData,
          order: [['emi_date', 'ASC']],
          attributes: [
            'id',
            'emi_date',
            'emi_amount',
            'payment_done_date',
            'payment_status',
            'payment_due_status',
            'penalty',
            'penalty_days',
            'upiPayId',
            'paymentId',
            'manualAutoPayId',
          ],
          include: [
            {
              model: registeredUsers,
              attributes: ['id', 'aadharNumber', 'phone', 'fullName', 'email'],
              where: {
                [Op.or]: [
                  {
                    fullName: { [Op.iRegexp]: searchText },
                  },
                ],
              },
            },
            {
              model: loanTransaction,
              attributes: [
                'id',
                'manualVerificationAcceptName',
                'loan_disbursement_date',
                'loan_disbursement_id',
                'loanStatus',
                'netApprovedAmount',
                'interestRate',
                'netEmiData',
              ],
              include: [
                {
                  model: disbursementEntity,
                  attributes: ['amount', 'bank_name', 'account_number', 'ifsc'],
                },
              ],
            },
            {
              model: PaymentEntity,
              attributes: ['description', 'amount'],
            },
          ],
          raw: true,
          nest: true,
        });
      } else {
        return await this.repository.findAndCountAll({
          where: whereData,
          order: [['emi_date', 'ASC']],
          attributes: [
            'id',
            'emi_date',
            'emi_amount',
            'payment_done_date',
            'payment_status',
            'payment_due_status',
            'penalty',
            'penalty_days',
            'upiPayId',
            'paymentId',
            'manualAutoPayId',
          ],
          include: [
            {
              model: registeredUsers,
              attributes: ['id', 'aadharNumber', 'phone', 'fullName', 'email'],
            },
            {
              model: loanTransaction,
              attributes: [
                'id',
                'manualVerificationAcceptName',
                'loan_disbursement_date',
                'loan_disbursement_id',
                'loanStatus',
                'netApprovedAmount',
                'interestRate',
                'netEmiData',
              ],
              include: [
                {
                  model: disbursementEntity,
                  attributes: ['amount', 'bank_name', 'account_number', 'ifsc'],
                },
              ],
            },
            {
              model: PaymentEntity,
              attributes: ['description', 'amount'],
            },
          ],
          raw: true,
          nest: true,
        });
      }
    } catch (error) {
      return '500';
    }
  }

  async updateExisitngEMIData(
    approvedAmount: number,
    interestRate: number,
    netBankingData: userNetBankingDetails,
  ) {
    try {
      const salaryDate = this.getSalaryDate(netBankingData);
      if (salaryDate == k500Error) return salaryDate;
      const emiDays: any = await this.calculateEMIDays(salaryDate);
      if (emiDays == k500Error) return emiDays;
      const netEmiData = this.calculateEMIsBasedOnAmount(
        approvedAmount,
        emiDays.emiDays,
        emiDays.emiDates,
        emiDays.totalDays,
        interestRate,
      );
      if (netEmiData == k500Error) return k500Error;
      return { netEmiData, totalDays: emiDays.totalDays };
    } catch (error) {
      return k500Error;
    }
  }

  async getLinkedInReportCounts() {
    try {
      // Delay counts
      const delayWhere = {
        payment_due_status: '1',
        payment_status: '1',
      };
      let withoutLMaleDelayCounts = await this.repository.findAll({
        where: delayWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.4 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withoutLFemaleDelayCounts = await this.repository.findAll({
        where: delayWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.2 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withLMaleDelayCounts = await this.repository.findAll({
        where: delayWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.375 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withLFemaleDelaytCounts = await this.repository.findAll({
        where: delayWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.175 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });

      // Defaulter counts
      const defaulterWhere = {
        payment_due_status: '1',
        payment_status: '0',
      };
      const withoutLMaleDefaultCounts = await this.repository.findAll({
        where: defaulterWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.4 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      const withoutLFemaleDefaultCounts = await this.repository.findAll({
        where: defaulterWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.2 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      const withLMaleDefaultCounts = await this.repository.findAll({
        where: defaulterWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.375 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      const withLFemaleDefaultCounts = await this.repository.findAll({
        where: defaulterWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.175 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });

      // Ontime counts
      const ontimeWhere = {
        payment_due_status: '0',
        payment_status: '1',
      };
      let withoutLMaleOntimeCounts = await this.repository.findAll({
        where: ontimeWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.4 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withoutLFemaleOntimeCounts = await this.repository.findAll({
        where: ontimeWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.2 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withLMaleOntimeCounts = await this.repository.findAll({
        where: ontimeWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.375 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });
      let withLFemaleOntimeCounts = await this.repository.findAll({
        where: ontimeWhere,
        include: [
          {
            model: registeredUsers,
            where: { interestRate: 0.175 },
            attributes: [],
          },
        ],
        attributes: ['userId'],
        group: ['userId'],
        raw: true,
        nest: true,
      });

      // Remove duplicate from delay
      withoutLMaleDelayCounts = withoutLMaleDelayCounts.filter(
        (val) =>
          !withoutLMaleDefaultCounts.some((e) => e.userId === val.userId),
      );
      withoutLFemaleDelayCounts = withoutLFemaleDelayCounts.filter(
        (val) =>
          !withoutLFemaleDefaultCounts.some((e) => e.userId === val.userId),
      );
      withLMaleDelayCounts = withLMaleDelayCounts.filter(
        (val) => !withLMaleDefaultCounts.some((e) => e.userId === val.userId),
      );
      withLFemaleDelaytCounts = withLFemaleDelaytCounts.filter(
        (val) => !withLFemaleDefaultCounts.some((e) => e.userId === val.userId),
      );

      // Remove duplicate from on time
      withoutLMaleOntimeCounts = withoutLMaleOntimeCounts.filter(
        (val) =>
          !(
            withoutLMaleDefaultCounts.some((e) => e.userId === val.userId) ||
            withoutLMaleDelayCounts.some((e) => e.userId === val.userId)
          ),
      );
      withoutLFemaleOntimeCounts = withoutLFemaleOntimeCounts.filter(
        (val) =>
          !(
            withoutLFemaleDefaultCounts.some((e) => e.userId === val.userId) ||
            withoutLFemaleDelayCounts.some((e) => e.userId === val.userId)
          ),
      );
      withLMaleOntimeCounts = withLMaleOntimeCounts.filter(
        (val) =>
          !(
            withLMaleDefaultCounts.some((e) => e.userId === val.userId) ||
            withLMaleDelayCounts.some((e) => e.userId === val.userId)
          ),
      );
      withLFemaleOntimeCounts = withLFemaleOntimeCounts.filter(
        (val) =>
          !(
            withLFemaleDefaultCounts.some((e) => e.userId === val.userId) ||
            withLFemaleDelaytCounts.some((e) => e.userId === val.userId)
          ),
      );

      const totalMales =
        withoutLMaleDelayCounts.length +
        withLMaleDelayCounts.length +
        withoutLMaleDefaultCounts.length +
        withLMaleDefaultCounts.length +
        withoutLMaleOntimeCounts.length +
        withLMaleOntimeCounts.length;

      const totalFemales =
        withoutLFemaleDelayCounts.length +
        withLFemaleDelaytCounts.length +
        withoutLFemaleDefaultCounts.length +
        withLFemaleDefaultCounts.length +
        withoutLFemaleOntimeCounts.length +
        withLFemaleOntimeCounts.length;

      const malePercentage = +(
        (totalMales * 100) /
        (totalMales + totalFemales)
      ).toFixed(2);
      const femalePercentage = +(
        (totalFemales * 100) /
        (totalMales + totalFemales)
      ).toFixed(2);
      return {
        delayCounts: {
          withoutLMaleDelayCounts: withoutLMaleDelayCounts.length,
          withoutLFemaleDelayCounts: withoutLFemaleDelayCounts.length,
          withLMaleDelayCounts: withLMaleDelayCounts.length,
          withLFemaleDelaytCounts: withLFemaleDelaytCounts.length,
        },
        defaulterCounts: {
          withoutLMaleDefaultCounts: withoutLMaleDefaultCounts.length,
          withoutLFemaleDefaultCounts: withoutLFemaleDefaultCounts.length,
          withLMaleDefaultCounts: withLMaleDefaultCounts.length,
          withLFemaleDefaultCounts: withLFemaleDefaultCounts.length,
        },
        ontimeCounts: {
          withoutLMaleOntimeCounts: withoutLMaleOntimeCounts.length,
          withoutLFemaleOntimeCounts: withoutLFemaleOntimeCounts.length,
          withLMaleOntimeCounts: withLMaleOntimeCounts.length,
          withLFemaleOntimeCounts: withLFemaleOntimeCounts.length,
        },
        totalMales,
        totalFemales,
        malePercentage,
        femalePercentage,
      };
    } catch (error) {
      return k500Error;
    }
  }

  async getLinkedInReportData(
    page: number,
    reportType: number,
    sectionType: number,
    searchText: string,
  ) {
    try {
      const delayWhere = {
        payment_due_status: '1',
        payment_status: '1',
      };

      const defaulterWhere = {
        payment_due_status: '1',
        payment_status: '0',
      };

      const ontimeWhere = {
        payment_due_status: '0',
        payment_status: '1',
      };
      const nameWhere = { fullName: { [Op.iRegexp]: searchText } };
      const skip1 = page * 10 - 10;
      if (sectionType === 1) {
        // with linkedIn Male

        if (reportType === 1) {
          // Delay
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: delayWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.375, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 2) {
          // Defaulter
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: defaulterWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.375, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 3) {
          // Ontime
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: ontimeWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.375, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else {
          return k400Error;
        }
      } else if (sectionType === 2) {
        //without linkedIn Male

        if (reportType === 1) {
          // Delay
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: delayWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.4, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 2) {
          // Defaulter
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: defaulterWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.4, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 3) {
          // Ontime
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: ontimeWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.4, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else {
          return k400Error;
        }
      } else if (sectionType === 3) {
        // with linkedIn Female

        if (reportType === 1) {
          // Delay
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: delayWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.175, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 2) {
          // Defaulter
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: defaulterWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.175, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 3) {
          // Ontime
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: ontimeWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.175, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else {
          return k400Error;
        }
      } else if (sectionType === 4) {
        // without linkedIn female
        if (reportType === 1) {
          // Delay
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: delayWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.2, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 2) {
          // Defaulter
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: defaulterWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.2, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else if (reportType === 3) {
          // Ontime
          return await this.repository.findAndCountAll({
            offset: skip1,
            limit: 1 * 10,
            where: ontimeWhere,
            include: [
              {
                model: registeredUsers,
                where: { interestRate: 0.2, ...nameWhere },
                attributes: ['id', 'fullName', 'phone'],
              },
            ],
            attributes: ['id', 'emi_date', 'emi_amount', 'payment_status'],
            raw: true,
            nest: true,
          });
        } else {
          return k400Error;
        }
      } else {
        return k400Error;
      }
    } catch (error) {
      return k500Error;
    }
  }

  getSalaryDate(netBankingData: userNetBankingDetails) {
    try {
      const manualSalaryDate = this.typeService.getGlobalDate(
        new Date(netBankingData.manualSalaryDate),
      );
      let salaryDate = manualSalaryDate.getDate();
      if (netBankingData.adminSalaryDateVerified == '1')
        salaryDate = netBankingData.adminVerifiedSalaryDate;
      return salaryDate;
    } catch (error) {
      return k500Error;
    }
  }

  async getMonthWiseEmiCounts(start_month, end_month, status = 'all') {
    try {
      const whereData = {
        emi_date: {
          [Op.gte]: start_month.toJSON(),
          [Op.lte]: end_month.toJSON(),
        },
      };
      if (status === 'paid') whereData['payment_status'] = '1';
      if (status === 'unpaid') whereData['payment_status'] = '0';
      return await this.repository.count({
        where: whereData,
      });
    } catch (error) {
      return k500Error;
    }
  }

  async getMonthWiseEmiProfitLoss(start_month, end_month) {
    try {
      const whereData = {
        emi_date: {
          [Op.gte]: start_month.toJSON(),
          [Op.lte]: end_month.toJSON(),
        },
      };
      const expectedObj: any = await this.repository.findOne({
        where: whereData,
        attributes: [
          [
            Sequelize.fn(
              'SUM',
              Sequelize.cast(Sequelize.col('emi_amount'), 'double precision'),
            ),
            'emiAmountSum',
          ],
          [Sequelize.fn('SUM', Sequelize.col('penalty')), 'penaltySum'],
        ],
        raw: true,
        nest: true,
      });

      whereData['payment_status'] = '1';
      const repaidObj: any = await this.repository.findOne({
        where: whereData,
        attributes: [
          [
            Sequelize.fn(
              'SUM',
              Sequelize.cast(Sequelize.col('emi_amount'), 'double precision'),
            ),
            'emiAmountSum',
          ],
          [Sequelize.fn('SUM', Sequelize.col('penalty')), 'penaltySum'],
          [Sequelize.fn('SUM', Sequelize.col('waiver')), 'waiverSum'],
        ],
        raw: true,
        nest: true,
      });

      let expectedAmount = +expectedObj.emiAmountSum + +expectedObj.penaltySum;
      let repaidAmount =
        +repaidObj.emiAmountSum + +repaidObj.penaltySum - +repaidObj.waiverSum;
      let unpaidAmount = expectedAmount - repaidAmount;

      let profitPercentage = (repaidAmount * 100) / expectedAmount;
      let lossPercentage = (unpaidAmount * 100) / expectedAmount;

      if (profitPercentage)
        profitPercentage = parseFloat(profitPercentage.toFixed(2));
      if (lossPercentage)
        lossPercentage = parseFloat(lossPercentage.toFixed(2));
      if (expectedAmount)
        expectedAmount = parseFloat(expectedAmount.toFixed(2));
      if (repaidAmount) repaidAmount = parseFloat(repaidAmount.toFixed(2));
      if (unpaidAmount) unpaidAmount = parseFloat(unpaidAmount.toFixed(2));
      return {
        profitPercentage,
        lossPercentage,
        expectedAmount,
        repaidAmount,
        unpaidAmount,
      };
    } catch (error) {
      return k500Error;
    }
  }

  async calculateNUpdateEmiPartpay(
    amountPaid: number,
    emiAmount: number,
    penalty: number,
    partPaymentPenaltyAmount: number,
    emiId: number,
  ) {
    try {
      let penaltyCovered = 0;
      if (amountPaid >= emiAmount + penalty) return 'PAID_AMOUNT_GREATER_ERR';

      if (penalty <= amountPaid) {
        penaltyCovered = penalty;
        amountPaid = amountPaid - penalty;
        penalty = 0;
      } else if (penalty > amountPaid) {
        penaltyCovered = amountPaid;
        penalty = penalty - amountPaid;
        amountPaid = 0;
      }

      if (emiAmount <= amountPaid) {
        amountPaid = amountPaid - emiAmount;
        emiAmount = 0;
      } else if (emiAmount > amountPaid) {
        emiAmount = emiAmount - amountPaid;
        amountPaid = 0;
      }
      penaltyCovered += partPaymentPenaltyAmount;

      emiAmount = parseFloat(emiAmount.toFixed(2));

      const updateResult = await this.updateRawData(
        {
          emi_amount: emiAmount,
          penalty: +penalty,
          partPaymentPenaltyAmount: penaltyCovered,
        },
        emiId,
      );
      if (!updateResult || updateResult == k500Error || updateResult[0] !== 1)
        return k500Error;
      return true;
    } catch (error) {
      return k500Error;
    }
  }

  async getCompletedEmiData(start_date: Date, end_date: Date) {
    try {
      return await this.repository.findAll({
        where: {
          payment_status: '1',
          payment_done_date: {
            [Op.gte]: start_date.toJSON(),
            [Op.lte]: end_date.toJSON(),
          },
        },
        attributes: ['id'],
        include: [
          {
            model: loanTransaction,
            where: { loanStatus: 'Complete' },
            attributes: ['id'],
          },
        ],
        raw: true,
        nest: true,
      });
    } catch (error) {
      return k500Error;
    }
  }

  async checkNFillEmiFields() {
    try {
      const result = await this.repository.findAll({
        where: { principalCovered: { [Op.eq]: null } },
        attributes: ['id', 'emi_date'],
        include: [{ model: loanTransaction, attributes: ['id', 'netEmiData'] }],
        raw: true,
        nest: true,
      });
      if (result && result.length > 0)
        for (let i = 0; i < result.length; i++) {
          try {
            const element = result[i];
            for (let j = 0; j < element.loan.netEmiData.length; j++) {
              try {
                const netItem = JSON.parse(element.loan.netEmiData[j]);
                if (
                  element.emi_date.substring(0, 10) ===
                  netItem.Date.substring(0, 10)
                ) {
                  this.repository.update(
                    {
                      principalCovered: netItem.PrincipalCovered,
                      interestCalculate: netItem.InterestCalculate,
                    },
                    { where: { id: element.id } },
                  );
                }
              } catch (error) {}
            }
          } catch (error) {}
        }
      return true;
    } catch (error) {
      return k500Error;
    }
  }

  //#region  find loan IDS only
  async getAllLoanIDS(fromDate, toDate) {
    try {
      return await this.repository.findAll({
        where: {
          [Op.or]: [
            {
              emi_date: {
                [Op.gte]: fromDate,
                [Op.lte]: toDate,
              },
            },
            {
              payment_done_date: {
                [Op.gte]: fromDate,
                [Op.lte]: toDate,
              },
            },
          ],
        },
        attributes: ['loanId'],
        group: ['loanId'],
        raw: true,
      });
    } catch (error) {
      return k500Error;
    }
  }
  //#endregion

  //  check and update Emi
  async checkNUpdateEmipay(
    amountPaid: number,
    emiAmount: number,
    penalty: number,
    emiId: number,
    paymentDate,
    payId,
    type,
  ) {
    try {
      paymentDate = this.typeService.getGlobalDate(paymentDate).toJSON();
      const expectedEmiAmount = emiAmount + penalty;
      if (
        expectedEmiAmount - 5 > amountPaid ||
        amountPaid > expectedEmiAmount + 5
      )
        return 'INVALID AMOUNT';
      const updateDataObject: any = {
        payment_status: 1,
        payment_done_date: paymentDate,
      };
      if (type === 'UPI') {
        updateDataObject.upiPayId = payId;
      }
      const updateRes = await this.updateRawData(updateDataObject, emiId);
      if (updateRes === k500Error) return k500Error;
      return true;
    } catch (error) {
      return k500Error;
    }
  }
}
