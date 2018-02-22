const migrations = artifacts.require('./Migrations.sol');

module.exports = (deployer) => {
  deployer.deploy(migrations);
};
