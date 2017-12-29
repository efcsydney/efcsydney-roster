const { mjml2html } = require('mjml');
const _ = require('lodash');
const moment = require('moment');
require('moment/locale/en-au');
require('moment/locale/zh-tw');

const cellStyle = `
  border: 1px solid #000;
  font-size: 12px;
  line-height: 1.3;
  padding: 4px 2px;
  text-align: center;
  white-space: nowrap;
`;

const renderHeaderRow = members => `
  <tr>
    <th style="${cellStyle}">&nbsp;</th>
    ${members
      .map(
        ({ role }) => `
    <th style="${cellStyle}">${role}</th>
    `
      )
      .join('\n')}
  </tr>
`;

const renderMemberRow = ({ date, members, lang }) => {
  moment.locale(lang);
  if (lang === 'zh-TW') {
    date = moment(date).format('MMMDo');
  } else if (lang === 'en-AU') {
    date = moment(date).format('D MMM');
  } else {
    date = moment(date).format('ll');
  }

  return `
    <tr>
      <td style="${cellStyle}">${date}</td>
      ${members
        .map(
          ({ name }) => `
      <td style="${cellStyle}">${name}</td>
      `
        )
        .join('\n')}
    </tr>
  `;
};

const renderTable = days => `
  <mj-section padding="5px 0 10px">
    <mj-table padding="0">
      ${renderHeaderRow(days[0].members)}
      ${days.map(day => renderMemberRow(day)).join('')}
    </mj-table>
  </mj-section>
`;

/**
 * Generate Email HTML according to events
 *
 * @method getEmailHTML
 * @param events {Object}
 * @return {String}
 */
exports.getEmailHTML = events => {
  const mjml = `
    <mjml>
      <mj-body>
        <mj-container width="650px">
          <mj-section padding="10px 0 7px">
            <mj-text font-size="16px">各位弟兄姊妹平安</mj-text>
          </mj-section>
          <mj-section padding="10px 0 15px">
            <mj-text font-size="16px">溫馨提醒下兩週的同工預備心服事</mj-text>
          </mj-section>
          <mj-section padding="0 0 10px">
            ${_.values(events)
              .map(days => renderTable(days))
              .join('\n')}
          </mj-section>
          <mj-section padding="0">
            <mj-text font-size="14px">Regards,</mj-text>
            <mj-text font-size="14px">Deborah</mj-text>
          </mj-section>
        </mj-container>
      </mj-body>
    </mjml>
  `;

  return mjml2html(mjml).html;
};
