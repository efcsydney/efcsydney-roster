import fetch from 'node-fetch';

const isDev = process.env.NODE_ENV === 'development';
const apiUrl = isDev
  ? 'http://localhost:3001'
  : 'https://demo-roster.efcsydney.org';

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
  }).then(res => res.json());
}

export function modifyEvent(id, { category, date }) {
  return fetch(`${apiUrl}/api/events`, {
    method: 'PUT',
    body: JSON.stringify({
      date,
      role: 'Speaker',
      name: '',
      serviceInfo: {
        id,
        category
      }
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

