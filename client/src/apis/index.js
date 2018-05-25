import _ from 'lodash';
import { createApi } from './utils';

export const EventsAPI = createApi('/api/events', {
  modify: body => {
    return fetch('/api/events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  }
});
export const ServicesAPI = createApi('/api/services');
export const ServiceInfoAPI = createApi('/api/serviceInfo');

const mapper = (API, other = {}) => {
  return _.assign(
    {
      create: API.create,
      destroy: API.destroy,
      modify: API.modify,
      retrieve: API.retrieve,
      idAttribute: 'id'
    },
    other
  );
};

export const mapping = {
  events: mapper(EventsAPI, { idAttribute: 'date' }),
  services: mapper(ServicesAPI, { idAttribute: 'id' }),
  serviceInfo: mapper(ServiceInfoAPI, { idAttribute: 'id' })
};
