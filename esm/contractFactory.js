const fs             = require('fs');
const web3           = require('./utils/web3Conf');

/*
 * This Contract Factory allows you to easely instantiate web3 contracts on the fly :
 *         new Contract()
 *           .withAddress(CONTRACT_ADDRESS)
 *           .withABI(ABI_FILE_PATH || ABI_JSON)
 *           .then(YOU_GOT_YOUR_CONTRACT => // deal with it)
 */

const Contract = (function() {

    /*  == PRIVATE ==  */

    const getABIFomFile = ABIFilePath => {
	console.log("getABIFomFile : ");
        // try {
	//     var buildFile = fs.readFileSync(ABIFilePath);
        // } catch (e) {
	//     throw new Error(`No ABI found at  ${ABIFilePath}`);
        // }

        // return JSON.parse(buildFile).abi;

	const json = require(ABIFilePath);
	console.log(json);

	return json;
    };

    const buildContract   = function() {
        const [address, ABI] = [this.address, this.ABI];

        return new Promise((resolve, reject) =>
                           web3.eth.getCode(address)
                           .then(res =>  res == "0x0"
                                 ? reject(new Error(`Incorrect Contract Address : there is no smart contract at the following address : ${address}`))
                                 : resolve(new web3.eth.Contract(ABI, address)))
                          );
    };

    const isContractReady = function() {
        return [this.address, this.ABI].every(field => null !== field);
    };


    /*  == PUBLIC ==  */

    function Contract() {
        this.address = null;
        this.ABI = null;

        return this;
    };

    Contract.prototype.withAddress = function(address) {
        this.address = address;

        return isContractReady.call(this)
	    ? buildContract.call(this)
	    : this;
    };

    Contract.prototype.withABI = function(ABI) {
        this.ABI = Array.isArray(ABI)
            ? ABI
            : getABIFomFile(ABI);

        return isContractReady.call(this)
	    ? buildContract.call(this)
	    : this;
    };

    return Contract;
})();

module.exports = Contract;
