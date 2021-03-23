import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

const checkAuth = (context) => {
  // context has the headers inside it
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        return user;
      } catch (error) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }

    throw new Error("Authentication token must be in 'Bearer [token]' format");
  }
  throw new Error('Authorization header must be provided');
};

export default checkAuth;
