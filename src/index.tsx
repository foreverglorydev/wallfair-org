import { Auth0Provider } from '@auth0/auth0-react';
import React              from 'react';
import ReactDOM           from 'react-dom';
import App                from './App';
import { auth0Config } from './config/auth0';
// TODO import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Auth0Provider
    domain={auth0Config.domain || ''}
    clientId={auth0Config.client_id || ''}
    audience={auth0Config.audience}
    redirectUri={auth0Config.redirect_uri}
    useRefreshTokens
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

//TODO serviceWorker.register();
