import {
    APPROVEDLOANAMOUNTFROMSALARY_REPOSITORY,
    CHAT_DOCUMENTENTITY_REPOSITORY,
    EMPLOYEEDETAILS_HISTORY_REPOSITORY,
    EMPLOYEEDETAILS_REPOSITORY,
    LEGAL_NOTICE_REPOSITORY,
    LOANTRANSACTION_REPOSITORY,
    TOTAL_BANK_REPOSITORY,
    SALARYGRADE_REPOSITORY,
    SCORECARD_REPOSITORY,
    SCORINGFIELDGROUP_REPOSITORY,
    SCORINGFIELD_REPOSITORY,
    SCORING_REPOSITORY,
    TRACKUSER_REPOSITORY,
    USERHISTORY_REPOSITORY,
    USERNETBANKINGDETAILES_REPOSITORY,
    USER_REPOSITORY,
    EMIENTITY_REPOSITORY,
    ADMIN_REPOSITORY,
    NETHISTORY_REPOSITORY,
    LOCATION_REPOSITORY,
    UPIENTITY_REPOSITORY,
    MANUAL_AUTO_DEBIT_ENTITY_REPOSITORY,
    DISBURSEMENTENTITY_REPOSITORY,
    CHANGE_LOGS_REPOSITORY,
    ADMINROLEMODULE_REPOSITORY,
    BANKING_REPOSITORY,
    GOOGLE_COORDINATES_REPOSITORY,
    SUBSCRIPTION_ENTITY,
    ESIGN_REPOSITORY,
    CRMACTIVITY_REPOSITORY,
    ADMINLOGGERENTITY_REPOSITORY,
    STAMP_REPOSITORY,
    TRANSACTION_REPOSITORY,
    CONTACT_DETAILS_REPOSITORY,
    RAZORPAYMENT_REPOSITORY,
    PARTIALENTITY_REPOSITORY,
    ORDERENTITY_REPOSITORY,
    PAYMENT_ENTITY_REPOSITORY,
  } from 'src/constants/entities';
  import { trackUser } from 'src/entities/track.entity';
  import { registeredUsers } from 'src/entities/user.entity';
  import { employmentDetails } from 'src/entities/employment.entity';
  import { ChatDocumentEntity } from 'src/entities/media.entity';
  import { loanTransaction } from 'src/entities/loan.entity';
  import { EmploymentHistoryDetailsEntity } from 'src/entities/employment.history.entity';
  import { userNetBankingDetails } from 'src/entities/netBanking.entity';
  import { LegalNoticeEntity } from 'src/entities/notice.entity';
  import { bank } from 'src/entities/bank.entity';
  import { approvedLoanAmountFromSalary } from 'src/entities/salary.range.entity';
  import { scoring } from 'src/entities/scoring.entity';
  import { scoringFieldGroup } from 'src/entities/score.group.entity';
  import { scoringField } from 'src/entities/score.field.entity';
  import { scoreCard } from 'src/entities/score.card.entity';
  import { salaryGrade } from 'src/entities/salary.grade.entity';
  import { EmiEntity } from 'src/entities/emi.entity';
  import { admin } from 'src/entities/admin.entity';
  import { NetHistoryEntity } from 'src/entities/netHistory.entity';
  import { LocationEntity } from 'src/entities/location.entity';
  import { UPIEntity } from 'src/entities/upi.entity';
  import { ManualAutoDebitEntity } from 'src/entities/manual.auto.debit';
  import { disbursementEntity } from 'src/entities/disbursement.entity';
  import { ChangeLogsEntity } from 'src/entities/change.logs.entity';
  import { adminRoleModule } from 'src/entities/role.module.entity';
  import { BankingEntity } from 'src/entities/banking.entity';
  import { GoogleCoordinatesEntity } from 'src/entities/googleCoordinates.entity';
  import { SubScriptionEntity } from 'src/entities/subscription.entity';
  import { esignEntity } from 'src/entities/esign.entity';
  import { crmActivity } from 'src/entities/crm.entity';
  import { stamp } from 'src/entities/stamp.entity';
  import { TransactionEntity } from 'src/entities/transaction.entity';
  import { contactDetailEntity } from 'src/entities/contact.entity';
  import { RazorPaymentEntity } from 'src/entities/razorpayment.entity';
  import { PartialEntity } from 'src/entities/partial.entity';
  import { OrderEntity } from 'src/entities/order.entity';
  import { PaymentEntity } from 'src/entities/payment.entity';
  
  export const AppProvider = [
    //Profile
    {
      provide: USER_REPOSITORY,
      useValue: registeredUsers,
    },
    {
      provide: LOCATION_REPOSITORY,
      useValue: LocationEntity,
    },
    {
      provide: GOOGLE_COORDINATES_REPOSITORY,
      useValue: GoogleCoordinatesEntity,
    },
    {
      provide: TRACKUSER_REPOSITORY,
      useValue: trackUser,
    },
  
  
    //Employment
    {
      provide: EMPLOYEEDETAILS_REPOSITORY,
      useValue: employmentDetails,
    },
    {
      provide: EMPLOYEEDETAILS_HISTORY_REPOSITORY,
      useValue: EmploymentHistoryDetailsEntity,
    },
  
    //Loan
    {
      provide: LOANTRANSACTION_REPOSITORY,
      useValue: loanTransaction,
    },
  
    //EMI
    {
      provide: EMIENTITY_REPOSITORY,
      useValue: EmiEntity,
    },
    {
      provide: PARTIALENTITY_REPOSITORY,
      useValue: PartialEntity,
    },
    {
      provide: ORDERENTITY_REPOSITORY,
      useValue: OrderEntity,
    },
    {
      provide: PAYMENT_ENTITY_REPOSITORY,
      useValue: PaymentEntity,
    },
  
    //UPI
    {
      provide: UPIENTITY_REPOSITORY,
      useValue: UPIEntity,
    },
  
    //UPI
    {
      provide: MANUAL_AUTO_DEBIT_ENTITY_REPOSITORY,
      useValue: ManualAutoDebitEntity,
    },
  
    //Disbursement
    {
      provide: DISBURSEMENTENTITY_REPOSITORY,
      useValue: disbursementEntity,
    },
  
    //Media
    {
      provide: CHAT_DOCUMENTENTITY_REPOSITORY,
      useValue: ChatDocumentEntity,
    },
  
    //NetBanking
    {
      provide: USERNETBANKINGDETAILES_REPOSITORY,
      useValue: userNetBankingDetails,
    },
  
    //NetBanking
    {
      provide: NETHISTORY_REPOSITORY,
      useValue: NetHistoryEntity,
    },
    {
      provide: BANKING_REPOSITORY,
      useValue: BankingEntity,
    },
  
    //Legal
    {
      provide: LEGAL_NOTICE_REPOSITORY,
      useValue: LegalNoticeEntity,
    },
  
    //Bank
    {
      provide: TOTAL_BANK_REPOSITORY,
      useValue: bank,
    },
  
    //Scoring
    {
      provide: APPROVEDLOANAMOUNTFROMSALARY_REPOSITORY,
      useValue: approvedLoanAmountFromSalary,
    },
    {
      provide: SALARYGRADE_REPOSITORY,
      useValue: salaryGrade,
    },
    {
      provide: SCORING_REPOSITORY,
      useValue: scoring,
    },
    {
      provide: SCORECARD_REPOSITORY,
      useValue: scoreCard,
    },
    {
      provide: SCORINGFIELD_REPOSITORY,
      useValue: scoringField,
    },
    {
      provide: SCORINGFIELDGROUP_REPOSITORY,
      useValue: scoringFieldGroup,
    },
  
    //Admin
    {
      provide: ADMIN_REPOSITORY,
      useValue: admin,
    },
    {
      provide: CRMACTIVITY_REPOSITORY,
      useValue: crmActivity,
    },
    {
      provide: ADMINROLEMODULE_REPOSITORY,
      useValue: adminRoleModule,
    },
    {
      provide: CHANGE_LOGS_REPOSITORY,
      useValue: ChangeLogsEntity,
    },
  
    //Contacts
    {
      provide: CONTACT_DETAILS_REPOSITORY,
      useValue: contactDetailEntity,
    },
  
    //Mandate
    {
      provide: SUBSCRIPTION_ENTITY,
      useValue: SubScriptionEntity,
    },
  
    //ESign
    {
      provide: ESIGN_REPOSITORY,
      useValue: esignEntity,
    },

    {
      provide: STAMP_REPOSITORY,
      useValue: stamp,
    },
  
    //Transactions
    {
      provide: TRANSACTION_REPOSITORY,
      useValue: TransactionEntity,
    },
    {
      provide: RAZORPAYMENT_REPOSITORY,
      useValue: RazorPaymentEntity,
    },
    {
      provide: PARTIALENTITY_REPOSITORY,
      useValue: PartialEntity,
    },
    // order
    {
      provide: ORDERENTITY_REPOSITORY,
      useValue: OrderEntity,
    },
    //
    {
      provide: PAYMENT_ENTITY_REPOSITORY,
      useValue: PaymentEntity,
    },
  ];
  