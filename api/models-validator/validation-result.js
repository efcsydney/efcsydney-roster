class ValidatorResult {
  constructor(error) {
    this.errors = [];
    this.success = true;
    if (error) {
      this.errors.push(error);
      this.success = false;
    }
  }

  addError(error) {
    this.errors.push(error);
    this.success = false;
  }

  toString() {
    return this.errors.join(',');
  }
}

module.exports = ValidatorResult;
