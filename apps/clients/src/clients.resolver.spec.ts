import { Test, TestingModule } from '@nestjs/testing';
import {
  ClientsResolver,
  CurrentUser as CurrentUserType,
} from './clients.resolver';
import { ClientsService } from './clients.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateContactsInput } from './dto/create-contacts.input';
import { createParamDecorator } from '@nestjs/common';

export const MockCurrentUser = (user: CurrentUserType) =>
  createParamDecorator(() => {
    return user;
  });

const createContactsInput = [
  { name: 'Marina Rodrigues', cellphone: '5541996941919' },
  { name: 'Nicolas Rodrigues', cellphone: '5541979210400' },
];

describe('ClientsResolver - Varejão Client', () => {
  let resolver: ClientsResolver;
  let service: ClientsService;
  const user: CurrentUserType = {
    sub: 'user123',
    email: 'user@varejao.com',
    iat: 123456,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsResolver,
        {
          provide: ClientsService,
          useValue: {
            createMacapaContacts: jest.fn(),
            createVarejaoContacts: jest.fn(),
          },
        },
        {
          provide: CurrentUser,
          useValue: MockCurrentUser(user),
        },
      ],
    }).compile();

    resolver = module.get<ClientsResolver>(ClientsResolver);
    service = module.get<ClientsService>(ClientsService);
  });

  describe('createContacts', () => {
    it('should create Macapa contacts when user email domain includes "varejao"', async () => {
      (service.createVarejaoContacts as jest.Mock).mockResolvedValueOnce(
        createContactsInput.map(({ cellphone, name }) => ({
          name,
          cellphone: `+55 (41) ${cellphone.substring(4)}`,
          userId: user.sub,
          client: 'Varejão',
        })),
      );

      const result = await resolver.createContacts(
        user,
        createContactsInput as [CreateContactsInput],
      );

      expect(result).toEqual([
        {
          cellphone: '+55 (41) 996941919',
          client: 'Varejão',
          name: 'Marina Rodrigues',
          userId: 'user123',
        },
        {
          cellphone: '+55 (41) 979210400',
          client: 'Varejão',
          name: 'Nicolas Rodrigues',
          userId: 'user123',
        },
      ]);
    });
  });
});

describe('ClientsResolver - Macapá Client', () => {
  let resolver: ClientsResolver;
  let service: ClientsService;

  const user: CurrentUserType = {
    sub: 'user123',
    email: 'user@macapa.com',
    iat: 123456,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsResolver,
        {
          provide: ClientsService,
          useValue: {
            createMacapaContacts: jest.fn(),
            createVarejaoContacts: jest.fn(),
          },
        },
        {
          provide: CurrentUser,
          useValue: MockCurrentUser(user),
        },
      ],
    }).compile();

    resolver = module.get<ClientsResolver>(ClientsResolver);
    service = module.get<ClientsService>(ClientsService);
  });

  describe('createContacts', () => {
    it('should create Macapa contacts when user email domain includes "macapa"', async () => {
      const user: CurrentUserType = {
        sub: 'user123',
        email: 'user@macapa.com',
        iat: 123456,
      };

      (service.createMacapaContacts as jest.Mock).mockResolvedValueOnce(
        createContactsInput.map((input) => ({
          ...input,
          userId: user.sub,
          client: 'Macapa',
        })),
      );

      const result = await resolver.createContacts(
        user,
        createContactsInput as [CreateContactsInput],
      );

      expect(result).toEqual([
        {
          cellphone: '5541996941919',
          client: 'Macapa',
          name: 'Marina Rodrigues',
          userId: 'user123',
        },
        {
          cellphone: '5541979210400',
          client: 'Macapa',
          name: 'Nicolas Rodrigues',
          userId: 'user123',
        },
      ]);
    });
  });
});
