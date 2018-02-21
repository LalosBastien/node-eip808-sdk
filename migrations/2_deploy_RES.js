const res = artifacts.require('./RES.sol');

module.exports = (deployer) => {
    deployer.deploy(res, {gas: 4500000});
};
