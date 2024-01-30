import { Resolver, Query } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CurrentUser } from './decorators/current-user.decorator';

type CurrentUser = {
  sub: string;
  email: string;
  iat: number;
};

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => String)
  hello(@CurrentUser() user: CurrentUser) {
    return user.email;
  }
}
