const ServicesAPI = {
  retrieve() {
    return fetch(`/api/services`).then(response => response.json());
  }
};
export default ServicesAPI;
