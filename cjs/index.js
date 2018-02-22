'use strict';

module.exports = {
    web3: require('./utils/web3Conf'),
    Contract: require('./contractFactory'),
    RES: require('./contracts/RES'),
    accountList: require('./utils/accountList'),
    ipfs: require('./utils/ipfs'),
    resABI: require('./RES.json').abi
};
