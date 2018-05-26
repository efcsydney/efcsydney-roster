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
