const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async username => {
    let user = await User.findOne({
      where: { username }
    });

    if (!user) {
      user = await User.findOne({
        where: { email: username }
      });
    }

    return user;
  };

  return User;
}

export default user;