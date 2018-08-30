import _ from 'lodash';
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { getEvents, modifyServiceInfo } from './api';

// Environment
const isDev = _.includes(['test', 'development'], process.env.NODE_ENV);
const webUrl = isDev
  ? 'http://localhost:3000'
  : 'https://demo-roster.efcsydney.org';

// Constants
const CATEGORY = 'english';
const FROM_DATE = '2000-01-01';
const TO_DATE = '2000-03-01';
const FIRST_DATE = '2000-01-02';

// Selectors
const options = { timeout: 500 };
const FirstCell = Selector('table tbody tr:nth-child(1) td:nth-child(2)');
const Popup = ReactSelector('Popup');
const NoteInput = Popup.findReact('Input').with(options);

const ReasonInput = Popup.findReact('StyledInput').with(options);
const SaveButton = Popup.findReact('Button');
const SwitchButton = Popup.findReact('Handle').with(options);
const CombinedCell = Selector('table tbody tr:nth-child(1) td:nth-child(3)');

fixture('Quarter View')
  .page(`${webUrl}/#/index/${CATEGORY}?from=${FROM_DATE}&to=${TO_DATE}`)
  .beforeEach(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
    }
    await waitForReact();
  })
  .afterEach(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
    }
  });

test('Combined Service', async t => {
  // Waguei to implement
  await t
    .click(FirstCell)
    .click(SwitchButton)
    .selectText(ReasonInput)
    .typeText(ReasonInput, 'Church Camp')
    .click(SaveButton)
    .expect(CombinedCell.innerText)
    .contains('Church Camp', 'Modify the second cell to "Church Camp"');
});

test('Combined Service - Mobile', async t => {
  // Waguei to implement
});

test('Footnote', async t => {
  // Choco to maintain
  await t
    .click(FirstCell)
    .selectText(NoteInput)
    .typeText(NoteInput, 'Footnote Test')
    .click(SaveButton)
    .expect(FirstCell.innerText)
    .contains('Footnote Test', 'Modify the first cell to "Footnote Test"');
});

test('Footnote - Mobile', async t => {
  // Choco to implement
});

test('Edit Day - Mobile', async t => {
  // Choco to implement
});

test('Edit Role', async t => {
  // Choco to implement
});

test('Edit Role - Mobile', async t => {
  // Choco to implement
});

test('Go to Prev/Next Quarter', async t => {
  // James to implement
  const ArrowLeft = ReactSelector('Arrow');
  const ArrowRight = ReactSelector('Arrow').nth(1);
  const DateTextHeader = ReactSelector('Label');
  const DateTextFooter = ReactSelector('Label').nth(1);

  await t
    .click(ArrowLeft)
    .expect(DateTextHeader.innerText)
    .eql('Oct - Dec 1999')
    .expect(DateTextFooter.innerText)
    .eql('Oct - Dec 1999')

  await t
    .click(ArrowRight)
    .expect(DateTextHeader.innerText)
    .eql('Jan - Mar 2000')
    .expect(DateTextFooter.innerText)
    .eql('Jan - Mar 2000')

});

test('Switch to Differet Service', async t => {
  // Better to have - Liam to implement
});

test('Highlight', async t => {
  // Better to have - Liam to implement
});
//================
// API Utilities
//================
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
