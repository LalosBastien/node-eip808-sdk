const token = artifacts.require('./BTU.sol');

module.exports = (deployer) => {
deployer.deploy(token, 10000, 'Booking Token Unit', 3, 'BTU');
};
