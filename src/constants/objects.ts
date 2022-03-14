import { extname } from 'path';
import * as env from 'dotenv';
import { diskStorage } from 'multer';

env.config();

export const kUploadFileObj = {
  storage: diskStorage({
    destination: './',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${extname(file.originalname)}`);
    },
  }),
};

export const kBigFonts = {
  font: {
    size: 16,
  },
  alignment: {
    wrapText: true,
  },
};
export const kSmallFonts = {
  font: {
    size: 12,
  },
  alignment: {
    wrapText: true,
  },
};

// Signdesk
export const kSignDeskUploadBody = {
  enc_mode: 'symmetric',
  api_data: '',
  is_encrypted: true,
};
// Signdesk end

// Cashfree
export const CASHFREE_HEADERS =
  process.env.MODE == 'PROD'
    ? {
        'X-Client-Id': process.env.CASHFREE_CLIENT_ID_PROD,
        'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET_PROD,
      }
    : {
        'X-Client-Id': process.env.CASHFREE_CLIENT_ID_DEV,
        'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET_DEV,
      };

export const CASHFREE_BANK_LIST = [
  'BARB',
  'CBIN',
  'CIUB',
  'CNRB',
  'COSB',
  'DEUT',
  'DLXB',
  'ESFB',
  'FDRL',
  'HDFC',
  'IBKL',
  'ICIC',
  'IDFB',
  'INDB',
  'KARB',
  'KKBK',
  'MAHB',
  'PUNB',
  'PYTM',
  'RATN',
  'SBIN',
  'SCBL',
  'TMBL',
  'USFB',
  'UTIB',
  'YESB',
  'SIBL',
  'DBSS',
  'JSFB',
  'HSBC',
  'KVBL',
  'CITI',
  'DCBL',
  'BDBL',
  'UCBA',
  'IDIB',
  'UBIN',
  'CSBK',
  'VARA',
  'KVGB',
  'APGB',
];

export const kCFMockChargeInit = {
  status: 'OK',
  message: 'Subscription charge initialized',
  payment: {
    paymentId: 3609399,
    subReferenceId: 2899358,
    currency: 'INR',
    amount: 1,
    cycle: 2,
    status: 'INITIALIZED',
    remarks: 'Charge Subscription',
    addedOn: '2022-02-27 15:57:33',
    scheduledOn: '2022-02-28',
    initiatedOn: '2022-02-27',
    retryAttempts: 0,
  },
};

// ##### Msg91
export const kMSG91Headers = {
  authkey: process.env.MSG91_AUTH_KEY,
  'content-type': 'application/JSON',
};

// ##### Razorpay
export const kRazorpayHeaders = {
  Authorization:
    'Basic ' +
    Buffer.from(
      process.env.RAZOR_PAY_ID + ':' + process.env.RAZOR_PAY_KEY,
    ).toString('base64'),
};

// ##### SendinBlue
export const kSendingBlueAuth = {
  user: process.env.SENDINBLUE_USER,
  pass: process.env.SENDINBLUE_PASS,
};

export const kScoreFieldObjectList = [
  { id: 9, name: 'Opening balance', key: 'openingBalance' },
  { id: 10, name: 'Closing balance', key: 'closeBalance' },
  { id: 11, name: 'Total number of inflow count', key: 'inFlowCount' },
  { id: 12, name: 'Total number of inflow amount', key: 'inFlowAmount' },
  { id: 13, name: 'Total number of outflow count', key: 'outFlowCount' },
  { id: 14, name: 'Total number of outflow amount', key: 'outFlowAmount' },
  {
    id: 15,
    name: 'Total number of cash withdrawal count',
    key: 'cashWithdrawalCount',
  },
  {
    id: 16,
    name: 'Total number of cash withdrawal amount',
    key: 'cashWithdrawalAmount',
  },
  {
    id: 17,
    name: 'Total number of salary count',
    key: 'incomeCount',
  },
  {
    id: 18,
    name: 'Total number of salary amount',
    key: 'incomeAmount',
  },
  {
    id: 19,
    name: 'Total number of credit card count',
    key: 'creditCardCount',
  },
  {
    id: 20,
    name: 'Total number of credit card amount',
    key: 'creditCardAmount',
  },
  {
    id: 21,
    name: 'Total number of loan count',
    key: 'loanCount',
  },
  {
    id: 22,
    name: 'Total number of loan amount',
    key: 'loanAmount',
  },
  {
    id: 23,
    name: 'Total number of bank charges count',
    key: 'bankChargeCount',
  },
  {
    id: 24,
    name: 'Total number of bank charges amount',
    key: 'bankChargeAmount',
  },
  {
    id: 25,
    name: 'Total number of bounce count',
    key: 'bounceCount',
  },
  {
    id: 26,
    name: 'Total number of bounce amount',
    key: 'bounceAmount',
  },
  {
    id: 27,
    name: 'Total number of investment count',
    key: 'investmentCount',
  },
  {
    id: 28,
    name: 'Total number of investment amount',
    key: 'investmentAmount',
  },
  {
    id: 29,
    name: '5th day balance',
    key: 'balance5',
  },
  {
    id: 30,
    name: '10th day balance',
    key: 'balance10',
  },
  {
    id: 31,
    name: '15th day balance',
    key: 'balance15',
  },
  {
    id: 32,
    name: '20th day balance',
    key: 'balance20',
  },
  {
    id: 33,
    name: '25th day balance',
    key: 'balance25',
  },
  {
    id: 34,
    name: '30th day balance',
    key: 'balance30',
  },
];

export const kAgreementStatics = [
  '##loanId##',
  '##fullName1##',
  '##borrowerName1##',
  '##fullName##',
  '##aadhaarNumber##',
  '##AadhaarAddress##',

  '##date1##',
  '##date2##',
  '##netApporvedAmount##',
  '##finalLoanAmount##',
  '##loanAmount##',
  '##loanPurpose##',
  '##purpose##',
  '##totalRepay##',
  '##loanInterest##',
  '##interest##',
  '##interest1##',
  '##loanInterest1##',
  '##loanDays##',
  '##approvedDay##',

  '##repaymentDate1##',
  '##principalAmount1##',
  '##emiInterestAmount1##',
  '##daysInterestCalc1##',
  '##emiRateOfInterest1##',
  '##repaymentAmount1##',

  '##repaymentDate2##',
  '##principalAmount2##',
  '##emiInterestAmount2##',
  '##daysInterestCalc2##',
  '##emiRateOfInterest2##',
  '##repaymentAmount2##',

  '##repaymentDate3##',
  '##principalAmount3##',
  '##emiInterestAmount3##',
  '##daysInterestCalc3##',
  '##emiRateOfInterest3##',
  '##repaymentAmount3##',

  '##repaymentDate4##',
  '##principalAmount4##',
  '##emiInterestAmount4##',
  '##daysInterestCalc4##',
  '##emiRateOfInterest4##',
  '##repaymentAmount4##',

  '##fees##',
  '##stamp##',

  '##appName##',
  '##officeAddress##',
  '##lenderName##',
  '##nbfcName##',
  '##nbfcName1##',

  '##repaymentDate12##',
  '##day1##',
  '##month1##',
  '##year1##',
  '##agreementDate1##',
  '##agreementDate##',
  '##stampNumber##',
];

export const kMonths = [
  'January ',
  'February ',
  'March ',
  'April ',
  'May ',
  'June ',
  'July ',
  'August ',
  'September ',
  'October ',
  'November ',
  'December ',
];
