export default {
  Query: {
    me: (parent, args, { me, models }) => { 
      // return models.User.findByPk(me.id); 
      return me;
    },

    user: (parent, { id }, { models }) => {
      return models.User.findByPk(id); 
    },

    users: (parent, args, { models }) => { 
      return models.User.findAll(); 
    },
  },

  User: {
    username: user => { 
      return user.username.toUpperCase();
    },
    
    messages: (user, args, { models }) => {
      return models.Message.findAll({
        where: {
          userId: user.id
        },
      });
    },
  },
}