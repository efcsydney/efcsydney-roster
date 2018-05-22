module.exports = {
  up: async queryInterface => {
    await queryInterface.removeConstraint('positions', 'name_serviceId');
  },

  down: async queryInterface => {
    await queryInterface.addConstraint('positions', ['name', 'serviceId'], {
      type: 'unique',
      name: 'name_serviceId'
    });
  }
};
