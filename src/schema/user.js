import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
    ): Token!

    signin(login: String!, password: String! ): Token!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    messages: [Message!]
  }

  type Token {
    token: String!
  }
`;