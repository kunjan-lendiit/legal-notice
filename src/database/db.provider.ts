import { UPIEntity } from 'src/entities/upi.entity';
import { databaseConfig } from './db.config';
import { Sequelize } from 'sequelize-typescript';
import { EmiEntity } from 'src/entities/emi.entity';
import { registeredUsers } from 'src/entities/user.entity';
import { loanTransaction } from 'src/entities/loan.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { PaymentEntity } from 'src/entities/payment.entity';
import { LegalNoticeEntity } from 'src/entities/notice.entity';
import { mandateEntity } from 'src/entities/mandate.entity';
import { ManualAutoDebitEntity } from 'src/entities/manual.auto.debit';
import { AutoPayEntity } from 'src/entities/auto.pay.entity';
import { RazorPaymentEntity } from 'src/entities/razorpayment.entity';
import { PartialEntity } from 'src/entities/partial.entity';
import { admin } from 'src/entities/admin.entity';
import { loanPurpose } from 'src/entities/loan.purpose.entity';
import { userLoanDecline } from 'src/entities/loan.decline.entity';
import { Residence } from 'src/entities/residence.entity';
import { employmentDetails } from 'src/entities/employment.entity';
import { employmentType } from 'src/entities/employment.type';
import { employmentSector } from 'src/entities/sector.entity';
import { employmentDesignation } from 'src/entities/designation.entity';
import { disbursementEntity } from 'src/entities/disbursement.entity';
import { LinkedInEntity } from 'src/entities/linkedIn.entity';
import { EmploymentHistoryDetailsEntity } from 'src/entities/employment.history.entity';
import { userHistory } from 'src/entities/user.history.entity';
import { ChatDocumentEntity } from 'src/entities/media.entity';
import { trackUser } from 'src/entities/track.entity';
import { userNetBankingDetails } from 'src/entities/netBanking.entity';
import { bank } from 'src/entities/bank.entity';
import { scoreCard } from 'src/entities/score.card.entity';
import { scoringField } from 'src/entities/score.field.entity';
import { scoringFieldGroup } from 'src/entities/score.group.entity';
import { scoring } from 'src/entities/scoring.entity';
import { salaryGrade } from 'src/entities/salary.grade.entity';
import { approvedLoanAmountFromSalary } from 'src/entities/salary.range.entity';
import { NetHistoryEntity } from 'src/entities/netHistory.entity';
import { LocationEntity } from 'src/entities/location.entity';
import { ChangeLogsEntity } from 'src/entities/change.logs.entity';
import { adminRoleModule } from 'src/entities/role.module.entity';
import { BankingEntity } from 'src/entities/banking.entity';
import { GoogleCoordinatesEntity } from 'src/entities/googleCoordinates.entity';
import { SubScriptionEntity } from 'src/entities/subscription.entity';
import { esignEntity } from 'src/entities/esign.entity';
import { crmActivity } from 'src/entities/crm.entity';
import { AdminloggerEntity } from 'src/entities/adminlogger.entity';
import { stamp } from 'src/entities/stamp.entity';
import { device } from 'src/entities/device.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { contactDetailEntity } from 'src/entities/contact.entity';

export const DatabaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const config: any = databaseConfig.user;
      const sequelize = new Sequelize(config);
      const entities: any = [
        admin,
        crmActivity,
        adminRoleModule,
        approvedLoanAmountFromSalary,
        AutoPayEntity,
        ChangeLogsEntity,
        ChatDocumentEntity,
        disbursementEntity,
        EmiEntity,
        employmentDetails,
        employmentDesignation,
        EmploymentHistoryDetailsEntity,
        employmentSector,
        employmentType,
        esignEntity,
        LegalNoticeEntity,
        LinkedInEntity,
        loanTransaction,
        loanPurpose,
        LocationEntity,
        mandateEntity,
        ManualAutoDebitEntity,
        OrderEntity,
        PartialEntity,
        PaymentEntity,
        RazorPaymentEntity,
        registeredUsers,
        Residence,
        salaryGrade,
        scoring,
        scoreCard,
        scoringField,
        scoringFieldGroup,
        stamp,
        SubScriptionEntity,
        UPIEntity,
        userHistory,
        userLoanDecline,
        trackUser,
        NetHistoryEntity,
        BankingEntity,
        GoogleCoordinatesEntity,
        AdminloggerEntity,
        device,
        TransactionEntity,
      ];
      sequelize.addModels(entities);
      await sequelize.sync();
      return sequelize;
    },
  },
  {
    provide: 'SEQUELIZENETBANKINGDB',
    useFactory: async () => {
      const config: any = databaseConfig.netbanking;
      const sequelize = new Sequelize(config);
      const entities = [userNetBankingDetails, bank];
      sequelize.addModels(entities);
      await sequelize.sync();
      return sequelize;
    },
  },
  {
    provide: 'SEQUELIZECONTACTDB',
    useFactory: async () => {
      const config: any = databaseConfig.contact;
      const sequelize = new Sequelize(config);
      const entities = [contactDetailEntity];
      sequelize.addModels(entities);
      await sequelize.sync();
      return sequelize;
    },
  },
];
