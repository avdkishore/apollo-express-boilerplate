import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

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
  context: async () => ({
    models,
    me: await models.User.findByLogin('kishore'), 
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;
const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  
  app.listen({ port }, () => {
    console.log(`Apollo Server is on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async () => {
  await models.User.create({
    username: 'kishore',
    messages: [{
      text: 'Published the boiler plate'
    }],
  }, {
    include: [models.Message]
  });

  await models.User.create({
    username: 'johndoe',
    messages: [{
      text: 'Happy to release...'
    }, {
      text: 'Published a complete ...'
    }]
  }, {
    include: [models.Message]
  });
}