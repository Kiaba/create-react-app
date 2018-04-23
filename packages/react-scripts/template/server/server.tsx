import express from 'express';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';

import matchPath from 'server/match-path';

import { getBundles } from 'react-loadable/webpack'
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createHistory from 'history/createMemoryHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';

import { reducer as reduxFormReducer } from 'redux-form';

import { routes } from 'src/routes';

const assetManifest = require('build/asset-manifest.json');
const reactLoadable = require('build/react-loadable.json');

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

const app: express.Application = express();

app.use('/', express.static(path.join(__dirname, '..', 'build'), {
  index: false
}));

app.get('/*', (req, res, next) => {
  if(matchPath(routes, req.url)) {
    return next();
  }
  res.writeHead(302, {
    'Location': '/404'
  });
  res.end();
});

app.get('/*', (req, res) => {
  const modules: string[] = [];
  const context = {};
  const sheet = new ServerStyleSheet();
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <Loadable.Capture report={(moduleName: string) => modules.push(moduleName)}>
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </StyleSheetManager>
      </Loadable.Capture>
    </Provider>
  );

  const styleTags = sheet.getStyleTags();

  const bundles = getBundles(reactLoadable, modules);
  let styles: any[] = [];
  let scripts: any[] = [];

  if(assetManifest.hasOwnProperty('main.css')) {
      styles.push({
          file: assetManifest['main.css'],
          id: null,
          name: 'main.css',
      });
  }
  if(assetManifest.hasOwnProperty('main.js')) {
      scripts.push({
          file: assetManifest['main.js'],
          id: null,
          name: 'main.js',
      });
  }

  const filteredStyles = bundles.filter(bundle => bundle.file.endsWith('.css'));
  const filteredScripts = bundles.filter(bundle => bundle.file.endsWith('.js'));

  styles = styles.concat(filteredStyles);
  scripts = scripts.concat(filteredScripts);

  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>My App</title>
        ${styleTags}
        ${styles.map(style => {
          return `<link href="/${style.file}" rel="stylesheet"/>`;
        }).join('\n')}
      </head>
      <body>
        <div id="root">${html}</div>
        ${scripts.map(script => {
          return `<script src="/${script.file}"></script>`
        }).join('\n')}
      </body>
    </html>
  `);
});

Loadable.preloadAll().then(() => {
  app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
  });
}).catch((err: any) => {
  console.log(err);
});