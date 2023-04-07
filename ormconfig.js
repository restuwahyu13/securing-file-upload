const path = require('path')

const pathEntitiesDir = ['development'].includes(process.env.NODE_ENV) ? 'src/entities/*.ts' : 'dist/entities/*.js'
const pathMigrationDir = ['development'].includes(process.env.NODE_ENV) ? 'src/database/migrations/*.ts' : 'dist/database/migrations/*.js'

const entitiesDir = path.join(__dirname, pathEntitiesDir)
const migrationsDir = path.join(__dirname, pathMigrationDir)

module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
  entities: [entitiesDir],
  migrations: [migrationsDir],
  synchronize: ['development'].includes(process.env.NODE_ENV) ? true : false,
  logger: ['development'].includes(process.env.NODE_ENV) ? 'advanced-console' : undefined,
  logging: ['development'].includes(process.env.NODE_ENV) ? true : false,
  trace: ['development'].includes(process.env.NODE_ENV) ? true : false,
  connectTimeout: 60000,
  cli: {
    entitiesDir: entitiesDir,
    migrationsDir: migrationsDir
  }
}
