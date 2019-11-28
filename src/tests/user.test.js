import { expect } from 'chai';

import * as api from './api';

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('should return a user when user is found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'kishore',
            email: 'kishore@example.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await api.user({ id: '1' });

      expect(result.data).to.eql(expectedResult);
    });

    it('should return null if user is not found', async () => {
      const expectedResult = {
        data: {
          user: null
        }
      };

      const result = await api.user({ id: '42' });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('should return error for non admins', async () => {
      const {
        data: {
          data: {
            signin: { token },
          },
        },
      } = await api.signin({
        login: 'johndoe',
        password: 'somerandompassword'
      });

      const {
        data: { errors }
      } = await api.deleteUser({ id: '1' }, token);

      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });
});