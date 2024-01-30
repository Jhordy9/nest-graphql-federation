import { Inject, Injectable } from '@nestjs/common';
import { Contact } from './schemas/contacts';
import { Model } from 'mongoose';
import { CreateContactsInput } from './dto/create-contacts.input';
import { PrismaService } from './providers/prisma.service';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('CONTACTS_MODEL')
    private catModel: Model<Contact>,
    private prisma: PrismaService,
  ) {}

  async createMacapaContacts(
    createContactsInput: [CreateContactsInput],
    userId: string,
  ) {
    const contacts = await Promise.all(
      createContactsInput.map((contact) =>
        this.prisma.contact.create({
          data: { ...contact, createdBy: userId },
          select: { id: true, name: true, cellphone: true, client: true },
        }),
      ),
    );

    return contacts;
  }

  async createVarejaoContacts(
    createContactsInput: [CreateContactsInput],
    userId: string,
  ) {
    const formatContacts = createContactsInput.map(({ cellphone, name }) => ({
      cellphone: this.formatPhoneNumber(cellphone),
      name,
      createdBy: userId,
    }));

    const contacts = await this.catModel.insertMany(formatContacts);

    return contacts.map((contact) => ({
      id: contact._id,
      name: contact.name,
      cellphone: contact.cellphone,
      client: contact.client,
    }));
  }

  private formatPhoneNumber(input: string) {
    const cleanedNumber = input.replace(/\D/g, '');
    const match = cleanedNumber.match(/^(\d{1,2})(\d{2})(\d{4,10})$/);

    if (!match) {
      return input;
    }

    const [, countryCode, areaCode, phoneNumber] = match;
    const formattedNumber = `+${countryCode} (${areaCode}) ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;

    return formattedNumber;
  }
}
