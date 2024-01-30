import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContactsInput {
  @Field()
  name: string;

  @Field()
  cellphone: string;
}
