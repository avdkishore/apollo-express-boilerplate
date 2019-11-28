import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    message: (parent, { id }, { models}) => {
      return models.Message.findByPk(id); 
    },

    messages: async (parent, { limit = 10, cursor }, { models }) => {
      const cursorOptions =  cursor
        ? {
          where: { 
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : null;

      const messages = await models.Message.findAll({ 
        order: [[ 'createdAt', 'DESC' ]],
        limit: limit + 1,
        ...cursorOptions,
      });

      // has more data than the requested limit
      const hasNextPage = messages.length > limit;
      // if there is more data than what is requested for, remove the last item from the list
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      }
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      (parent, { text }, { me, models }) => {
        return models.Message.create({
          text,
          userId: me.id
        });
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner, 
      (parent, { id }, { models }) => {
          return models.Message.destroy({ where: { id }
        });
      }
    ),
  },

  Message: {
    user: async (message, args, { loaders }) => {
      return await loaders.user.load(message.userId);
    },
  },
};