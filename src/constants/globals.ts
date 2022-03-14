//Interest rate
export const MIN_FEMALE_INTEREST = 0.175;
export const MAX_FEMALE_INTEREST = 0.2;
export const MIN_MALE_INTEREST = 0.375;
export const MAX_MALE_INTEREST = 0.4;

//Fees
export const PROCESSING_FEES = 5;
export const STAMP_FEES = 320;

//Eligibility
export const NEXT_LOAN_AMOUNT_DISCOUNT = 0.1;
export const LOYALTY_AVG_BALANCE_DISCOUNT = NEXT_LOAN_AMOUNT_DISCOUNT * 2;
export const LOYALTY_SETTLEMENT_RATIO = 0.8;
export const MAX_LOAN_AMOUNT = 50000;
export const MIN_LOAN_AMOUNT = 10000;
export const MAX_SALARY_PORTION = 0.8;

export const GOOGLE_MAP_API = 'https://maps.googleapis.com/maps/';

// CommonService
export const locationAddressURL = `${GOOGLE_MAP_API}api/geocode/json?`;

//KYC
export const AADHAAR_XML = 'aadhaar_xml';
export const DRIVING_LICENCE = 'Driving licence';
export const FRONT_SIDE_OF_DRIVING_LICENSE = 'front_side_of_driving_license';
export const BACK_SIDE_OF_DRIVING_LICENSE = 'back_side_of_driving_licence';
export const VOTER_ID = 'Voter Id';
export const FRONT_SIDE_OF_VOTER_ID = 'front_side_of_voterId';
export const BACK_SIDE_OF_VOTER_ID = 'back_side_of_voterId';
export const PASSPORT = 'Passport';
export const FRONT_SIDE_OF_PASSPORT = 'front_side_of_passport';
export const BACK_SIDE_OF_PASSPORT = 'back_side_of_passport';

// Signdesk
export const APPLICATION_ID =
  'lenditt-innovations-technologies-pvt-ltd_kyc_live';
export const MAX_PRINCIPAL_PORTION = 0.9;

//Location
export const MAX_LAT_LIMIT = 0.000045;
export const MAX_BEARING_LIMIT = 0.001;
export const INDIA_CENTER_LAT = 22.7357804;
export const INDIA_CENTER_LONG = 78.757966;

export const MAX_LAT_ADDRESS_LIMIT = 0.000115;
export const MAX_BEARING_ADDRESS_LIMIT = 0.0015;

//Admin - Frontend
export const PAGE_LIMIT = 10;

//Cashfree
export const CASHFREE_PLAN_ID =
  process.env.MODE == 'PROD'
    ? process.env.CASHFREE_PLAN_ID_PROD
    : process.env.CASHFREE_PLAN_ID_DEV;

//Lenditt
export const APP_NAME = 'Lenditt';
export const NBFC_NAME = 'Chinmay Finlease Ltd.';
export const CHINMAY_ADDRESS =
  'Mahesh bhuvan, Azad chowk, bhabhar, Dist : Banaskanth, 385230';
