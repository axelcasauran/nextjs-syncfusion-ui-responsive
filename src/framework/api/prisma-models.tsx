/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@lib/prisma';

type Models = {
  [key: string]: any;
};

export const PrismaModels: Models = {
  service: prisma.service,
  serviceDetail: prisma.serviceDetail,
  department: prisma.department,
  volunteer: prisma.user,
  user: prisma.user,
  // Add more models as needed
};