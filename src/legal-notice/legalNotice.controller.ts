import { Body, Controller,Post, Res } from '@nestjs/common';
import {
  kBadRequest,
  kInternalError,
  kParamsMissing,
} from '../constants/responses';
import { LegalNoticeService } from './legalNotice.service';

@Controller('v1/legalNotice')
export class LegalNoticeController {
  constructor(private readonly service: LegalNoticeService) {}

  @Post('createLegalNotice')
  async createLegalNotice(@Body() body, @Res() res) {
    try {
        
      if (!body || !body.loanId || !body.adminId)
        return res.json(kParamsMissing);
      else {
        const result = await this.service.createLegalNotice(
          body.loanId,
          body.adminId,
        );
        if (!result || result == '500') return res.json(kInternalError);
        else if (result == '302') return res.json(kBadRequest);
        return res.json({
          statusCode: 200,
          valid: true,
          message: 'SUCCESS',
          data: result,
        });
      }
    } catch (error) {
      return res.json(kInternalError);
    }
  }

}
