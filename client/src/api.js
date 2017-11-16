const API = {
  retrieve({ from, to }) {
    return fetch(
      `/api/events?from=${from}&to=${to}&category=english`
    ).then(response => response.json());
  },
  modify(query) {
    fetch('/api/events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    }).then(response => response.json());
  }
};
export default API;
