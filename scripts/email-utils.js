const { mjml2html } = require('mjml');

/**
 * Generate Email HTML according to events
 *
 * @method getEmailHTML
 * @param events {Object}
 * @return {String}
 */
function getEmailHTML(events) {
  // eslint-disable-line
  // https://mjml.io/documentation/#mjml-table
  const result = mjml2html(`
    <mjml>
      <mj-body>
        <mj-container>
          <mj-section>
            <mj-text>各位弟兄姊妹平安</mj-text>
            <mj-text>溫馨提醒下兩週的同工預備心服事</mj-text>
            <mj-column>
              <mj-table>
                <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                  <th style="padding: 0 15px 0 0;">Year</th>
                  <th style="padding: 0 15px;">Language</th>
                  <th style="padding: 0 0 0 15px;">Inspired from</th>
                </tr>
                <tr>
                  <td style="padding: 0 15px 0 0;">1995</td>
                  <td style="padding: 0 15px;">PHP</td>
                  <td style="padding: 0 0 0 15px;">C, Shell Unix</td>
                </tr>
                <tr>
                  <td style="padding: 0 15px 0 0;">1995</td>
                  <td style="padding: 0 15px;">JavaScript</td>
                  <td style="padding: 0 0 0 15px;">Scheme, Self</td>
                </tr>
              </mj-table>
            </mj-column>
            <mj-text>Regards,</mj-text>
            <mj-text>Deborah</mj-text>
          </mj-section>
        </mj-container>
      </mj-body>
    </mjml>
  `);

  return result.html;
}

const eventsMock = {
  english: [
    {
      date: '2017-12-03',
      members: [
        { role: 'Speaker', name: 'David Luis' },
        { role: 'Moderator', name: 'Gary Tan' },
        { role: 'Speaker', name: 'David Luis' },
        { role: 'Moderator', name: 'Gary Tan' },
        { role: 'P&W', name: 'Dan Kao' },
        { role: 'Pianist', name: 'Yvonne Lu' },
        { role: 'Usher/Offering', name: 'Kai Chang' }
      ]
    },
    {
      date: '2017-12-10',
      members: []
    }
  ],
  chinese: [
    {
      date: '2017-12-03',
      members: [
        { role: '證道', name: '陳文禮' },
        { role: '司會', name: '黃啟碩' },
        { role: '詩歌讚美', name: '黃婷' },
        { role: '司琴', name: '黃正芃' },
        { role: '招待', name: '薛文正' },
        { role: '招待', name: '吳愛倫' },
        { role: '司獻', name: '傅慧' },
        { role: '司獻', name: '何平' },
        { role: '聖餐聖洗', name: '簡瑞蘭' },
        { role: '投影', name: '宣志凌' },
        { role: '聖餐聖洗', name: '簡瑞蘭' },
        { role: '音控', name: '紀哲威' },
        { role: '燈光', name: '許天因' },
        { role: '督堂', name: '許天因' },
        { role: '愛餐', name: '平安' }
      ]
    },
    {
      date: '2017-12-10',
      members: []
    }
  ]
};
const htmlOutput = getEmailHTML(eventsMock);
console.log(htmlOutput); // eslint-disable-line
