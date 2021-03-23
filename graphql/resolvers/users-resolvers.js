import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import User from '../../models/user-model.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../../utils/validators.js';

// function to generate tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
};

// each query, mutation, or subscription has its corresponding resolver
// which process some sort of logic and return what the query returns
const usersResolvers = {
  Mutation: {
    // 1st argument (parent) gives the result of what was the input from the last step
    // 2nd argument (args) are the arguments passed to mutations ex: registerInput
    // 3rd argument (context)
    // 4th argument (info) has some general info about some meta data
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) => {
      // validate user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // make sure user doesn't already exist
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username already exists!', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      // hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const matchPassword = await bcrypt.compare(password, user.password);

      if (!matchPassword) {
        errors.general = 'Wrong Credentials';
        throw new UserInputError('Wrong Credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};

export default usersResolvers;
