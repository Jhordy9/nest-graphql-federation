import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { constants } from './constants';
import { ConfigModule } from '@nestjs/config';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  providers: [AuthResolver, AuthService, PrismaService],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: constants.jwtSecret,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
})
export class AuthModule {}
