import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Contacts {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  cellphone: string;
}
