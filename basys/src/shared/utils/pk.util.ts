import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const modelNames = Object.getOwnPropertyNames(prisma).filter(item => !item.match(/^_|^\$|constructor|^[A-Z]/));

// console.log('Getter 名称:', modelNames);
// console.log(PrismaClient.prototype, Object.getOwnPropertyNames(PrismaClient.prototype));
// delete prisma.baAdminGroupAccess['$parent'];
// console.log(prisma.baAdminGroupAccess['name']);
// console.log(prisma.baAdminGroupAccess);

export async function getPrimaryKey(tableName: string) {
  const result = await prisma.$queryRaw`
    SELECT a.attname AS column_name
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = ${tableName}::regclass
    AND i.indisprimary;
  `;
  return result as { column_name: string }[];
}

// 使用示例
const tableName = prisma.baAdminGroupAccess['name'].replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
getPrimaryKey('ba_admin').then(keys => {
  console.log('Primary keys:', keys);
});

async function find() {
  const pks = await getPrimaryKey(tableName);
  console.log(pks);
  const uniqueKey = pks.map(v => v.column_name).join('_');
  console.log(uniqueKey);
  const row = await prisma.baAdminGroupAccess.findUnique({
    where: {
      [uniqueKey]: {
        uid: 13,
        group_id: 3,
      },
    }
  } as any);
  console.log(row);
}
find();