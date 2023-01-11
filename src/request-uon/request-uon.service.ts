import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppealService } from 'src/appeal/appeal.service';
import { logger } from 'src/logger/logger';
import { RequestAmoService } from 'src/request-amo/request-amo.service';

@Injectable()
export class RequestUonService {
  constructor(
    private appealService: AppealService,
    private requestAmoService: RequestAmoService,
  ) {}
  async getDataUon() {
    const apiKey = process.env.API_TOKEN_UON;
    const currentData = this.transformationData();
    const appealData = await axios
      .get(
        `https://api.u-on.ru/${apiKey}/leads/${currentData}/${currentData}/1.json`,
      )
      .then((response) => response.data.leads)
      .catch((err) => logger.error(err));
    if (appealData) {
      return this.currentDataAppeal(appealData);
    }
    return [];
  }

  transformationData(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  currentDataAppeal(appeals) {
    return appeals.map((appeal) => {
      return {
        id_system: appeal.id_system,
        name: appeal.client_name + appeal.client_surname,
        telephone:
          appeal.client_phone_mobile != null ? appeal.client_phone_mobile : '',
        email: appeal.client_email != null ? appeal.client_email : '',
        budget:
          appeal.client_requirements_budget != null
            ? appeal.client_requirements_budget
            : 0,
        desired_date_from:
          appeal.client_requirements_date_from != null
            ? appeal.client_requirements_date_from
            : '',
        desired_date_before:
          appeal.client_requirements_date_to != null
            ? appeal.client_requirements_days_to
            : '',
        desired_number_of_nights:
          appeal.client_requirements_days_to != null
            ? appeal.client_requirements_date_to
            : '',
        notes:
          appeal.client_requirements_note != null
            ? appeal.client_requirements_note
            : '',
      };
    });
  }

  async checkDataAppeal(): Promise<void> {
    const dataAppeal = await this.getDataUon();
    if (dataAppeal) {
      dataAppeal.forEach((appeal) => {
        this.checkAndSaveAppealInBD(appeal);
      });
    }
  }

  async checkAndSaveAppealInBD(appeal): Promise<void> {
    if (appeal.name && (appeal.telephone || appeal.email)) {
      if ((await this.appealService.findById(appeal.id_system)) == null) {
        const newData = this.appealService.create(appeal);
        this.requestAmoService.addAmoLeads(appeal);
      }
    }
  }
}
