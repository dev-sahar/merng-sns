import { useContext } from 'react';

import AuthContext from './AuthContext';

const useStateValue = () => useContext(AuthContext);

export default useStateValue;
