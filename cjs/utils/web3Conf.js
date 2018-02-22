'use strict';

var Web3 = require('web3');
var web3 = new Web3();
var HTTP_PROVIDER = process.env.HTTP_PROVIDER || 'http://localhost:9545';

web3.setProvider(new Web3.providers.HttpProvider(HTTP_PROVIDER));

module.exports = web3;