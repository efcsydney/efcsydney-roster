
const csvEmailHeaders = {
  email: 'email (primary)',
  englishName: 'name (english)',
  chineseName: 'name (chinese)'
}

class EmailListItem {
  constructor(csvItem){
    this.email = csvItem[csvEmailHeaders.email] || '';
    this.englishName = csvItem[csvEmailHeaders.englishName] || '';
    this.chineseName = csvItem[csvEmailHeaders.chineseName] || '';
    this.isMetaData = EmailListItem.isCsvMetaData(this.email, this.englishName, this.chineseName);
  }

  static isCsvMetaData(email, englishName, chineseName) {
    if(email.trim().length > 0 && !EmailListItem.isValidEmail(email)) {
      return true;
    }

    if(EmailListItem.isEmpty(englishName) && EmailListItem.isEmpty(chineseName)){
      return true;
    }

    return false;
  }

  static isValidEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email.trim().toLowerCase());
  }

  static isEmpty(stringValue){
    if(!stringValue){
      return true;
    }
    return (stringValue.length === 0 || !stringValue.trim());
  }
}

module.exports = {
  EmailListItem
}
