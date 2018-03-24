const ServicesAPI = {
  retrieve() {
    return fetch(`/api/services`).then(response => response.json());
  },
  modify(id, body) {
    return fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  }
};
export default ServicesAPI;
