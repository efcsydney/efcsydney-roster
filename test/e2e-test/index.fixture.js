/* global fixture */
import _ from 'lodash';
import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { getEvents, modifyServiceInfo, modifyEvent } from './api';

// Environment
const isDev = process.env.NODE_ENV === 'development';
const webUrl = isDev
  ? 'http://localhost:3000'
  : 'https://demo-roster.efcsydney.org';

// Constants
const CATEGORY = 'english';
const FROM_DATE = '2000-01-01';
const TO_DATE = '2000-03-01';
const FIRST_DATE = '2000-01-02';
const MOBILE_WIDTH = 300;
const MOBILE_HEIGHT = 500;
const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;
const OPTIONS = { timeout: 1000 };

// Selectors
const FirstCell = Selector('table tbody tr:nth-child(1) td:nth-child(2)');
const Popup = ReactSelector('Popup');
const FootNoteInput = Popup.findReact('Input').with(OPTIONS);
const NoteInput = Popup.findReact('Input').with(OPTIONS);
const ReasonInput = Popup.findReact('StyledInput').with(OPTIONS);
const SaveButton = Popup.findReact('Button');
const SwitchButton = Popup.findReact('Handle').with(OPTIONS);
const CombinedCell = Selector('table tbody tr:nth-child(1) td:nth-child(3)');

fixture('Quarter View')
  .page(`${webUrl}/#/index/${CATEGORY}?from=${FROM_DATE}&to=${TO_DATE}`)
  .beforeEach(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
      await resetEvent(id);
    }
    await waitForReact(2000);
  })
  .afterEach(async () => {
    const id = await getEventId();
    if (id) {
      await resetServiceInfo(id);
      await resetEvent(id);
    }
  });

test('Combined Service', async t => {
  await t
    .resizeWindow(DESKTOP_WIDTH, DESKTOP_HEIGHT)
    .click(FirstCell)
    .click(SwitchButton)
    .selectText(ReasonInput)
    .typeText(ReasonInput, 'Church Camp')
    .click(SaveButton)
    .expect(CombinedCell.innerText)
    .contains('Church Camp', 'Modify the second cell to "Church Camp"');
});

test('Combined Service - Mobile', async t => {});

test('Footnote', async t => {
  await t
    .resizeWindow(DESKTOP_WIDTH, DESKTOP_HEIGHT)
    .click(FirstCell)
    .selectText(FootNoteInput)
    .typeText(FootNoteInput, 'Footnote Test')
    .click(SaveButton)
    .expect(FirstCell.innerText)
    .contains('Footnote Test', 'Modify the first cell to "Footnote Test"');
});

test('Footnote - Mobile', async t => {
  const SettingLink = ReactSelector('Grid Day Cell SettingLink');
  // can also select like ReactSelector('Grid Day Cell').nth(0).findReact('SettingLink');
  const FootnoteText = ReactSelector('Grid Day Cell Footnote');

  await t
    .resizeWindow(MOBILE_WIDTH, MOBILE_HEIGHT)
    .click(SettingLink)
    .selectText(NoteInput)
    .typeText(NoteInput, 'Footnote Test')
    .click(SaveButton)
    .expect(FootnoteText.innerText)
    .contains('Footnote Test', 'Modify the first cell to "Footnote Test"');

  // test again after reload
  await t.eval(() => location.reload(true));
  await t
    .expect(FootnoteText.innerText)
    .contains('Footnote Test', 'Modify the first cell to "Footnote Test"');
});

test('Edit Day', async t => {
  const RoleCell = ReactSelector('Grid Row')
    .nth(1)
    .findReact('Cell')
    .nth(2)
    .findReact('Text');

  await t
    .resizeWindow(DESKTOP_WIDTH, DESKTOP_HEIGHT)
    .click(RoleCell)
    .pressKey('T')
    .pressKey('E')
    .pressKey('S')
    .pressKey('T')
    .pressKey('enter')
    .expect(RoleCell.innerText)
    .eql('TEST');
  await t.eval(() => location.reload(true));
  await t.expect(RoleCell.innerText).eql('TEST');
});

test('Edit Day - Mobile', async t => {
  const RoleCell = ReactSelector('Grid Day Row')
    .nth(0)
    .findReact('Cell')
    .nth(1);

  await t
    .resizeWindow(MOBILE_WIDTH, MOBILE_HEIGHT)
    .click(RoleCell)
    .pressKey('T')
    .pressKey('E')
    .pressKey('S')
    .pressKey('T')
    .pressKey('2')
    .pressKey('enter')
    .click(SaveButton)
    .expect(RoleCell.innerText)
    .eql('TEST2');
  await t.eval(() => location.reload(true));
  await t.expect(RoleCell.innerText).eql('TEST2');
});

test('Go to Prev/Next Quarter', async t => {
  const ArrowLeft = ReactSelector('Arrow');
  const ArrowRight = ReactSelector('Arrow').nth(1);
  const DateTextHeader = ReactSelector('Label');
  const DateTextFooter = ReactSelector('Label').nth(1);

  await t
    .resizeWindow(DESKTOP_WIDTH, DESKTOP_HEIGHT)
    .click(ArrowLeft)
    .expect(DateTextHeader.innerText)
    .eql('Oct - Dec 1999')
    .expect(DateTextFooter.innerText)
    .eql('Oct - Dec 1999');

  await t
    .resizeWindow(DESKTOP_WIDTH, DESKTOP_HEIGHT)
    .click(ArrowRight)
    .expect(DateTextHeader.innerText)
    .eql('Jan - Mar 2000')
    .expect(DateTextFooter.innerText)
    .eql('Jan - Mar 2000');
});

test('Switch to Differet Service', async t => {});

test('Highlight', async t => {});
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

function resetEvent(id) {
  return modifyEvent(id, {
    category: CATEGORY,
    date: FIRST_DATE
  });
}
