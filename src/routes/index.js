import { map } from 'lodash';
import React from 'react';
import { Route } from 'react-router-dom';
import routes from './routes';

function Routes() {
  return map(routes, (route) => (
    <Route {...route} />
  ))
}

export default Routes;
