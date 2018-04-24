module.exports = {
  components: 'src/core/components/**/*.{js,jsx,ts,tsx}',
  propsParser: require('react-docgen-typescript').parse,
  webpackConfig: require('kiaba-react-scripts/config/webpack.config.dev.js')
}