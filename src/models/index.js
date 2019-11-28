import Sequelize from 'sequelize';
import config from '../config';

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    config.DATABASE,
    config.DATABASE_USER,
    config.DATABASE_PASSWORD,
    {
      host: config.DATABASE_HOST,
      dialect: 'postgres',
      logging: config.LOGGING
    },
  );
}

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;