import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'Kishore'
  },
  2: {
    id: '2',
    username: 'John Doe'
  }
};

const me = users[1];

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: () => me,

    user: (parent, { id }) => {
      return users[id]
    },

    users: () => Object.values(users)
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;

app.listen({ port }, () => {
  console.log(`Apollo Server is on http://localhost:${port}/graphql`)
});