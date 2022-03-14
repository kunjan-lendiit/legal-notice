import { Inject, Injectable } from '@nestjs/common';
import { loanTransaction } from 'src/entities/loan.entity';
import {
  LOANTRANSACTION_REPOSITORY,
} from '../constants/entities';
import { registeredUsers } from 'src/entities/user.entity';
import { disbursementEntity } from 'src/entities/disbursement.entity';
import { EmiEntity } from 'src/entities/emi.entity';
import { AutoPayEntity } from 'src/entities/auto.pay.entity';
import { PartialEntity } from 'src/entities/partial.entity';


@Injectable()
export class LoanServiceV1 {
  constructor(
    @Inject(LOANTRANSACTION_REPOSITORY)
    private readonly repository: typeof loanTransaction,
  ) { }
 
  async findOneByIdForLegal(id: number) {
    try {
      const loanList = await this.repository.findAll({
        where: { id, loanStatus: 'Active' },
        attributes: [
          'id',
          'userId',
          'netApprovedAmount',
          'approvedDuration',
          'netEmiData',
        ],
        include: [
          {
            attributes: [
              'fullName',
              'email',
              'phone',
              'aadharAddress',
              'panNumber',
            ],
            model: registeredUsers,
          },
          {
            attributes: [
              'utr',
              'ifsc',
              'account_number',
              'bank_name',
              'createdAt',
            ],
            model: disbursementEntity,
          },
          {
            attributes: [
              'id',
              'emi_amount',
              'penalty',
              'payment_due_status',
              'payment_status',
              'upiPayId',
              'paymentId',
              'autoPayId',
              'penalty_days',
              'emi_date',
            ],
            model: EmiEntity,
            include: [
              {
                attributes: ['id', 'status', 'signdesk_response', 'createdAt'],
                model: AutoPayEntity,
              },
            ],
          },
          {
            attributes: ['amount', 'type', 'status', 'emiId'],
            model: PartialEntity,
          },
        ],
      });
    
      
      if (loanList.length === 0) return;
       const loanData: loanTransaction = loanList.map((element) =>
        element.get({ plain: true }),
      )[0] as loanTransaction;
      return loanData;
    } catch (error) {
        console.log(error);
        
     }
  }
}
