import _ from 'lodash';

const upper = string => _.snakeCase(string).toUpperCase();

const createAsyncAction = (name, method, stage = '') => {
  const TYPE = upper([method, name, stage].join('_'));
  const actionCreator = (params, meta) => {
    return {
      type: TYPE,
      payload: params,
      meta: meta,
      resource: {
        name,
        method,
        stage: stage || 'start'
      }
    };
  };
  actionCreator.toString = function() {
    return TYPE;
  };
  return actionCreator;
};

const createApiActions = endpoint => {
  return {
    [_.camelCase(`create_${endpoint}`)]: createAsyncAction(endpoint, 'create'),
    [_.camelCase(`create_${endpoint}_complete`)]: createAsyncAction(
      endpoint,
      'create',
      'complete'
    ),
    [_.camelCase(`create_${endpoint}_reset`)]: createAsyncAction(
      endpoint,
      'create',
      'reset'
    ),
    [_.camelCase(`retrieve_${endpoint}`)]: createAsyncAction(
      endpoint,
      'retrieve'
    ),
    [_.camelCase(`retrieve_${endpoint}_complete`)]: createAsyncAction(
      endpoint,
      'retrieve',
      'complete'
    ),
    [_.camelCase(`retrieve_${endpoint}_reset`)]: createAsyncAction(
      endpoint,
      'retrieve',
      'reset'
    ),
    [_.camelCase(`modify_${endpoint}`)]: createAsyncAction(endpoint, 'modify'),
    [_.camelCase(`modify_${endpoint}_complete`)]: createAsyncAction(
      endpoint,
      'modify',
      'complete'
    ),
    [_.camelCase(`modify_${endpoint}_reset`)]: createAsyncAction(
      endpoint,
      'modify',
      'reset'
    ),
    [_.camelCase(`delete_${endpoint}`)]: createAsyncAction(endpoint, 'delete'),
    [_.camelCase(`delete_${endpoint}_complete`)]: createAsyncAction(
      endpoint,
      'delete',
      'complete'
    ),
    [_.camelCase(`delete_${endpoint}_reset`)]: createAsyncAction(
      endpoint,
      'delete',
      'reset'
    )
  };
};

export { createAsyncAction, createApiActions };
