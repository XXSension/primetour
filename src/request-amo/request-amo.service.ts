import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { logger } from 'src/logger/logger';

@Injectable()
export class RequestAmoService {
  api: AxiosInstance;
  constructor(
    @Inject(forwardRef(() => AccountsService))
    private accountService: AccountsService,
    private authService: AuthService,
  ) {
    this.api = accountService.createConnector(29865034);
  }

  async searcContackAmo(appeal) {
    const contactArray = [];
    if (
      appeal.telephone != '' &&
      appeal.telephone == undefined &&
      appeal.telephone == null
    ) {
      const contact = await this.api
        .get(`/api/v4/contacts?query=${appeal.telephone}`)
        .then((response) => response)
        .catch((err) => logger.error(err));
      if (contact.data != '') {
        const contact1 = contact.data._embedded.contacts[0].id;
        contactArray.push(contact1);
      }
    }
    if (
      appeal.email != '' &&
      appeal.email == undefined &&
      appeal.email == null
    ) {
      const contact = await this.api
        .get(`/api/v4/contacts?query=${appeal.email}`)
        .then((response) => response)
        .catch((err) => logger.error(err));
      if (contact.data != '') {
        const contact1 = contact.data._embedded.contacts[0].id;
        contactArray.push(contact1);
      }
    }
    return contactArray;
  }

  async checkContact(appeal) {
    const contact = await this.searcContackAmo(appeal);
    if (contact[0] == contact[1]) {
      return contact[0];
    } else if (contact[0] && !contact[1]) {
      return contact[0];
    } else if (!contact[0] && contact[1]) {
      return contact[1];
    }
    return false;
  }
  async addAmoLeads(appeal) {
    const contactId = await this.checkContact(appeal);
    if (contactId) {
      const leadId = await this.apiLead(appeal, contactId);
      await this.addNotesAmo(appeal, leadId);
    } else {
      const leadId = await this.apiLeadsComplex(appeal);
      await this.addNotesAmo(appeal, leadId);
    }
  }
  //Добавление сделки с контактом
  async apiLeadsComplex(appeal) {
    const data = await this.api
      .post('/api/v4/leads/complex', {
        params: {
          name: 'Обращение с UON',
          status_id: 44581372, //заменить
          pipeline_id: 4930141, //заменить
          price: appeal.budget ? appeal.budget : 0,
          _embedded: {
            contacts: [
              {
                first_name: appeal.name,
                custom_fields_values: [
                  {
                    field_code: 'PHONE',
                    values: [
                      {
                        value: appeal.telephone ? appeal.telephone : '',
                      },
                    ],
                  },
                  {
                    field_code: 'EMAIL',
                    values: [
                      {
                        value: appeal.email ? appeal.email : '',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      })
      .then((response) => response.data[0].id) //узнать что возращает
      .catch((err) => logger.error(err));
    return data;
  }
  //Добавление сделки существующего контакта
  async apiLead(appeal, contactId) {
    const data = await this.api
      .post('/api/v4/leads', {
        params: {
          name: 'Обращение с UON',
          status_id: 44581372,
          pipeline_id: 4930141,
          price: appeal.budget ? appeal.budget : 0,
          _embedded: {
            contacts: {
              first_name: appeal.name,
              custom_fields_values: [
                {
                  id: contactId,
                },
              ],
            },
          },
        },
      })
      .then((response) => response.data[0].id) //узнать что возращает
      .catch((err) => logger.error(err));
    return data;
  }
  //Добавление примечание к сделке
  async addNotesAmo(appeal, leadId) {
    await this.api
      .post('/api/v4/leads/notes', {
        params: {
          entity_id: leadId,
          note_type: 'common',
          params: {
            text: `Примечание от клиента: ${
              appeal.notes ? appeal.notes : 'Клиент не оставил примечаний'
            } Желаемая дата начала тура ${
              appeal.desired_date_from ? appeal.desired_date_from : 'нет данных'
            }, Желаемая дата окончания тура ${
              appeal.desired_date_before
                ? appeal.desired_date_before
                : 'Нет данных'
            } Желаемое количество ночей ${
              appeal.desired_number_of_nights
                ? appeal.desired_number_of_nights
                : 'Нет данных'
            }`,
          },
        },
      })
      .then((response) => response)
      .catch((err) => logger.error(err));
  }
}
