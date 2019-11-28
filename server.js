import app from './src';

const port = process.env.PORT || 8000;

app.listen({ port }, () => {
  console.log(`Apollo Server is on http://localhost:${port}/graphql`);
});