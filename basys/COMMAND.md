```bash
npx prisma migrate reset
npx prisma migrate dev --name init_admin
npx prisma generate
npm run seed
# 查看数据库
npx prisma studio
# docker
docker-compose down && docker-compose build --no-cache && docker-compose up -d
docker-compose up -d --build
```