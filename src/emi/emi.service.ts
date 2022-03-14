import { Inject, Injectable } from '@nestjs/common';
import { EmiEntity } from 'src/entities/emi.entity';
import { TypeService } from 'src/utils/type.service';
import { EMIENTITY_REPOSITORY } from 'src/constants/entities';

@Injectable()
export class EMIServiceV1 {
  constructor(
    @Inject(EMIENTITY_REPOSITORY)
    private readonly repository: typeof EmiEntity,
    private readonly typeService: TypeService,
  ) { }

  async updateLegalDataEMIWise(loanId: number, legalId: number) {
    try {
      await this.repository.update(
        { legalId },
        { where: { loanId, payment_due_status: '1', payment_status: '0' } },
      );
    } catch (error) {
      return '500';
    }
  }

}
