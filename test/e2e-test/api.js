import fetch from 'node-fetch';

const isDev = process.env.NODE_ENV === 'development';
const apiUrl = isDev
  ? 'http://localhost:3001'
  : 'https://demo-roster.efcsydney.org';

export function createServiceInfo({ category, date }) {
  return fetch(`${apiUrl}/api/serviceInfo`, {
    method: 'POST',
    body: JSON.stringify({
      category,
      date,
      footnote: '',
      skipService: false,
      skipReason: ''
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

export function getEvents({ category, fromDate, toDate }) {
  return fetch(
    `${apiUrl}/api/events?category=${category}&from=${fromDate}&to=${toDate}`
  ).then(res => res.json());
}

export function modifyServiceInfo(id, { category, date }) {
  return fetch(`${apiUrl}/api/serviceInfo/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      category,
      date,
      footnote: '',
      skipService: false,
      skipReason: ''
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}
