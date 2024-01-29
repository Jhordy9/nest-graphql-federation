import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignIn {
  @Field()
  accessToken: string;
}
