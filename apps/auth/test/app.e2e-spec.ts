import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './../src/auth.module';
import { PrismaService } from '../src/providers/prisma.service';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should sign up a user successfully', async () => {
    const signUpMutation = `
      mutation {
        signUp(
          signUpInput: {
            name: "Test User Macapa"
            email: "test_user@macapa.com"
            password: "123456"
          }
        ) {
          id
          name
          email
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signUpMutation })
      .expect(200);

    const { data } = response.body;
    expect(data).toBeDefined();
    expect(data.signUp).toBeDefined();
    expect(data.signUp.id).toBeDefined();
    expect(data.signUp.name).toBe('Test User Macapa');
    expect(data.signUp.email).toBe('test_user@macapa.com');
  });

  it('should sign in a user successfully and return an access token', async () => {
    const signInMutation = `
      mutation {
        signIn(signInInput: { email: "test_user@macapa.com", password: "123456" }) {
          accessToken
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signInMutation })
      .expect(200);

    const { data } = response.body;
    expect(data).toBeDefined();
    expect(data.signIn).toBeDefined();
    expect(data.signIn.accessToken).toBeDefined();
  });
});
