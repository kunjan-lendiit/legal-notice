export const kSuccessData = {
  data: {},
  message: 'SUCCESS',
  statusCode: 200,
  valid: true,
};

export const kNeedOfficialSalarySlip = {
  message: 'Please upload official salary slip',
  statusCode: 301,
  valid: false,
};

export const kNotEligibleForBalance = {
  message: 'You are not eligible for the loan as per the eligibility criteria',
  statusCode: 302,
  valid: false,
};

export const kBadRequest = {
  message: 'BAD_REQUEST',
  statusCode: 302,
  valid: false,
};

export const kParamsMissing = {
  message: 'REQUIRED_PARAMS_MISSING',
  statusCode: 422,
  valid: false,
};

export const kInternalError = {
  message: 'INTERNAL_SERVER_ERROR',
  statusCode: 500,
  valid: false,
};


export const kNoDataFound = {
  statusCode: 404,
  valid: false,
  message: 'NO_DATA_FOUND',
  data: {},
};

export const kUnproccesableEntity = {
  statusCode: 422,
  valid: false,
  message: 'FAILED',
  data: {},
};

// KYC
export const kWrongDetails = {
  statusCode: 422,
  message: 'Wrong details',
  valid: false,
  data: { message: 'Wrong details' },
};

export const kWrongOtp = {
  statusCode: 422,
  message: 'Wrong OTP',
  valid: false,
  data: { message: 'Wrong details Wrong OTP' },
};

export const kAadharAlreadyExist = {
  statusCode: 422,
  message: 'Aadhar already exist',
  valid: false,
  data: { message: 'Aadhar already exist' },
};

export const kAadharNotProcess = {
  statusCode: 200,
  message:
    'Aadhaar card could not be processed, gone for manual verification',
  valid: false,
  data: {
    message:
      'Aadhaar card could not be processed, gone for manual verification',
  },
};

export const kBadFormatPAN = {
  statusCode: 422,
  message:
    'The format and content used in the request for PAN are mismatched',
  valid: false,
  data: {
    message:
      'The format and content used in the request for PAN are mismatched',
    status: '0',
  },
};