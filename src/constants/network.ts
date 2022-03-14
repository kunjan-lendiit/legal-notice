import * as env from 'dotenv';
env.config();

// ##### Cashfree
const CASHFREE_TEST_URL = 'https://test.cashfree.com/api/v2/';
const CASHFREE_PROD_URL = 'https://api.cashfree.com/api/v2/';
export const CASHFREE_BASE_URL =
  process.env.MODE == 'PROD' ? CASHFREE_PROD_URL : CASHFREE_TEST_URL;

export const CASHFREE_CREATE_PLAN = CASHFREE_BASE_URL + 'subscription-plans';
export const CF_SUBSCRIPTION = CASHFREE_BASE_URL + 'subscriptions';
export const CF_CHARGE = '/charge';

export const CASHFREE_RETURN_URL =
  process.env.MODE == 'PROD'
    ? process.env.CASHFREE_RETURN_URL_PROD
    : process.env.CASHFREE_RETURN_URL_DEV;

const faceXURL = 'https://www.facexapi.com/';
const getFaceData = 'get_image_attr';
export const extractFaceData = faceXURL + getFaceData;

// Signdesk
export const DOC_UPLOAD_URL =
  'https://kyc.signdesk.in/api/live/documentVerification';
export const OTP_SEND_URL = 'https://kyc.signdesk.in/api/live/submitOtp';

// MSG91
export const MSG91_URL = `https://api.msg91.com/api/v5/flow/`;

//Automation
export const WHATSAPP_URL = process.env.AUTOMATION_URL + 'whatsApp/';
export const SEND_WHATSAPP_MESSAGE = WHATSAPP_URL + 'sendMessage';

//Razorpay
const RAZORPAY_URL = 'https://api.razorpay.com/v1/';
export const RAZORPAY_CREATE_CUSTOMER = RAZORPAY_URL + 'customers';
export const RAZORPAY_CREATE_ORDER = RAZORPAY_URL + 'orders';

//Razorpay
export const RAZORPAY_API_URL = 'https://api.razorpay.com/v1/';
export const RAZORPAY_CALLBACK_URL = 'https://lendittapi.com:4500/payment/';

// Admin
export const UPLOAD_BANK_STATEMENT_URL =
  'https://lendittapi.com:3100/users/updateBankStatementDetails';
export const UpdateBankStatementDetails =
  process.env.NET_BANKING_URL + 'users/updateBankStatementDetails';
export const AddAdditionalAccount =
  process.env.NET_BANKING_URL + 'users/addAdditionalAccount';

// file Upload URL
export const UploadPDFFile =
  process.env.THE_BANKING_PRO_URL + 'statement/uploadPDFData';
