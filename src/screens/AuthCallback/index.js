import { useAuth0 } from '@auth0/auth0-react';
import Routes from 'constants/Routes';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { auth0, webAuth, auth0Config } from '../../config/auth0';
import qs from 'query-string';

const AuthCallback = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  const authenticate = () => {
    getAccessTokenSilently().then(val => {
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
    const hashFromLocation = qs.parse(history.location.hash);

    if (hashFromLocation.id_token) {
      webAuth.parseHash({ hash: history.location.hash }, (err, authResult) => {
        if (err) {
          history.push(Routes.home);
        }

        const user = authResult.idTokenPayload;

        history.push({
          pathname: Routes.home,
          state: {
            auth: {
              token: authResult.accessToken,
              auth0Id: user.sub,
              email: user.email,
              username: user.nickname,
            },
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      authenticate();
    }
  }, [isAuthenticated]);

  return <></>;
};

export default AuthCallback;
