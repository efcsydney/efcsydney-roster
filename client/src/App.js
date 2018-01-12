import React from 'react';
import { Route } from 'react-router-dom';
import Index from './modules/index';

export default () => (
  <div>
    <Route path="(/|/chinese|/english)" component={Index} />
  </div>
);
