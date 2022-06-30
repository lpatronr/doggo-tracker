import { Prisma, User } from '@prisma/client';
import prisma from './prisma';

export function createUser(cc: string, dogs: string[]): Prisma.Prisma__UserClient<User> {
  return prisma.user.create({
    data: {
      cc,
      startDate: new Date(),
      dogs,
    },
  });
}

export function updateUser(cc: string, dogs: string[]): Prisma.Prisma__UserClient<User> {
  return prisma.user.update({
    where: {
      cc,
    },
    data: {
      startDate: new Date(),
      dogs,
    },
  });
}

export function getUser(cc: string): Prisma.Prisma__UserClient<User | null> {
  return prisma.user.findUnique({
    where: {
      cc,
    },
  });
}
