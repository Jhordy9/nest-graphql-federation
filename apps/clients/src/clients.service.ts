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

  async createVarejaoContacts(createContactsInput: [CreateContactsInput]) {
    const contacts = await this.prisma.contact.createMany({
      data: createContactsInput,
      skipDuplicates: true,
    });

    return contacts;
  }

  async createMacapaContacts(createContactsInput: [CreateContactsInput]) {
    const contacts = await this.catModel.insertMany(createContactsInput);

    return contacts;
  }
}
