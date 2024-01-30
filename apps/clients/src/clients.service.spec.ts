import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ClientsService } from './clients.service';
import { PrismaService } from './providers/prisma.service';
import { CreateContactsInput } from './dto/create-contacts.input';
import { Contact } from './schemas/contacts';

describe('ClientsService', () => {
  let service: ClientsService;
  let prismaService: PrismaService;
  let catModel: Model<Contact>;

  const mockContactData: CreateContactsInput[] = [
    { name: 'Marina Rodrigues', cellphone: '5541996941919' },
    { name: 'Nicolas Rodrigues', cellphone: '5541979210400' },
  ];

  const mockUserId = 'user123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            contact: {
              create: jest.fn().mockResolvedValueOnce(mockContactData),
            },
          },
        },
        {
          provide: 'CONTACTS_MODEL',
          useValue: {
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prismaService = module.get<PrismaService>(PrismaService);
    catModel = module.get<Model<Contact>>('CONTACTS_MODEL');
  });

  describe('createMacapaContacts', () => {
    it('should create Macapa contacts using Prisma', async () => {
      await service.createMacapaContacts(
        mockContactData as [CreateContactsInput],
        mockUserId,
      );

      expect(prismaService.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          createdBy: mockUserId,
        }),
        select: expect.objectContaining({
          id: true,
          name: true,
          cellphone: true,
          client: true,
        }),
      });
    });
  });

  describe('createVarejaoContacts', () => {
    it('should create Varejao contacts using Mongoose model', async () => {
      const mockInsertManyResult = [
        {
          _id: 'contactId1',
          name: 'John Doe',
          cellphone: '1234567890',
          client: 'Varejao',
        },
        {
          _id: 'contactId2',
          name: 'Jane Doe',
          cellphone: '9876543210',
          client: 'Varejao',
        },
      ];

      (catModel.insertMany as jest.Mock).mockResolvedValueOnce(
        mockInsertManyResult,
      );

      await service.createVarejaoContacts(
        mockContactData as [CreateContactsInput],
        mockUserId,
      );

      expect(catModel.insertMany).toHaveBeenCalledWith([
        {
          cellphone: '+55 (41) 99694-1919',
          name: 'Marina Rodrigues',
          createdBy: mockUserId,
        },
        {
          cellphone: '+55 (41) 97921-0400',
          name: 'Nicolas Rodrigues',
          createdBy: mockUserId,
        },
      ]);
    });
  });
});
