import { matchPath } from 'react-router';

export default function f(routes: any[], pathname: string) {
  for (const route of routes) {
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