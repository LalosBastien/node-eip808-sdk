const factory = artifacts.require('./BTUFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(factory);
};
