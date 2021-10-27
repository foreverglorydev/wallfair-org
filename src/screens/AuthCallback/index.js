import Routes from 'constants/Routes';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { webAuth } from '../../config/auth0';
import qs from 'query-string';
import { useDispatch } from 'react-redux';
import * as Api from '../../api';

const AuthCallback = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const hashFromLocation = qs.parse(history.location.hash);

    if (hashFromLocation.id_token) {
      webAuth.parseHash({ hash: history.location.hash }, (err, authResult) => {
        if (err || !authResult) {
          history.push(Routes.home);
        }

        const user = authResult.idTokenPayload;

        debugger;

        Api.verify({
          userIdentifier: user.sub,
          email: user.email,
        })
          .then(result => {
            const data = result.response.data;

            history.push({
              pathname: Routes.home,
              state: {
                auth: {
                  userId: data.userId,
                  newUser: authResult.appState?.newUser || data.newUser,
                  session: authResult.accessToken,
                  username: user.nickname,
                  initialReward: authResult.appState?.initialReward || 5000,
                },
              },
            });
          })
          .catch(error => {
            console.error('Authentication error', error.message);
            history.push(Routes.home);
          });
      });
    } else {
      history.push(Routes.home);
    }
  }, []);

  return <></>;
};

export default AuthCallback;
