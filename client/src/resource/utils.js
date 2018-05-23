import hash from 'string-hash';

export const getHashKey = (resource, params) => {
  return hash(
    JSON.stringify({
      name: resource.name,
      method: resource.method,
      params: params
    })
  );
};
