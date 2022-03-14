import { Inject, Injectable } from '@nestjs/common';
import { TOTAL_BANK_REPOSITORY } from '../constants/entities';
import { bank } from '../entities/bank.entity';

@Injectable()
export class BankServiceV1 {
  constructor(
    @Inject(TOTAL_BANK_REPOSITORY)
    private readonly repository: typeof bank,
  ) {}
  async findBankNameByBankCode(bankCode: string): Promise<any> {
    try {
      return (
        await this.repository.findOne({
          where: { bankCode },
          raw: true,
          attributes: ['bankName'],
        })
      )['bankName'];
    } catch (error) {
      return;
    }
  }

  async getBanks() {
    try {
      return await this.repository.findAll({
        where: { statusFlag: '1' },
        attributes: ['bankName', 'bankCode', 'netBankingService', 'pdfService'],
        raw: true,
      });
    } catch (error) {
      return '500';
    }
  }
}
