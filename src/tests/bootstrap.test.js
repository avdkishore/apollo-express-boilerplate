import app, { sequelize, models } from '../../src';
import seedData from './seeds';

const port = process.env.PORT;

let server;

before(async () => {
  return sequelize.sync({ force: true }).then(async () => {
    await seedData(new Date(), models);
    
    server = app.listen({ port }, () => {
      console.log(`Apollo Server is on http://localhost:${port}/graphql`);
    });
  });
});

after(async () => {
  // const tableNames = Object.keys(sequelize.models).map(model => `${model}s`);
  // await sequelize.query(`TRUNCATE TABLE ${tableNames.join(', ')} restart identity;`);
  server.close();
});