export default async function seedData(date, models) {
  await models.User.create({
    username: 'kishore',
    email: 'kishore@example.com',
    password: 'somepassword',
    role: 'ADMIN',
    messages: [{
      text: 'Published the boiler plate',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }],
  }, {
    include: [models.Message]
  });

  await models.User.create({
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'somerandompassword',
    messages: [{
      text: 'Happy to release...',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }, {
      text: 'Published a complete ...',
      createdAt: date.setSeconds(date.getSeconds() + 1),
    }]
  }, {
    include: [models.Message]
  });
}