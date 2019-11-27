import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'Kishore',
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'John Doe',
    messageIds: [2]
  }
};

let messages = {
  1: {
    id: '1',
    text: 'Hello world',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'This is awesome',
    userId: '2'
  }
};

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => { 
      return me 
    },

    user: (parent, { id }) => {
      return users[id]
    },

    users: () => { 
      return Object.values(users)
    },

    message: (parent, { id }) => {
      return messages[id];
    },

    messages: () => {
      return Object.values(messages);
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) return false;

      messages = otherMessages;
      return true;
    }
  },

  User: {
    username: user => { 
      return user.username.toUpperCase();
    },
    
    messages: user => {
      return Object.values(messages).filter(message => message.userId === user.id)
    }
  },

  Message: {
    user: message => {
      return users[message.userId]
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;

app.listen({ port }, () => {
  console.log(`Apollo Server is on http://localhost:${port}/graphql`)
});