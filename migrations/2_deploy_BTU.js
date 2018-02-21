const token = artifacts.require('./BTU.sol');

module.exports = (deployer) => {
deployer.deploy(token, 42000000, 'Booking Token Unit', 3, 'BTU');
};
