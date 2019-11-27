import 'dotenv/config';

import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Signin again.');
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important valiadtion error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation Error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me, 
      secret: process.env.JWT_SECRET,
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;
const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  
  app.listen({ port }, () => {
    console.log(`Apollo Server is on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  await models.User.create({
    username: 'kishore',
    email: 'kishore@example.com',
    password: 'somepassword',
    role: 'ADMIN',
    messages: [{
      text: 'Published the boiler plate',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }],
  }, {
    include: [models.Message]
  });

  await models.User.create({
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'somerandompassword',
    messages: [{
      text: 'Happy to release...',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }, {
      text: 'Published a complete ...',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }]
  }, {
    include: [models.Message]
  });
}