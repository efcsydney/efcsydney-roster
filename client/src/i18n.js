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
          gridCanton: 'Date / Role',
          occassion: 'Occassion'
        },
        EditDay: {
          dateFormat: 'DD MMM, YYYY',
          dateTitle: 'Date',
          footnotePlaceholder: 'ex. Holy Communion',
          footnoteTitle: 'Occassion',
          saveLabel: 'Save',
          skipReasonTitle: 'Skip Reason',
          skipReasonPlaceholder: 'ex. Combined Service',
          title: 'Edit Day'
        },
        EditRole: {
          dateFormat: 'DD MMM, YYYY',
          dateTitle: 'Date',
          roleTitle: 'Role',
          nameTitle: 'Name',
          saveLabel: 'Save',
          title: 'Edit Role'
        },
        Mobile: {
          dateFormat: 'DD MMM'
        },
        NavBar: {
          chineseService: 'Chinese Sunday Service Roster',
          englishService: 'English Sunday Service Roster',
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
          gridCanton: '日期',
          occassion: '型式'
        },
        EditDay: {
          dateFormat: 'YYYY年MMMDo',
          dateTitle: '日期',
          footnotePlaceholder: '範例：聯合崇拜',
          footnoteTitle: '型式',
          saveLabel: '儲存',
          skipReasonTitle: '跳過',
          skipReasonPlaceholder: '範例：聖誕晚會',
          title: '日期特別設定'
        },
        EditRole: {
          dateFormat: 'YYYY年MMMDo',
          dateTitle: '日期',
          roleTitle: '服事',
          nameTitle: '姓名',
          saveLabel: '儲存',
          title: '編輯服事人員'
        },
        Mobile: {
          dateFormat: 'MMMDo'
        },
        NavBar: {
          chineseService: '中文堂服事表',
          englishService: '英文堂服事表',
          orgTitle: '雪梨台福教會'
        }
      }
    }
  }
});

export default i18next;
