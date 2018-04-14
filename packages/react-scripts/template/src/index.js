import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { routes } from './routes';

import Loadable from 'react-loadable';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';

const history = createHistory();

const store = createStore(
  routerReducer,
  applyMiddleware(routerMiddleware(history)),
);

const Router = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            {renderRoutes(routes)}
        </ConnectedRouter>
    </Provider>
);

Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(<Router/>, document.getElementById('root'));
});

// registerServiceWorker();
