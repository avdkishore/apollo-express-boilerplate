# apollo-express-boilerplate

An Apollo GraphQL Server with Express and PostgreSQL.

## Features

* Node.js with Express and Apollo Server
* PostgreSQL Database with Sequelize ORM
* JWT Authentication
* Role based and Token based Authorization
* performance optimizations using Facebook's dataloader
* Test framework with Mocha and Chai

## Installation

* `git clone git@github.com:avdkishore/apollo-express-boilerplate.git`
* `cd apollo-express-graphql`
* `yarn`
* start PostgreSQL database
* `yarn start`
* visit `http://localhost:8000` for GraphQL playground

### .env file

This boilerplate makes use of `.env` file where all the project envs are provided. Create a local .env file and start the server to accept the values. For tests, `.env.test` is loaded and corresponding envs for the test environment are provided.

```env
PORT=8000
DATABASE=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
SECRET=iwufh89whrb32hjbr.023fsadlkfj4.3wepo
```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the *.env* file to your *.gitignore* file. No third-party should have access to this information.

## Testing

* Add `.env.test` file to the root of the project. If it is not provided, then the default envs from `config/env/test` are considered.
* To run the tests, run `yarn test`

## Deployment

* Since we are using all the latest JS features, babel is setup to transpile this. Run `yarn build` which generates `dist/` with all the transpiled source code.

* `yarn serve` to run the server.

* Docker file is also provided incase it is needed.
