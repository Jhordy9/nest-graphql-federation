import * as mongoose from 'mongoose';
import { constants } from '../constants';
import { ContactsSchema } from '../schemas/contacts';

export const mongodbProvider = {
  provide: 'MONGODB_CONNECTION',
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(constants.mongoUrl as string),
};

export const contactsProvider = {
  provide: 'CONTACTS_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('Contacts', ContactsSchema),
  inject: ['MONGODB_CONNECTION'],
};
