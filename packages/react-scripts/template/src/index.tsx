import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createHistory from 'history/createBrowserHistory';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';

import { reducer as reduxFormReducer } from 'redux-form';

import { routes } from './routes';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';

const history = createHistory();
const composeEnhancers = composeWithDevTools({});
const reducers = combineReducers({
  form: reduxFormReducer,
  router: routerReducer
});
const enchancers = composeEnhancers(
  applyMiddleware(routerMiddleware(history))
);
const store = createStore(reducers, enchancers);

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
