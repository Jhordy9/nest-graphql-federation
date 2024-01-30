import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { Request } from 'express';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req }: { req: Request }) => ({
          authorization: req.headers.authorization,
        }),
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'Auth',
              url: 'http://localhost:3000/graphql',
            },
            {
              name: 'clients',
              url: 'http://localhost:3001/graphql',
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ context, request }) {
              request.http?.headers.set(
                'authorization',
                context.authorization
                  ? JSON.stringify(context.authorization)
                  : '',
              );
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
