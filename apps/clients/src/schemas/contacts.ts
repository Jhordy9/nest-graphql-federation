import * as mongoose from 'mongoose';

export const ContactsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cellphone: { type: String, required: true },
    createdBy: { type: String, required: true },
    client: { type: String, default: 'Varejão', required: true },
  },
  { collection: 'Contacts' },
);

export type Contact = {
  _id: string;
  name: string;
  cellphone: string;
  client: string;
  createdBy: string;
} & mongoose.Document;
