import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import useForm from '../utils/hooks';
import useStateValue from '../context/AuthConsumer';

const Register = () => {
  const history = useHistory();
  const context = useStateValue();

  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { handleChange, handleSubmit, values } = useForm(
    registerUser,
    initialState
  );

  const { username, email, password, confirmPassword } = values;

  // the (addUser) function will be triggered when the form is submitted
  // for the options, the (update) function will be triggered if the mutation is successfully executed
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update: (proxy, result) => {
      const {
        data: { login: userData },
      } = result;
      // when we register we also login a new user
      context.login(userData);
      history.push('/');
    },
    onError: (error) => {
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  // all functions with the keyword (function) infront of them are hoisted
  // meaning they get moved to the top of their scope before code execution
  function registerUser() {
    addUser();
  }

  return (
    <div className='form-container'>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Register</h1>
        {/* Username */}
        <Form.Input
          label='Username'
          placeholder='Username'
          type='text'
          name='username'
          value={username}
          error={errors.username ? true : false}
          onChange={handleChange}
        />

        {/* Email */}
        <Form.Input
          label='Email'
          placeholder='Email'
          type='email'
          name='email'
          value={email}
          error={errors.email ? true : false}
          onChange={handleChange}
        />

        {/* Password */}
        <Form.Input
          label='Password'
          placeholder='Password'
          type='password'
          name='password'
          value={password}
          error={errors.password ? true : false}
          onChange={handleChange}
        />

        {/* Confirm Password */}
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password'
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <Button type='submit' primary>
          Register
        </Button>
      </Form>

      {/* Error Message */}
      {Object.keys(errors).length > 0 && (
        <Message negative>
          <Message.Header>
            There were some errors with your submission
          </Message.Header>
          <Message.List>
            {Object.values(errors).map((error) => (
              <Message.Item key={error}>{error}</Message.Item>
            ))}
          </Message.List>
        </Message>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      createdAt
      token
    }
  }
`;

export default Register;
