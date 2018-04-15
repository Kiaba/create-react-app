import Loadable from 'react-loadable';

const App = Loadable({
  loader: () => import('modules/App/components/App'),
  loading: () => null
});

const NotFound = Loadable({
  loader: () => import('modules/NotFound/components/NotFound'),
  loading: () => null
});
  
export const routes = [
  { path: '/',
    exact: true,
    component: App
  },
  { path: '/404',
    exact: true,
    component: NotFound
  }
];