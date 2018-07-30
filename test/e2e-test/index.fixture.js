import _ from 'lodash';
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { getEvents, modifyServiceInfo } from './api';

const CATEGORY = 'english';
const FROM_DATE = '2000-01-01';
const TO_DATE = '2000-03-01';
const FIRST_DATE = '2000-01-02';

const isDev = process.env.NODE_ENV === 'development';
const webUrl = isDev
  ? 'http://localhost:3000'
  : 'https://demo-roster.efcsydney.org';

fixture('Quarter View') // eslint-ignore-line
  .page(`${webUrl}/#/index/${CATEGORY}?from=${FROM_DATE}&to=${TO_DATE}`)
  .beforeEach(async () => {
    await waitForReact();
  });

test('Edit Day', async t => {
  const options = { timeout: 500 };
  const FirstCell = Selector('table tbody tr:nth-child(1) td:nth-child(2)');
  const Popup = ReactSelector('Popup');
  const NoteInput = Popup.findReact('Input').with(options);
  const ReasonInput = Popup.findReact('StyledInput').with(options);
  const SaveButton = Popup.findReact('Button');
  const SwitchButton = Popup.findReact('Handle').with(options);
  const CombinedCell = Selector('table tbody tr:nth-child(1) td:nth-child(3)');

  await t
    .click(FirstCell)
    .selectText(NoteInput)
    .typeText(NoteInput, 'Footnote Test')
    .click(SaveButton)
    .expect(FirstCell.innerText)
    .contains('Footnote Test', 'Modify the first cell to "Footnote Test"');

  await t
    .click(FirstCell)
    .click(SwitchButton)
    .selectText(ReasonInput)
    .typeText(ReasonInput, 'Church Camp')
    .click(SaveButton)
    .expect(CombinedCell.innerText)
    .contains('Church Camp', 'Modify the second cell to "Church Camp"');
})
  .before(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
    }
  })
  .after(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
    }
  });

function getEventId() {
  return getEvents({
    category: CATEGORY,
    fromDate: FROM_DATE,
    toDate: TO_DATE
  }).then(({ data }) => {
    const day = _.find(data, { date: FIRST_DATE });
    return day && day.id;
  });
}

function resetServiceInfo(id) {
  return modifyServiceInfo(id, {
    category: CATEGORY,
    date: FIRST_DATE,
    footnote: '',
    skipService: false,
    skipReason: ''
  });
}
