const Web3           = require('web3');
const web3           = new Web3();
const HTTP_PROVIDER  = process.env.HTTP_PROVIDER || 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(HTTP_PROVIDER));

module.exports = web3;
