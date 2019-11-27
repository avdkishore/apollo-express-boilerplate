import uuidv4 from 'uuid/v4';

export default {
  Query: {
    me: (parent, args, { me }) => { 
      return me 
    },

    user: (parent, { id }, { models }) => {
      return models.users[id]
    },

    users: (parent, args, { models }) => { 
      return Object.values(models.users)
    },

    message: (parent, { id }, { models}) => {
      return models.messages[id];
    },

    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) return false;

      models.messages = otherMessages;
      return true;
    }
  },

  User: {
    username: user => { 
      return user.username.toUpperCase();
    },
    
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(message => message.userId === user.id)
    }
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId]
    }
  }
};

