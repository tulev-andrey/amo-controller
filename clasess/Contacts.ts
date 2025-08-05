import Amo from './Amo';
import { Contact } from '../types/contact';
import Entity from './base/Entity';
import { CustomField } from '../types/custom_fields';

export default class Contacts extends Entity<'contacts', Contact> {
  constructor(protected amo: Amo) {
    super(amo, 'contacts');
  }

  public async getByCode(
    query: string,
    code: 'PHONE' | 'EMAIL',
  ): Promise<Contact[] | null> {
    if (!query) return null;
    if (code === 'PHONE') {
      query = query.replace(/\D/g, '');
      if (query.length === 12) query = query.substring(1);
    }

    const result: Contact[] = [];
    const contacts = await this.get({ query });
    if (!contacts) return null;

    for (const contact of contacts) {
      const field = this.getCustomFieldByCode(contact, code);
      if (field) {
        if (field.values.map((value) => value.value).includes(query)) {
          result.push(contact);
        }
      }
    }

    return result;
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
}
