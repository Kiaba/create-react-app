import { matchPath } from 'react-router';

export default function f(routes, pathname) {
  for(let i=0; i<routes.length; i++) {
    const route = routes[i];
    if(matchPath(pathname, route)) {
      return true;
    }
    if(route.hasOwnProperty('routes') === false) {
      continue;
    }
    if(f(route.routes, pathname)) {
      return true;
    }
  }
  return false;
}