import { Auth0Client } from '@auth0/auth0-spa-js';
import { WebAuth } from 'auth0-js';

export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirect_uri: `${window.location.origin}/auth`,
  scope: 'openid email profile offline_access',
};

export const auth0 = new Auth0Client({
  ...auth0Config,
});

export const webAuth = new WebAuth({
  domain: auth0Config.domain,
  clientID: auth0Config.client_id,
  audience: auth0Config.audience,
  scope: auth0Config.scope,
  redirectUri: auth0Config.redirect_uri,
});

export const loginWithPassword = (email, password) => {
  webAuth.login(
    {
      realm: 'Username-Password-Authentication',
      username: email,
      password: password,
      responseType: 'id_token token',
    },
    err => {
      console.error('Authentication failed', err);
    }
  );
};

export const loginWithProvider = provider => {
  webAuth.authorize({
    connection: provider,
    responseType: 'id_token token',
  });
};

export const authorizeApp = () => {
  webAuth.authorize({
    prompt: 'consent',
    responseType: 'id_token token',
  });
};

export const checkSession = () => {
  webAuth.checkSession(
    {
      audience: auth0Config.audience,
      scope: auth0Config.scope,
      responseType: 'id_token',
    },
    (err, authResult) => {
      if (err?.code === 'consent_required') {
        authorizeApp();
      }
      console.log(authResult, err);
    }
  );
};

export const logout = () => {
  webAuth.logout({
    clientID: auth0Config.client_id,
  });
};
