const fs = require('fs');
const utils = require('../../scripts/email/utils');

const mockEvents = {
  chinese: [
    {
      date: '2023-11-05', // Use a Sunday
      lang: 'zh-TW',
      positions: [
        { position: '領會', volunteerName: 'Bro. Wang' },
        { position: '司琴', volunteerName: 'Sis. Li' },
        { position: '司獻', volunteerName: 'Bro. Zhang' },
        { position: '招待', volunteerName: 'Sis. Chen' }
      ],
      serviceInfo: {
        service: { label: '主日崇拜' },
        footnote: '聖餐',
        skipService: false,
        skipReason: '',
        positions: [
          { position: '領會' },
          { position: '司琴' },
          { position: '司獻' },
          { position: '招待' }
        ]
      }
    },
    {
      date: '2023-11-12',
      lang: 'zh-TW',
      positions: [
         { position: '領會', volunteerName: 'Bro. Liu' },
         { position: '司琴', volunteerName: 'Sis. Wu' },
         { position: '司獻', volunteerName: 'Bro. Zhao' },
         { position: '招待', volunteerName: 'Sis. Sun' }
      ],
      serviceInfo: {
        service: { label: '主日崇拜' },
        footnote: '',
        skipService: false,
        skipReason: '',
        positions: [
          { position: '領會' },
          { position: '司琴' },
          { position: '司獻' },
          { position: '招待' }
        ]
      }
    }
  ],
  english: [
    {
      date: '2023-11-05',
      lang: 'en-AU',
      positions: [
        { position: 'Speaker', volunteerName: 'Pastor John' },
        { position: 'Worship Leader', volunteerName: 'Alice' },
        { position: 'Pianist', volunteerName: 'Bob' }
      ],
      serviceInfo: {
        service: { label: 'English Service' },
        footnote: 'Holy Communion',
        skipService: false,
        skipReason: '',
        positions: [
          { position: 'Speaker' },
          { position: 'Worship Leader' },
          { position: 'Pianist' }
        ]
      }
    },
     {
      date: '2023-11-12',
      lang: 'en-AU',
      positions: [], // No volunteers yet
      serviceInfo: {
        service: { label: 'English Service' },
        footnote: '',
        skipService: true,
        skipReason: 'Combined Service',
        positions: [
          { position: 'Speaker' },
          { position: 'Worship Leader' },
          { position: 'Pianist' }
        ]
      }
    }
  ]
};

const mockEmailList = [
  { englishName: 'Alice', email: 'alice@example.com' },
  { englishName: 'Bob', email: 'bob@example.com' }
];

const mockEmptyEmailList = '';

try {
  const html = utils.getEmailHTML(mockEvents, mockEmailList, mockEmptyEmailList);
  fs.writeFileSync('test_output.html', html);
  console.log('Successfully generated test_output.html');
} catch (error) {
  console.error('Error generating email HTML:', error);
}
