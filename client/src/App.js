import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';

import AuthProvider from './context/AuthProvider';
import AuthRoute from './utils/AuthRoute';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <NavBar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path='/posts/:postId' component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
