#!/usr/bin/env node

const fs = require('fs');
const { getEmailHTML } = require('../utils');

const mockData = {
  chinese: [
    {
      date: '2017-12-03',
      lang: 'zh-TW',
      positions: [
        { position: '證道', volunteerName: '陳文禮' },
        { position: '司會', volunteerName: '黃啟碩' },
        { position: '詩歌讚美', volunteerName: '黃婷' },
        { position: '司琴', volunteerName: '黃正芃' },
        { position: '招待', volunteerName: '薛文正' },
        { position: '招待', volunteerName: '吳愛倫' },
        { position: '司獻', volunteerName: '傅慧' },
        { position: '司獻', volunteerName: '何平' },
        { position: '聖餐<br/>聖洗', volunteerName: '簡瑞蘭' },
        { position: '投影', volunteerName: '宣志凌' },
        { position: '音控', volunteerName: '紀哲威' },
        { position: '燈光', volunteerName: '許天因' },
        { position: '督堂', volunteerName: '許天因' },
        { position: '愛餐', volunteerName: '平安' }
      ]
    },
    {
      date: '2017-12-10',
      lang: 'zh-TW',
      positions: [
        { position: '證道', volunteerName: '林培謙' },
        { position: '司會', volunteerName: '李永慷' },
        { position: '詩歌讚美', volunteerName: '董芳君' },
        { position: '司琴', volunteerName: '黃正芃' },
        { position: '招待', volunteerName: '薛文正' },
        { position: '招待', volunteerName: '吳愛倫' },
        { position: '司獻', volunteerName: '傅慧' },
        { position: '司獻', volunteerName: '許天因' },
        { position: '聖餐聖洗', volunteerName: '' },
        { position: '投影', volunteerName: '宣志凌' },
        { position: '音控', volunteerName: '黃啟碩' },
        { position: '燈光', volunteerName: '許天因' },
        { position: '督堂', volunteerName: '許天因' },
        { position: '愛餐', volunteerName: '信實' }
      ]
    }
  ],
  english: [
    {
      date: '2017-12-03',
      lang: 'en-AU',
      positions: [
        { position: 'Speaker', volunteerName: 'Video' },
        { position: 'Moderator', volunteerName: 'Dan Kao' },
        { position: 'P&W', volunteerName: 'Amy Chen' },
        { position: 'Pianist', volunteerName: 'Angela Sun' },
        { position: 'Usher/Offering', volunteerName: 'Christine Yang' },
        { position: 'PA/PPT', volunteerName: 'Joseph Chiang' },
        { position: 'Newsletter', volunteerName: 'Kai Chang' },
        { position: 'Refreshment', volunteerName: 'Christine Yang' }
      ]
    },
    {
      date: '2017-12-10',
      lang: 'en-AU',
      positions: [
        { position: 'Speaker', volunteerName: 'Gary Tan' },
        { position: 'Moderator', volunteerName: 'Bobby Lu' },
        { position: 'P&W', volunteerName: 'Betty Chen' },
        { position: 'Pianist', volunteerName: 'Amy Chen' },
        { position: 'Usher/Offering', volunteerName: 'Cheer Lin' },
        { position: 'PA/PPT', volunteerName: 'Joseph Chiang' },
        { position: 'Newsletter', volunteerName: 'Kai Chang' },
        { position: 'Refreshment', volunteerName: 'Christine Yang' }
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
