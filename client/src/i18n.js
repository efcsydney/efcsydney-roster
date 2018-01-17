import i18next from 'i18next';

i18next.init({
  interpolation: {
    escapeValue: false
  },
  lng: 'en-AU',
  resources: {
    'en-AU': {
      translation: {
        dateRoleHeader: 'Date / Role',
        orgTitle: 'EFC Sydney'
      }
    },
    'zh-TW': {
      translation: {
        dateRoleHeader: '日期',
        orgTitle: '雪梨台福教會'
      }
    }
  }
});

export default i18next;
