import _ from 'lodash';
import dotDrop, { set } from 'dot-prop-immutable';
import { schema, normalize } from 'normalizr';
import { combineReducers } from 'redux';
import { mapping as apiMapping } from 'apis';
import { getHashKey } from './utils';

const defaultAsyncState = _.fromPairs(
  Object.keys(apiMapping).map(key => [
    key,
    {
      retrieve: {
        hasInitialized: false,
        isLoading: false,
        loadingIds: {},
        completedIds: {}
      },
      create: {
        hasInitialized: false,
        isLoading: false,
        loadingIds: {},
        completedIds: {}
      },
      modify: {
        hasInitialized: false,
        isLoading: false,
        loadingIds: {},
        completedIds: {}
      },
      delete: {
        hasInitialized: false,
        isLoading: false,
        loadingIds: {},
        completedIds: {}
      }
    }
  ])
);

const asyncStatusReducer = (
  state = defaultAsyncState,
  { resource, payload }
) => {
  if (!resource) return state;
  if (!apiMapping[resource.name]) return state;

  const idAttribute = apiMapping[resource.name].idAttribute;

  switch (resource.stage) {
    case 'start': {
      const id = _.get(payload, [idAttribute], '') || 'creating';

      if (!id) {
        state = set(state, [resource.name, resource.method, 'isLoading'], true);

        return state;
      }

      state = set(
        state,
        [resource.name, resource.method, 'loadingIds', id],
        true
      );
      return state;
    }
    case 'complete': {
      const id = _.get(payload, [idAttribute], '') || 'creating';

      if (!id) {
        state = set(
          state,
          [resource.name, resource.method, 'isLoading'],
          false
        );
        state = set(
          state,
          [resource.name, resource.method, 'hasInitialized'],
          true
        );
      }

      state = dotDrop.delete(state, [
        resource.name,
        resource.method,
        'loadingIds',
        id
      ]);
      state = set(
        state,
        [resource.name, resource.method, 'completedIds', id],
        true
      );
      return state;
    }
    case 'reset': {
      const id = _.get(payload, [idAttribute], '') || 'creating';

      if (!id) {
        return state;
      }
      state = dotDrop.delete(state, [
        resource.name,
        resource.method,
        'completedIds',
        id
      ]);
      return state;
    }
    default:
      return state;
  }
};

const defaultAsyncData = _.fromPairs(
  _.map(Object.keys(apiMapping), resource => [resource, {}])
);

const asyncDataReducer = (state = defaultAsyncData, { resource, payload }) => {
  if (!resource) return state;
  if (!apiMapping[resource.name]) return state;
  if (resource.stage !== 'complete') return state;

  switch (resource.method) {
    case 'modify':
    case 'create':
    case 'retrieve': {
      const idAttribute =
        !_.isEmpty(apiMapping[resource.name]) &&
        (value => _.get(value, apiMapping[resource.name].idAttribute));

      // not idAttribute means it's a single resource
      if (idAttribute) {
        let normalizeSchema = new schema.Entity(resource.name, undefined, {
          idAttribute
        });
        if (Array.isArray(payload.data)) {
          normalizeSchema = new schema.Array(normalizeSchema);
        }
        const normalized = normalize(payload.data, normalizeSchema);

        return dotDrop.merge(
          state,
          [resource.name],
          normalized.entities[resource.name]
        );
      } else {
        return dotDrop.set(state, [resource.name], payload.data);
      }
    }
    case 'delete': {
      return dotDrop.delete(state, [resource.name, payload.params.id]);
    }
    default:
      return state;
  }
};

const asyncCacheReducer = (state = {}, action) => {
  const { resource, payload } = action;
  if (!resource) return state;
  if (!apiMapping[resource.name]) return state;
  if (resource.method !== 'retrieve') return state;

  const key = getHashKey(resource, payload.params);

  switch (resource.stage) {
    case 'complete': {
      const idAttribute = apiMapping[resource.name].idAttribute;

      // not idAttribute means it's a single resource
      if (idAttribute) {
        const docSchema = new schema.Entity(resource.name, undefined, {
          idAttribute
        });
        const normalizeSchema = {
          data: Array.isArray(payload.data)
            ? new schema.Array(docSchema)
            : docSchema
        };
        const normalized = normalize(payload, normalizeSchema);

        return dotDrop.set(state, key, normalized.result);
      } else {
        return dotDrop.set(state, key, payload);
      }
    }
    default:
      return state;
  }
};

export default combineReducers({
  cache: asyncCacheReducer,
  data: asyncDataReducer,
  status: asyncStatusReducer
});
