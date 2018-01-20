import i18next from 'i18next';

i18next.init({
  interpolation: {
    escapeValue: false
  },
  lng: 'en-AU',
  resources: {
    'en-AU': {
      translation: {
        DateBar: {
          dateString: '{{startMonth}} - {{endMonth}} {{year}}'
        },
        Desktop: {
          dateFormat: 'DD MMM',
          gridCanton: 'Date / Role'
        },
        Mobile: {
          dateFormat: 'DD MMM'
        },
        NavBar: {
          orgTitle: 'EFC Sydney'
        }
      }
    },
    'zh-TW': {
      translation: {
        DateBar: {
          dateString: '{{year}}年{{startMonth}} - {{endMonth}}'
        },
        Desktop: {
          dateFormat: 'MMMDo',
          gridCanton: '日期'
        },
        Mobile: {
          dateFormat: 'MMMDo'
        },
        NavBar: {
          orgTitle: '雪梨台福教會'
        }
      }
    }
  }
});

export default i18next;
