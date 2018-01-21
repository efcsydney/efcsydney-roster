export default {
  modify(id, body) {
    return fetch(`/api/serviceInfo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  }
};
