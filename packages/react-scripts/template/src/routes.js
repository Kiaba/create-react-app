import Loadable from 'react-loadable';

const App = Loadable({
  loader: () => import('modules/app/components/App'),
  loading: () => null
});
  
export const routes = [
  { path: '/',
    exact: true,
    component: App
  }
];