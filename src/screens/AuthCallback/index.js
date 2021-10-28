import Routes from 'constants/Routes';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { webAuth, checkSession } from '../../config/auth0';
import qs from 'query-string';
import * as Api from '../../api';

const AuthCallback = () => {
  const history = useHistory();

  useEffect(() => {
    const hashFromLocation = qs.parse(history.location.hash);

    if (hashFromLocation.id_token) {
      webAuth.parseHash({ hash: history.location.hash }, (err, authResult) => {
        if (err || !authResult) {
          console.error('Authentication error', err);
          history.push(Routes.home);
        }

        const user = authResult.idTokenPayload;

        Api.verify({
          userIdentifier: user.sub,
          email: user.email,
        })
          .then(result => {
            const data = result.response.data;
            const state = {
              auth: {
                userId: data.userId,
                newUser: authResult.appState?.newUser || data.newUser,
                session: authResult.accessToken,
                username: user.nickname,
                initialReward: authResult.appState?.initialReward || 5000,
              },
            };

            if (data.userLinked) {
              checkSession()
                .then(result => {
                  history.push({
                    pathname: Routes.home,
                    state: {
                      ...state,
                      auth: {
                        ...state.auth,
                        session: result.accessToken,
                      },
                    },
                  });
                })
                .catch(e => {
                  console.error('User link error', e.description);
                  history.push(Routes.home);
                });
            } else {
              history.push({
                pathname: Routes.home,
                state,
              });
            }
          })
          .catch(error => {
            console.error('Verification error', error.message);
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
