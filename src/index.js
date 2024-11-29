import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Auth0Provider } from './authServices/auth0/auth0Service';
import config from './authServices/auth0/auth0Config.json';
import { IntlProviderWrapper } from './utility/context/Internationalization';
import { Layout } from './utility/context/Layout';
import * as serviceWorker from './serviceWorker';
// Default theme Redux
import { store } from './redux/storeConfig/store';
// New Redux
// import store from "./new.redux/store"
import Spinner from './components/@vuexy/spinner/Fallback-spinner';
import './index.scss';
import './@fake-db';

const LazyApp = lazy(() => import('./App'));

ReactDOM.render(
  <HelmetProvider>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin + process.env.REACT_APP_PUBLIC_PATH}
    >
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <Layout>
            <IntlProviderWrapper>
              <LazyApp />
              <Helmet>
                <title>Iuli</title>
              </Helmet>
            </IntlProviderWrapper>
          </Layout>
        </Suspense>
      </Provider>
    </Auth0Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
