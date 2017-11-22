const API = {
  retrieve(query) {
    return fetch(
      `/api/events?from=${query.from}&to=${query.to}&mock=${query.mock}&category=english`
    ).then(response => response.json());
  },
  modify(query) {
    return fetch(`/api/events?mock=${query.mock}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    }).then(response => response.json());
  }
};
export default API;
