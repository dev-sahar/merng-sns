import { Route, Redirect } from 'react-router-dom';

import useStateValue from '../context/AuthConsumer';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useStateValue();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
};

export default AuthRoute;
