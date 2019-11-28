import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from './authorization';

const createToken = async ({ user, secret, expiresIn }) => {
  const { id, email, username, role } = user;

  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
}

export default {
  Query: {
    me: (parent, args, { me, models }) => { 
      if (!me) return null;
      
      return models.User.findByPk(me.id); 
    },

    user: (parent, { id }, { models }) => {
      return models.User.findByPk(id); 
    },

    users: (parent, args, { models }) => { 
      return models.User.findAll(); 
    },
  },

  Mutation: {
    signup: async (
      parent,
      { username, email, password },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password
      });

      return { token: createToken({ user, secret, expiresIn: '30m' }) };
    },

    signin: async (
      parent,
      { login, password },
      { models, secret }
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('No user is found with these login credentials');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password');
      }

      return { token: createToken({ user, secret, expiresIn: '30m' })};
    },

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id }
        });
      }
    ),
  },

  User: {
    messages: (user, args, { models }) => {
      return models.Message.findAll({
        where: {
          userId: user.id
        },
      });
    },
  },
}