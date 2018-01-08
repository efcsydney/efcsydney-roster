import { buildQuery } from '../utils';

const EventsAPI = {
  retrieve(query) {
    query.category = 'english';
    return fetch(`/api/events?${buildQuery(query)}`).then(response =>
      response.json()
    );
  },
  modify({ mock, ...body }) {
    const query = buildQuery({ mock });
    return fetch(`/api/events?${query}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  }
};
export default EventsAPI;
