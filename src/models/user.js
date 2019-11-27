import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42]
      }
    },
    role: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.beforeCreate(async user => {
    user.password = await user.genereatePasswordHash();
  });

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

  // User instance method
  User.prototype.genereatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  return User;
}

export default user;