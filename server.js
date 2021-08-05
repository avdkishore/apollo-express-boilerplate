if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

import app, { sequelize } from './src';

const port = process.env.PORT || 8000;


sequelize.sync({ force: false }).then(async () => {
  app.listen({ port }, () => {
    console.log(`Apollo Server is on http://localhost:${port}/graphql`);
  });
});
