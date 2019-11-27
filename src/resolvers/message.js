import uuidv4 from 'uuid/v4';

export default {
  Query: {
    message: (parent, { id }, { models}) => {
      return models.Message.findByPk(id); 
    },

    messages: (parent, args, { models }) => {
      return models.Message.findAll(); 
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      return models.Message.create({
        text,
        userId: me.id
      });
    },

    deleteMessage: (parent, { id }, { models }) => {
      return models.Message.destroy({ where: { id }});
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.User.findByPk(message.userId); 
    },
  },
};