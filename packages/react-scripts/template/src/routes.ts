const Loadable = require('react-loadable');

const App = Loadable({
  loader: () => import('modules/App/components/App'),
  loading: () => null
});

const NotFound = Loadable({
  loader: () => import('modules/NotFound/components/NotFound'),
  loading: () => null
});
  
export const routes = [
  { component: App,
    exact: true,
    path: '/',
  },
  { component: NotFound,
    exact: true,
    path: '/404',
  }
];