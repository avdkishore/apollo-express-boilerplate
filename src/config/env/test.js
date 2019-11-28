export default {
  APP_NAME: process.env.APP_NAME || 'apollo-express-graphql',
  PORT: process.env.PORT || 8001,
  DATABASE: process.env.DATABASE || 'postgres_test',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
  LOGGING: false,
  JWT_SECRET: process.env.JWT_SECRET || 'iwufh89whrb32hjbr.023fsadlkfj4.3wepo',
}