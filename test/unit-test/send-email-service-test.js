const chai = require('chai');
const expect = chai.expect;
const {
  parseCsvEmailFile,
  getEmailListString,
  getEmptyEmailListString,
  filterPositions
} = require('../../api/service/send-email-service');
const { EmailListItem } = require('../../api/models/email-list-item');

describe('Send Email Service - Parsing Email CSV File and Build Email String', function() {
  this.timeout(5000);
  it('returns only items that have either a English or Chinese name or both and a valid email address or empty email', function() {
    const emailCsvFilePath = 'db/data/email-list-example.csv';
    const actualEmailList = parseCsvEmailFile(emailCsvFilePath);
    const expectedNumberOfItems = 50;
    expect(actualEmailList.length).to.eq(expectedNumberOfItems);
  });
  it('correctly ignores first few rows that contains only "metadata"', function() {
    const emailCsvFilePath = 'db/data/email-list-example.csv';
    const actualEmailList = parseCsvEmailFile(emailCsvFilePath);

    const expectedEmailListItem1 = {
      email: '',
      englishName: 'Amy TEST',
      chineseName: '陳歌潔',
      isMetaData: false
    };

    const expectedLastEmailListItem = {
      email: '',
      englishName: '',
      chineseName: '黃盛玲',
      isMetaData: false
    };

    expect(actualEmailList[0].email).to.eq(expectedEmailListItem1.email);
    expect(actualEmailList[0].englishName).to.eq(
      expectedEmailListItem1.englishName
    );
    expect(actualEmailList[0].chineseName).to.eq(
      expectedEmailListItem1.chineseName
    );

    const lastItemIndex = actualEmailList.length - 1;
    expect(actualEmailList[lastItemIndex].email).to.eq(
      expectedLastEmailListItem.email
    );
    expect(actualEmailList[lastItemIndex].englishName).to.eq(
      expectedLastEmailListItem.englishName
    );
    expect(actualEmailList[lastItemIndex].chineseName).to.eq(
      expectedLastEmailListItem.chineseName
    );
  });

  it('validates metadata rows correctly (The metadata row uses "email" column to describe the row item)', function() {
    const emails = [
      {
        email: '_event',
        englishName: 'Christmas',
        chineseName: '聖誕聯合崇拜',
        isMetaData: true
      },
      {
        email: '_event',
        englishName: '',
        chineseName: '聯合崇拜',
        isMetaData: true
      },
      {
        email: '',
        englishName: 'Amy Chen',
        chineseName: '陳詠潔',
        isMetaData: false
      },
      {
        email: 'becky_wq@hotmail.com',
        englishName: 'Becky Wang',
        chineseName: '王琦',
        isMetaData: false
      },
      {
        email: '',
        englishName: '',
        chineseName: '呂怡芳',
        isMetaData: false
      },
      {
        email: '',
        englishName: 'Ted',
        chineseName: '',
        isMetaData: false
      }
    ];
    const expectedNumberOfMetadataItems = 2;
    const isMetadata = emails.map(email =>
      EmailListItem.isCsvMetaData(
        email.email,
        email.englishName,
        email.chineseName
      )
    );

    expect(isMetadata[0]).to.eq(true);
    expect(isMetadata[1]).to.eq(true);
    expect(isMetadata[2]).to.eq(false);
    expect(isMetadata[3]).to.eq(false);
    expect(isMetadata[4]).to.eq(false);
  });
  it('validate email format correctly', function() {
    const emails = [
      {
        email: '_event'
      },
      {
        email: ''
      },
      {
        email: 'becky_wq@hotmail.com'
      },
      {
        email: ' ian.yin777@gmail.com '
      }
    ];

    const actualvalidation = emails.map(email =>
      EmailListItem.isValidEmail(email.email)
    );

    expect(actualvalidation[0]).to.eq(false);
    expect(actualvalidation[1]).to.eq(false);
    expect(actualvalidation[2]).to.eq(true);
    expect(actualvalidation[3]).to.eq(true);
  });

  it('converts the email list as per template', function() {
    const expectedEmailListString = 'Becky Wang<becksafdsy_wq@abc.com>,';
    const actualEmailListString = getEmailListString();

    expect(actualEmailListString).to.contain(expectedEmailListString);
  });
  it('converts the email list as per template', function() {
    const expectedEmailListString =
      'Amy TEST,Raymond Tsang,Rev. Kian Holik,Yvonne Lu,Ted,劉富理,張明俊,Riley Hsu,王洪賢,章婕,Grace Chuang,黃盛玲';
    const actualEmailListString = getEmptyEmailListString();

    expect(actualEmailListString).to.contain(expectedEmailListString);
  });
  it('filters out the positions on the blacklist', function() {
    const positions = [
      { position: '翻譯', volunteerName: '楊毓瑩' },
      { position: '吉他鼓', volunteerName: '徐慧真/陳詠潔' },
      { position: '週報', volunteerName: '陳柔諭' }
    ];
    const blacklist = ['吉他鼓', '週報'];
    const expectedPositions = [{ position: '翻譯', volunteerName: '楊毓瑩' }];
    const actualPositions = filterPositions(positions, blacklist);
    expect(actualPositions).to.deep.equal(expectedPositions);
  });
});
