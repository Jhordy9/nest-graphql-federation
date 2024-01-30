import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Contacts } from './entities/contacts.entity';
import { CreateContactsInput } from './dto/create-contacts.input';
import { BadRequestException } from '@nestjs/common';

export type CurrentUser = {
  sub: string;
  email: string;
  iat: number;
};

@Resolver(() => [Contacts])
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Mutation(() => [Contacts])
  async createContacts(
    @CurrentUser() user: CurrentUser,
    @Args('createContactsInput', { type: () => [CreateContactsInput] })
    createContactsInput: [CreateContactsInput],
  ) {
    const emailDomain = user.email.split('@')[1];

    if (emailDomain.includes('macapa')) {
      return await this.clientsService.createMacapaContacts(
        createContactsInput,
        user.sub,
      );
    }

    if (emailDomain.includes('varejao')) {
      return await this.clientsService.createVarejaoContacts(
        createContactsInput,
        user.sub,
      );
    }

    throw new BadRequestException('User not allowed to create contacts');
  }

  @Query(() => String)
  hello() {
    return 'Hello Mercafacil!';
  }
}
