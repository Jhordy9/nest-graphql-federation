import { Inject, Injectable } from '@nestjs/common';
import { Contact } from './schemas/contacts';
import { Model } from 'mongoose';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('CONTACTS_MODEL')
    private catModel: Model<Contact>,
  ) {}
}
