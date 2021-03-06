const fs             = require('fs');
const web3           = require('./../utils/web3Conf');
const Contract       = require('./../contractFactory');
const ethereumjs     = require('ethereumjs-abi');

const BTU_CONTRACT_ADDRESS = fs.existsSync('../dynamicADDR.js')
	  ? require('../dynamicADDR.js').BTU
	  : process.env.BTU_CONTRACT_ADDRESS || '0x98d9f9e8debd4a632682ba207670d2a5acd3c489';

const BTU_ABI = require('../ABI/BTU.json').abi;


/* BTU Contract */
const BTU = (function() {
    let contract = null;

    const methods = {
	async totalSupply() {
	    return await contract.methods.totalSupply().call();
	},

	async getBalanceOf(address) {
	    return await contract.methods.balanceOf(address).call();
	},

	async approve(_spender, _value, client) {
	    return await contract.methods.approve(client, _value).send({
		from: _spender,
		gas: 45000
	    });
	},

	async allowance(owner, spender) {
	    return await contract.methods.allowance(owner, spender).call();
	}
    };

    /*
     * Retrieve the contract with address and ABI, and then apply custom methods to communicate with the contract
     */

    return new Promise((resolve, reject) => {
        new Contract()
            .withAddress(BTU_CONTRACT_ADDRESS)
            .withABI(BTU_ABI)
            .then(_contract => {
                contract = _contract;
                return resolve(methods); // expose methods when contract is ready
            });
    });
})();

module.exports = BTU;
