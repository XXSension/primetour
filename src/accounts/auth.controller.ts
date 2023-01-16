import { Controller, All, Query, Res } from '@nestjs/common';
import { AuthField } from 'src/interfaces/auth-field.interfaces';
import { AccountsService } from './accounts.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private accountService: AccountsService) {}

  @All('/callback')
  async callback(@Query() query: AuthField, @Res() res: Response) {
    return res.redirect(await this.accountService.performCallback(query));
  }
}
