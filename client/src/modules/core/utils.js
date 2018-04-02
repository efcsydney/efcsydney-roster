import Cookies from 'js-cookie';

export const availableServiceNames = [
  'chinese',
  'english',
  'preschool-junior',
  'preschool-middle',
  'preschool-senior',
  'prayer'
];

export function getCategory() {
  const regExp = new RegExp(`(${availableServiceNames.join('|')})`, 'g');
  let category = document.URL.match(regExp);
  if (category) {
    Cookies.set('selectedService', category[0]);
    return category[0];
  }
  category = Cookies.get('selectedService');
  return category ? category : 'english';
}

export function getLang() {
  const regExp = new RegExp(`(${availableServiceNames.join('|')})`, 'g');
  let category = document.URL.match(regExp);
  category = category ? category[0] : Cookies.get('selectedService');

  switch (category) {
    case 'chinese':
      return 'zh-TW';
    case 'english':
      return 'en-AU';
    default:
      return 'en-AU';
  }
}
