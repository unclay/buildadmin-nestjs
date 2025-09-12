import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const modelNames = Object.getOwnPropertyNames(prisma).filter(
  (item) => !item.match(/^_|^\$|constructor|^[A-Z]/),
);
export const tableNames = modelNames.map((item) =>
  item.replace(/([A-Z])/g, '_$1').toLowerCase(),
);

// 运行时获取所有可能的模型名称
function getPrismaModelNames(): string[] {
  const prisma = new PrismaClient();
  const allKeys = Object.keys(prisma) as (keyof PrismaClient)[];

  return allKeys.filter((key) => {
    const value = prisma[key];
    return typeof value === 'object' && value !== null && 'findMany' in value;
  }) as string[];
}

// 使用
const modelNames2 = getPrismaModelNames();
console.log('PrismaModel 包含的模型:');
console.log(modelNames2);
console.log('总数:', modelNames2.length);
