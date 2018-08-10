class ValidationError extends Error {
  constructor(validationResult) {
    super(validationResult.toString());
    this.errors = validationResult.errors;
  }
}

module.exports = ValidationError;
