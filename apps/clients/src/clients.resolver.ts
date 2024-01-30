import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Contacts } from './entities/contacts.entity';
import { CreateContactsInput } from './dto/create-contacts.input';
import { BadRequestException } from '@nestjs/common';

type CurrentUser = {
  sub: string;
  email: string;
  iat: number;
};

@Resolver(() => [Contacts])
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Mutation(() => [Contacts])
  createContacts(
    @CurrentUser() user: CurrentUser,
    @Args('createContactsInput') createContactsInput: [CreateContactsInput],
  ) {
    if (user.email.includes('macapa')) {
      return this.clientsService.createMacapaContacts(createContactsInput);
    }

    if (user.email.includes('varejao')) {
      return this.clientsService.createVarejaoContacts(createContactsInput);
    }

    throw new BadRequestException('User not allowed to create contacts');
  }
}
