

module.exports = {
    web3:        require('./utils/web3Conf'),
    Contract:    require('./contractFactory'),
    RES:         require('./contracts/RES'),
    accountList: require('./utils/accountList'),
    ipfs:        require('./utils/ipfs'),
    RESABI:      require('./../ressources/build/contracts/RES.json')
};
