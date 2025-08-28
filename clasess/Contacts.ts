import Amo from './Amo';
import { Contact } from '../types/contact';
import Entity from './base/Entity';
import { CustomField } from '../types/custom_fields';
import { QueryParams } from '../types/query_params';

export default class Contacts extends Entity<'contacts', Contact> {
  constructor(protected amo: Amo) {
    super(amo, 'contacts');
  }

  public async getByCode(
    query: string,
    code: 'PHONE' | 'EMAIL',
    params: QueryParams = {},
  ): Promise<Contact[] | null> {
    if (!query) return null;
    if (code === 'PHONE') query = this.chorePhone(query);
    if (code === 'EMAIL') query = this.choreEmail(query);

    const result: Contact[] = [];
    const contacts = await this.get({ ...params, query });
    if (!contacts) return null;

    for (const contact of contacts) {
      const field = this.getCustomFieldByCode(contact, code);
      if (field) {
        const values = field.values.map((value) => value.value);
        const test = values.some((value) => {
          if (code === 'PHONE') return query === this.chorePhone(value);
          if (code === 'EMAIL') return query === this.choreEmail(value);
          return false;
        });
        if (test) {
          result.push(contact);
        }
      }
    }

    return result.length ? result : null;
  }

  public getCustomFieldByCode(
    entity: Contact,
    code: 'PHONE' | 'EMAIL',
  ): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_code && field.field_code === code) return field;
    });
    return field || null;
  }

  chorePhone(phone: string) {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) phone = phone.substring(1);
    return phone;
  }

  choreEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
