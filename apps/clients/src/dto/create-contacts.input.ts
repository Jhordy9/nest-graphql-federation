import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateContactsInput {
  @Field()
  name: string;

  @Field()
  @Length(12)
  cellphone: string;
}
