const token = artifacts.require('./BTU.sol');

module.exports = (deployer) => {
  deployer.deploy(token);
};
