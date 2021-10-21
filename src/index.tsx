import { Auth0Provider } from '@auth0/auth0-react';
import React              from 'react';
import ReactDOM           from 'react-dom';
import App                from './App';
// TODO import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN || 'zametica.eu.auth0.com'}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || 'ajsnWvyqTxByw5o1NSJlIgsEyfbZTR5Z'}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE || 'https://zametica.eu.auth0.com/api/v2/'}
    redirectUri={`${window.location.origin}/auth`}
    useRefreshTokens
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

//TODO serviceWorker.register();
