import { Inject, Injectable } from '@nestjs/common';
import { LEGAL_NOTICE_REPOSITORY } from '../constants/entities';
import { LegalNoticeEntity } from '../entities/notice.entity';
import { LoanServiceV1 } from '../loan/loan.service';
import { EMIModel, LegalNoticeModel, PartPayModel } from './legalNotice.model';
import * as fs from 'fs';
import { BankServiceV1 } from '../misc/bank.service';
import * as pdf from 'html-pdf';
import { TypeService } from 'src/utils/type.service';
import { FileService } from 'src/utils/file.service';
import { kLegalNoticeDocs } from '../constants/directories';
import { EMIServiceV1 } from '../emi/emi.service';
import { admin } from 'src/entities/admin.entity';
import { Op, Sequelize } from 'sequelize';
@Injectable()
export class LegalNoticeService {
  constructor(
    @Inject(LEGAL_NOTICE_REPOSITORY)
    private readonly repository: typeof LegalNoticeEntity,
    private readonly loanTransactionService: LoanServiceV1,
    private readonly bankService: BankServiceV1,
    private readonly typeService: TypeService,
    private readonly fileService: FileService,
    private readonly emiServiceV1: EMIServiceV1,
  ) { }

  async createLegalNotice(loanId: number, adminId: number) {
    try {
      const loanData = await this.loanTransactionService.findOneByIdForLegal(
        loanId,
        );
        if (loanData) {
          const legalnoticeData: LegalNoticeModel =
          new LegalNoticeModel().toLoanData(loanData);
          const bankName = await this.bankService.findBankNameByBankCode(
            legalnoticeData.bank_name,
            );
            if (bankName) {
              legalnoticeData.bank_name = bankName;
              const filePath: any = await this.createLegalPDF(legalnoticeData);
              if (filePath) {
                try {
                const url = await this.fileService.uploadFile(
                  filePath,
                  kLegalNoticeDocs,
                  );
                  console.log(url)
                  if (!url || url == '500') return '500';
                  else {
                    const respons = await this.create({
                      url: url,
                      adminId,
                      userId: legalnoticeData.userId,
                      loanId: legalnoticeData.id,
                      isActive: true,
                    });
                    if (!respons) return '500';
                    else {
                      await this.updateOldNotice(respons.id, loanId);
                      await this.emiServiceV1.updateLegalDataEMIWise(
                        loanId,
                        respons.id,
                        );
                        return respons;
                      }
              }
            } catch (error) {
              return '500';
            }
          } else return null;
        } else return '302';
      }
      return '302';
    } catch (error) {
      return '500';
    }
  }

  /// update old notice
  async updateOldNotice(id: number, loanId: number) {
    try {
      await this.repository.update(
        { isActive: false },
        {
          where: {
            loanId,
            id: { [Op.ne]: id },
          },
        },
      );
    } catch (error) { }
  }

