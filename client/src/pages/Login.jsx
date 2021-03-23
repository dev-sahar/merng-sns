import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import useForm from '../utils/hooks';
import useStateValue from '../context/AuthConsumer';

const Login = () => {
  const history = useHistory();
  const context = useStateValue();

  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    password: '',
  };

  const { handleChange, handleSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );

  const { username, password } = values;

  // the (addUser) function will be triggered when the form is submitted
  // for the options, the (update) function will be triggered if the mutation is successfully executed
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update: (proxy, result) => {
      const {
        data: { login: userData },
      } = result;
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
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className='form-container'>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Login</h1>
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

        {/* Submit Button */}
        <Button type='submit' primary>
          Login
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      createdAt
      token
    }
  }
`;

export default Login;
