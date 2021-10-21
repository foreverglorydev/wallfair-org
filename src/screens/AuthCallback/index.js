import { useAuth0 } from '@auth0/auth0-react';
import Routes from 'constants/Routes';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

const AuthCallback = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  const authenticate = async () => {
    await getAccessTokenSilently().then(val => {
      history.push({
        pathname: Routes.home,
        state: {
          auth: {
            token: val,
            auth0Id: user.sub,
            email: user.email,
            username: user.nickname,
          },
        },
      });
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      authenticate();
    }
  }, [isAuthenticated]);

  return <></>;
};

export default AuthCallback;
