import { MockMethod } from 'vite-plugin-mock';
import { generateResponse, generateToken } from './mock.util';

const mock: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: 0,
    response: ({ body }: { body: { email: string; password: string } }) => {
      const { email, password } = body;
      if (email === 'academy@gmail.com' && password === 'academy123') {
        const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
        const accessToken = generateToken({ email, password, expiresIn });
        return generateResponse({ expiresIn, accessToken });
      }
      return generateResponse({}, 401, 'Invalid Credentials!');
    },
  },
];
export default mock;