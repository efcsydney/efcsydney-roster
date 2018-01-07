#!/usr/bin/env node

const fs = require('fs');
const { getEmailHTML } = require('../utils');

const mockData = {
  chinese: [
    {
      date: '2017-12-03',
      lang: 'zh-TW',
      members: [
        { role: '證道', name: '陳文禮' },
        { role: '司會', name: '黃啟碩' },
        { role: '詩歌讚美', name: '黃婷' },
        { role: '司琴', name: '黃正芃' },
        { role: '招待', name: '薛文正' },
        { role: '招待', name: '吳愛倫' },
        { role: '司獻', name: '傅慧' },
        { role: '司獻', name: '何平' },
        { role: '聖餐<br/>聖洗', name: '簡瑞蘭' },
        { role: '投影', name: '宣志凌' },
        { role: '音控', name: '紀哲威' },
        { role: '燈光', name: '許天因' },
        { role: '督堂', name: '許天因' },
        { role: '愛餐', name: '平安' }
      ]
    },
    {
      date: '2017-12-10',
      lang: 'zh-TW',
      members: [
        { role: '證道', name: '林培謙' },
        { role: '司會', name: '李永慷' },
        { role: '詩歌讚美', name: '董芳君' },
        { role: '司琴', name: '黃正芃' },
        { role: '招待', name: '薛文正' },
        { role: '招待', name: '吳愛倫' },
        { role: '司獻', name: '傅慧' },
        { role: '司獻', name: '許天因' },
        { role: '聖餐聖洗', name: '' },
        { role: '投影', name: '宣志凌' },
        { role: '音控', name: '黃啟碩' },
        { role: '燈光', name: '許天因' },
        { role: '督堂', name: '許天因' },
        { role: '愛餐', name: '信實' }
      ]
    }
  ],
  english: [
    {
      date: '2017-12-03',
      lang: 'en-AU',
      members: [
        { role: 'Speaker', name: 'Video' },
        { role: 'Moderator', name: 'Dan Kao' },
        { role: 'P&W', name: 'Amy Chen' },
        { role: 'Pianist', name: 'Angela Sun' },
        { role: 'Usher/Offering', name: 'Christine Yang' },
        { role: 'PA/PPT', name: 'Joseph Chiang' },
        { role: 'Newsletter', name: 'Kai Chang' },
        { role: 'Refreshment', name: 'Christine Yang' }
      ]
    },
    {
      date: '2017-12-10',
      lang: 'en-AU',
      members: [
        { role: 'Speaker', name: 'Gary Tan' },
        { role: 'Moderator', name: 'Bobby Lu' },
        { role: 'P&W', name: 'Betty Chen' },
        { role: 'Pianist', name: 'Amy Chen' },
        { role: 'Usher/Offering', name: 'Cheer Lin' },
        { role: 'PA/PPT', name: 'Joseph Chiang' },
        { role: 'Newsletter', name: 'Kai Chang' },
        { role: 'Refreshment', name: 'Christine Yang' }
      ]
    }
  ]
};

const htmlOutput = getEmailHTML(mockData);
fs.writeFile('./sample.html', htmlOutput, err => {
  if (err) {
    return console.log(err); // eslint-disable-line
  }

  console.log('Please view the email by using `open sample.html` command'); // eslint-disable-line
});
