/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaModels } from './prisma-models';

const prismaModels = PrismaModels;

export async function createRecord(model: string, data: any) {
  if (!prismaModels[model]) {
    throw new Error(`Model ${model} not found`);
  }

  return await prismaModels[model].create({
    data
  });
}

export async function findRecord(
  model: string, 
  options: { 
    where?: any; 
    include?: any;
  }
) {
  if (!prismaModels[model]) {
    throw new Error(`Model ${model} not found`);
  }

  return await prismaModels[model].findUnique(options);
}

export async function findManyRecords(
  model: string, 
  options: { 
    skip?: number; 
    take?: number; 
    where?: any; 
    orderBy?: any;
  }
) {
  if (!prismaModels[model]) {
    throw new Error(`Model ${model} not found`);
  }

  return await prismaModels[model].findMany(options);
}

export async function countRecords(model: string, where: any) {
  if (!prismaModels[model]) {
    throw new Error(`Model ${model} not found`);
  }

  return await prismaModels[model].count({ where });
}