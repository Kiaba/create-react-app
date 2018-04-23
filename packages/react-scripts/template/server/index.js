// Ignore those pesky styles
const _ = require('lodash');
const path = require('path');

const moduleAlias = require('module-alias');
moduleAlias.addAlias('build', path.resolve(__dirname, '..', 'build'));
moduleAlias.addAlias('server', path.resolve(__dirname, '..', 'server'));
moduleAlias.addAlias('src', path.resolve(__dirname, '..', 'src'));
moduleAlias.addAlias('media', path.resolve(__dirname, '..', 'src', 'media'));
moduleAlias.addAlias('modules', path.resolve(__dirname, '..', 'src', 'modules'));

const register = require('ignore-styles');
register.default(undefined, (module, filename) => {
    if (_.some(['.svg'], ext => filename.endsWith(ext))) {
      const assetManifest = require('build/asset-manifest.json');
      if(assetManifest.hasOwnProperty(`static/media/${path.basename(filename)}`)) {
        module.exports = assetManifest[`static/media/${path.basename(filename)}`];
      }
    }
})

// Set up babel to do its thing... env for the latest toys, react-app for CRA
require('@babel/register')({
  presets: ['@babel/preset-env', 'kiaba-react-app', '@babel/preset-typescript'],
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts", ".tsx"]
});

// Now that the nonsense is over... load up the server entry point
require('./server');