  //#region create legal PDF and replace context
  async createLegalPDF(data: LegalNoticeModel) {
    return new Promise((resolve, reject) => {
      try {
        let countOfDueEMI = 0;
        data.emiList.forEach((element) => {
          if (
            element.payment_status == '0' &&
            element.payment_due_status == '1'
          )
            countOfDueEMI += 1;
        });
        let now = this.getDateFormated(new Date());
        let filePath = './upload/legalNotice/legal_notice.html';
        if (countOfDueEMI == 0) reject(null);
        else if (countOfDueEMI > 1)
          filePath = './upload/legalNotice/legal_notice_1.html';
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/##toDayDate##/g, now);
        content = content.replace(/##userName##/g, data.fullName);
        content = content.replace(/##aadhaarAddress##/g, data.aadharAddress);
        content = content.replace(/##panNumber##/g, data.panNumber);
        content = content.replace(/##phoneNumber##/g, data.phone);
        content = content.replace(/##loanId##/g, data.id.toString());
        content = content.replace(
          /##loanAmount##/g,
          this.typeService.numberWithCommas(data.approvedLoanAmount),
        );
        content = content.replace(
          /##loanAmountInWords##/g,
          this.typeService.inWords(data.approvedLoanAmount),
        );
        content = content.replace(/##UTR##/g, data.utr);
        content = content.replace(/##bankName##/g, data.bank_name);
        content = content.replace(/##accountNumber##/g, data.account_number);
        content = content.replace(/##ifsc##/g, data.ifsc);
        content = content.replace(
          /##toDayDateFormate##/g,
          this.typeService.getDateFormatedWithMonthFullName(),
        );
        content = content.replace(
          /##disbursementDate##/g,
          this.getDateFormated(data.disbursementDate),
        );
        content = content.replace(
          /##approvedDuration##/g,
          data.approvedDuration,
        );
        try {
          if (countOfDueEMI == 1) {
            for (let index = 0; index < data.emiList.length; index++) {
              const element: EMIModel = data.emiList[index];
              if (
                element.payment_status == '0' &&
                element.payment_due_status == '1'
              ) {
                content = content.replace(
                  /##emiDate##/g,
                  this.getDateFormated(element.autoPay_date),
                );
                content = content.replace(
                  /##emiAmount##/g,
                  this.typeService.numberWithCommas(element.emi_amount),
                );
                content = content.replace(
                  /##emiAmountInWords##/g,
                  this.typeService.inWords(element.emi_amount),
                );
                content = content.replace(
                  /##periodDays##/g,
                  this.typeService
                    .inWords(element.penalty_days ?? 0)
                    .replace('Only', ''),
                );
                let autoPay_message =
                  (element.autoPay_message ?? '') != ''
                    ? element.autoPay_message
                    : 'Balance Insufficient';
                content = content.replace(
                  /##autoPayMessage##/g,
                  autoPay_message,
                );
                content = content.replace(
                  /##emiAmountWithPenalty##/g,
                  this.typeService.numberWithCommas(element.emiWithpenalty),
                );
                content = content.replace(
                  /##emiAmountWithPenaltyInWords##/g,
                  this.typeService.inWords(element.emiWithpenalty),
                );
                const payamount = this.payedAmount(data);
                content = content.replace(/##payedAmount##/g, payamount);
                if (payamount.trim()) {
                  content = content.replace(/##valueli##/g, '6');
                  content = content.replace(/##valueli1##/g, '10');
                } else {
                  content = content.replace(/##valueli##/g, '5');
                  content = content.replace(/##valueli1##/g, '9');
                }
                break;
              }
            }
          } else {
            content = content.replace(
              /##EMISchedule##/g,
              this.getSchedule(data.emiList),
            );
            content = content.replace(
              /##emiCount##/g,
              this.typeService.inWords(data.emiList.length),
            );
            content = content.replace(
              /##emiDate##/g,
              this.getDateFormated(data.approvedDuration),
            );
            content = content.replace(
              /##instalment##/g,
              this.instalmentDate(data.emiList),
            );
            const reason = this.reason(data.emiList);
            content = content.replace(/##reason##/g, reason['message']);
            content = content.replace(
              /##totalEMIamount##/g,
              this.typeService.numberWithCommas(reason['amount']),
            );
            content = content.replace(
              /##totalEMIamountInWord##/g,
              this.typeService.inWords(reason['amount']),
            );

            const payamount = this.payedAmount(data);
            content = content.replace(/##payedAmount##/g, payamount);
            if (payamount.trim())
              content = content.replace(/##valueli##/g, '10');
            else content = content.replace(/##valueli##/g, '9');
          }
        } catch (error) { }
        if (countOfDueEMI === 0) reject(null);
        let options = {
          format: 'A4',
          // height: '686px',
          // width: '500px',
          margin: { top: '40px', bottom: '40px' },
          preferCSSPageSize: false,
          footer: {
            height: '30px',
            contents: {
              default:
                '<span style="color: #444;  float: right; margin-right:20px;">{{page}}</span>',
            },
          },
        };
        let pdfPath = './upload/legalNotice/legalNotice' + Date.now() + '.pdf';
        pdf.create(content, options).toFile(pdfPath, function (err, res) {
          if (err) reject(null);
          resolve(res.filename);
        });
      } catch (error) {
        reject(null);
      }
    });
  }
  //#endregion

  getDateFormated(date) {
    let today = new Date(date);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
  }

  //#region EMI schedule instalment date and amount
  instalmentDate(emiList: EMIModel[]) {
    try {
      let count = 0;
      let scheduleText = '';
      emiList.forEach((element) => {
        if (
          element.payment_status === '0' &&
          element.payment_due_status === '1'
        ) {
          if (count == 0)
            scheduleText =
              '<li value="4" style="letter-spacing: 0.7px; line-height: 30px; text-align: justify; padding: 10px 0 0 0;text-justify: inter-word;">The aforesaid first instalment dated ' +
              this.getDateFormated(element.autoPay_date) +
              ' amounting to Rs. ' +
              this.typeService.numberWithCommas(element.emi_amount) +
              '/- (Rupees ' +
              this.typeService.inWords(element.emi_amount) +
              ') was wilfully defaulted by you and subsequently you had assured my client to get it paid at earliest.</li>';
          else if (count == 1)
            scheduleText +=
              '  <li style="letter-spacing: 0.7px; line-height: 30px; text-align: justify; padding: 10px 0 0 0;text-justify: inter-word;">The aforementioned second instalment was again wilfully defaulted by you and the intimation of such default was received by my client on dated ' +
              this.getDateFormated(element.autoPay_date) +
              ' amounting to Rs. ' +
              this.typeService.numberWithCommas(element.emi_amount) +
              '/- (Rupees ' +
              this.typeService.inWords(element.emi_amount) +
              ') against the total repayable amount to be paid by you.</li>';
          count += 1;
        }
      });
      return scheduleText;
    } catch (error) { }
    return '';
  }
  //#endregion

  //#region EMI schedule
  getSchedule(emiList: EMIModel[]) {
    try {
      let count = 0;
      let scheduleText = '';
      emiList.forEach((element) => {
        if (
          element.payment_status === '0' &&
          element.payment_due_status === '1'
        ) {
          let emiWords = '';
          emiWords = count == 0 ? 'First ' : count == 1 ? 'Second ' : 'Third ';
          let emiDate = this.getDateFormated(element.autoPay_date);
          if (emiDate)
            scheduleText +=
              '<li>' +
              emiWords +
              'EMI (Ernst Monthly Instalment) dated ' +
              emiDate +
              ' for an amount of Rs. ' +
              this.typeService.numberWithCommas(element.emi_amount) +
              '/- (Rupees ' +
              this.typeService.inWords(element.emi_amount) +
              ')</li>';
          count += 1;
        }
      });
      return scheduleText;
    } catch (error) { }
    return '';
  }
  //#endregion

  //#region  reason of failed emi
  reason(emiList: EMIModel[]) {
    try {
      let datetext = '';
      let message: string = '';
      let amount;
      for (let index = 0; index < emiList.length; index++) {
        const element = emiList[index];
        let isShowAsWell = false;
        try {
          if (
            emiList[emiList.length - 1].payment_status === '0' &&
            emiList[emiList.length - 1].payment_due_status === '1'
          )
            isShowAsWell = true;
        } catch (error) { }
        try {
          if (
            element.payment_status === '0' &&
            element.payment_due_status === '1'
          ) {
            if (!message.includes(element.autoPay_message))
              message +=
                (message != '' ? ' and ' : '') +
                '“' +
                element.autoPay_message +
                '”';
            if (isShowAsWell) {
              datetext =
                datetext != ''
                  ? datetext.replace(' as well as ', ', ')
                  : datetext.replace(' as well as ', '');
              datetext +=
                (datetext != '' ? ' as well as ' : '') +
                this.getDateFormated(element.autoPay_date);
            } else
              datetext +=
                (datetext != '' ? ' as well as ' : '') +
                this.getDateFormated(element.autoPay_date);
          }
        } catch (error) { }
        try {
          if (
            element.payment_status === '0' &&
            element.payment_due_status === '1'
          )
            amount = (amount ?? 0) + element.emiWithpenalty;
        } catch (error) { }
      }
      return { message: '<b>' + message + '</b>' + ' on ' + datetext, amount };
    } catch (error) { }
    return '';
  }
  //#endregion

  //#region emi payed amount
  payedAmount(data: LegalNoticeModel) {
    try {
      let tempString = '';
      let type = '';
      let amount = 0;
      const partPayList: PartPayModel[] = data.partialList;
      const emiCount = this.typeService
        .inWords(Math.floor(data.emiList.length))
        .replace('Only', '');
      try {
        for (let index = 0; index < partPayList.length; index++) {
          const element = partPayList[index];
          amount += element.amount;
          if (!type.includes(element.type))
            if (index == partPayList.length - 1)
              type += type != '' ? ' and ' + element.type : element.type;
            else type += type != '' ? ', ' + element.type : element.type;
        }
      } catch (error) { }
      // try {
      //   for (let index = 0; index < data.emiList.length; index++) {
      //     const element = data.emiList[index];
      //     if (element.payment_status == '1') {
      //       console.log(element);
      //       // amount += element.emiWithpenalty;
      //       if (!type.includes(element.type))
      //         if (index == data.emiList.length - 1) {
      //           type.replace('and ', '');
      //           type += type != '' ? ' and ' + element.type : element.type;
      //         } else {
      //           type.replace('and ', '');
      //           type += type != '' ? ', ' + element.type : element.type;
      //         }
      //     }
      //   }
      // } catch (error) {}
      amount = Math.floor(amount);
      if (amount > 0) {
        tempString =
          '<li style="letter-spacing: 0.7px;line-height: 30px;padding: 20px 0 0 0;">The total loan amount of Rs. ';
        tempString +=
          this.typeService.numberWithCommas(data.approvedLoanAmount) +
          '/- (Rupees ' +
          this.typeService.inWords(data.approvedLoanAmount);
        tempString +=
          ')  was lent to you (inclusive of ' +
          emiCount +
          'EMI’s), out of which only a sum  of Rs. ';
        tempString +=
          this.typeService.numberWithCommas(amount) +
          '/- (Rupees ' +
          this.typeService.inWords(amount);
        tempString +=
          ') has been credited through your ' +
          type +
          ' in the account of my client.</li>';
        return tempString;
      }
      return '';
    } catch (error) { }
    return '';
  }
  //#endregion

  // add in data base
  async create(data): Promise<LegalNoticeEntity> {
    try {
      return await this.repository.create<LegalNoticeEntity>(data);
    } catch (error) {
      return;
    }
  }

  //#region find all legal notice by loan ID
  async findAllByLoanID(loanId: number) {
    try {
      return await this.repository.findAll({
        where: { loanId },
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
          'isActive',
        ],
        order: [['id', 'DESC']],
        raw: true,
        nest: true,
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
      });
    } catch (error) {
      return '500';
    }
  }



}
