const Web3           = require('web3');
const fs             = require('fs');
const solc           = require('solc');
const abi            = require('ethereumjs-abi');
const util           = require('ethereumjs-util');
const tx             = require('ethereumjs-tx');
const lightwallet    = require('eth-lightwallet');
const Joi            = require('joi'); /* Object validation */
const txutils        = lightwallet.txutils;

const HTTP_PROVIDER = 'http://localhost:8545';
const web3 = new Web3();

web3.setProvider(new Web3.providers.HttpProvider(HTTP_PROVIDER));

const Contract = (function() {
    /*  == PRIVATE ==  */

    const getABIFomFile = ABIFilePath => {
        try {
	    var buildFile = fs.readFileSync(ABIFilePath);
        } catch (e) {
	    throw new Error(`No ABI found at  ${ABIFilePath}`);
        }

        return JSON.parse(buildFile).abi;
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





const toHex = str => str.split('').map(c => ''+c.charCodeAt(0).toString(16)).join('');
const genSignature = (address, message) => web3.eth.sign(address, '0x' + toHex(message)); // WIP

const RES = (function() {
    const CONTRACT_ADDRESS = '0x3c0be4782dc88cd472393aaa04b3ed367bd45ff4';
    const ABI_FILE_PATH = `${process.cwd()}/build/contracts/RES.json`;

    const validateAvailabilityObject = availabilityObject => {
	const objectSchema = Joi.object.keys({
	    ownerAdress: Joi.string(),
    	    resourceId: Joi.number().integer().min(0),
	    type: Joi.number().integer().min(0),
    	    minDeposit: Joi.number().integer().min(0),
    	    commission: Joi.number().integer().min(0),
    	    freeCancelDateTs: Joi.number().integer().min(0),
    	    startDateTs: Joi.number().integer().min(0),
    	    endDateTs: Joi.number().integer().min(0),
	    quantity: Joi.number().integer().min(0),
    	    metaDataLink: Joi.string()
	});
	const arraySchema = Joi.array().items(objectSchema).min(1).required();
	const joiValidation = Joi.validate(availabilityObject, arraySchema);

	if (!availabilityObject.every(obj => web3.utils.isAddress(obj._ownerAddress)))
	    joiValidation.error = {...joiValidation.error, addressError: "Invalid owner address (_ownerAddress)"};

	return joiValidation;
    };

    let contract = null;
    const methods = {
	async publishOffer(availabilityObject, accountAddress) {
	    const validateAvailability = validateAvailabilityObject(availabilityObject);
	    if (validateAvailability.error)
		throw new Error(validateAvailability.error);
	    if (!web3.utils.isAddress(accountAddress))
		throw new Error(`Invalid account address :  ${accountAddress}`);



	}
    };

    /*
     * Retrieve the contract with address and ABI, and then apply custom methods to communicate with the contract
     */

    return new Promise((resolve, reject) => {
        new Contract()
            .withAddress(CONTRACT_ADDRESS)
            .withABI(ABI_FILE_PATH)
            .then(_contract => {
                contract = _contract;
		console.log(contract.methods);
                return resolve(methods); // expose methods when contract is ready
            });
    });
})();



(async function main() {
    const RESContract = await RES;

    console.log(RESContract);
})();
