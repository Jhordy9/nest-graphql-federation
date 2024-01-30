import * as mongoose from 'mongoose';

export const ContactsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cellphone: { type: String, required: true },
  },
  { collection: 'Contacts' },
);

export type Contact = {
  _id: string;
  name: string;
  cellphone: string;
} & mongoose.Document;
