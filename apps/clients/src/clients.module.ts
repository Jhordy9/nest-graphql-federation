import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsResolver } from './clients.resolver';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { constants } from './constants';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './providers/database.module';
import { contactsProvider } from './providers/mongodb.provider';
import { PrismaService } from './providers/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: constants.jwtSecret,
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      context: ({ req }: any) => req,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  providers: [
    ClientsResolver,
    ClientsService,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    contactsProvider,
    PrismaService,
  ],
})
export class ClientsModule {}
