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

  const onFulfilled = response => response.json();

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
    modify: function(id, body) {
      return fetch(`${path}/${id}`, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(body)
      }).then(onFulfilled);
    },
    retrieve: function(query) {
      query = buildQuery(query);
      return fetch(`${path}?${query}`).then(onFulfilled);
    },
    ...overwrite
  };
}
