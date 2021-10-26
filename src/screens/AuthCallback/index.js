import Routes from 'constants/Routes';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { webAuth } from '../../config/auth0';
import qs from 'query-string';

const AuthCallback = () => {
  const history = useHistory();

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

  return <></>;
};

export default AuthCallback;
