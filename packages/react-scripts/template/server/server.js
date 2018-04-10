import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'
import { renderRoutes } from 'react-router-config';
import StaticRouter from 'react-router-dom/StaticRouter';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import { routes } from 'src/routes';

const assetManifest = require('build/asset-manifest.json');
const reactLoadable = require('server/react-loadable.json');

const app = express();

export function universal(req, res) {
    const modules = [];
    const context = {};
    const sheet = new ServerStyleSheet();
    const html = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </StyleSheetManager>
      </Loadable.Capture>
    );

    const styleTags = sheet.getStyleTags();

    const bundles = getBundles(reactLoadable, modules);
    let styles = [];
    let scripts = [];

    if(assetManifest.hasOwnProperty('main.css')) {
        styles.push({
            id: null,
            name: 'main.css',
            file: assetManifest['main.css']
        });
    }
    if(assetManifest.hasOwnProperty('main.js')) {
        scripts.push({
            id: null,
            name: 'main.js',
            file: assetManifest['main.js']
        });
    }

    styles = styles.concat(bundles.filter(bundle => bundle.file.endsWith('.css')));
    scripts = scripts.concat(bundles.filter(bundle => bundle.file.endsWith('.js')));
  
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
          <script>window.main();</script>
        </body>
      </html>
    `);
}

app.get('/', universal);

app.use('/static', express.static(path.join(__dirname, '..', 'build', 'static')));

Loadable.preloadAll().then(() => {
  app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
  });
}).catch(err => {
  console.log(err);
});