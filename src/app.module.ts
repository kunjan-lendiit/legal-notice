import { AppService } from './app.service';
import { AppProvider } from './app.provider';
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APIService } from './utils/api.service';
import { FileService } from './utils/file.service';
import { TypeService } from './utils/type.service';
import { DatabaseModule } from './database/db.module';
import { ValidationService } from './utils/validation.service';
import { LegalNoticeService } from './legal-notice/legalNotice.service';
import { BankServiceV1 } from './misc/bank.service';
import { EMIServiceV1 } from './emi/emi.service';
import { LoanServiceV1 } from './loan/loan.service';
import { LegalNoticeController } from './legal-notice/legalNotice.controller';
@Global() 
@Module({
  imports: [DatabaseModule],
  exports: [FileService],
  controllers: [AppController,LegalNoticeController],
  providers: [
    APIService,
    BankServiceV1,
    TypeService,
    FileService,
    EMIServiceV1,
    LoanServiceV1,
    LegalNoticeService,
    AppService,
    ValidationService,
    ...AppProvider,
  ],
})
export class AppModule {}
