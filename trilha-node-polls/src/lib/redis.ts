import { Redis } from 'ioredis'

// Como ja especificamos no docker compose no redis a porta 6379 e nao precisa passar senha, entao nao precisamos passar nada como parametro para conectar ao redis
export const redis = new Redis({
  // host: 'redis'
  // password: '123456'
  // port: 6379
})
