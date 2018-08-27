/**
 * Usage:
 *
 * const EventsAPI = createApi('/api/oevents');
 *
 * You will get `create`, `destroy`, `modify`, and `retrieve` methods
 * which return promises
 */
import { buildQuery } from '../utils';

export function createApi(path, overwrite) {
  if (!path) {
    throw new Error('You have to provide the path argument');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const onFulfilled = response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  };

  return {
    create: function(body) {
      return fetch(path, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(body)
      }).then(onFulfilled);
    },
    destroy: function(id) {
      return fetch(`${path}/${id}`, {
        method: 'DELETE'
      }).then(onFulfilled);
    },
    modify: function(params) {
      const { id, ...body } = params;
      const url = id ? `${path}/${id}` : path;

      return fetch(url, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(body)
      }).then(onFulfilled);
    },
    retrieve: function(params) {
      const { id, ...otherParams } = params;
      const query = buildQuery(otherParams);
      const url = id ? `${path}/${id}?${query}` : `${path}?${query}`;

      return fetch(url).then(onFulfilled);
    },
    ...overwrite
  };
}
