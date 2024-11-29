import axios from 'axios';
import { history } from '../../../history';

export const signup = (email, password, name) => (dispatch) => {
  axios
    .post('/api/authenticate/register/user', {
      email,
      password,
      name,
    })
    .then((response) => {
      let loggedInUser;

      if (response.data) {
        loggedInUser = response.data.user;

        localStorage.setItem('token', response.data.token);

        dispatch({
          type: 'LOGIN',
          payload: { loggedInUser },
        });

        history.push('/');
      }
    })
    .catch((err) => console.log(err));
};
