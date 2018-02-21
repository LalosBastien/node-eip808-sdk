const Web3           = require('web3');
const fs             = require('fs');
const solc           = require('solc');
const abi            = require('ethereumjs-abi');
const util           = require('ethereumjs-util');
const Tx             = require('ethereumjs-tx');
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


/* RES */


/*
 * Validate the availibility object
 */
const validateAvailabilityObject = availabilityObject => {
    const objectSchema = Joi.object().keys({
	_ownerAddress: Joi.string(),
    	_resourceId: Joi.number().integer().min(0),
	_type: Joi.number().integer().min(0),
    	_minDeposit: Joi.number().integer().min(0),
    	_commission: Joi.number().integer().min(0),
    	_freeCancelDateTs: Joi.number().integer().min(0),
    	_startDateTs: Joi.number().integer().min(0),
    	_endDateTs: Joi.number().integer().min(0),
	_quantity: Joi.number().integer().min(0),
    	_metaDataLink: Joi.string()
    });
    const joiValidation = Joi.validate(availabilityObject, objectSchema);

    if (!web3.utils.isAddress(availabilityObject._ownerAddress))
	joiValidation.error = {...joiValidation.error, addressError: "Invalid owner address (_ownerAddress)"};

    return joiValidation;
};

const RES = (function() {
    const CONTRACT_ADDRESS = '0x401d8f290b5f05711cf277dc31baa1afcb271bde';
    const ABI_FILE_PATH = `${process.cwd()}/build/contracts/RES.json`;

    let contract = null;

    const methods = {
	async publishOffer(accountAddress, availabilityObject) {
	    const validateAvailability = validateAvailabilityObject(availabilityObject);
	    if (validateAvailability.error)
		throw validateAvailability.error;
	    if (!web3.utils.isAddress(accountAddress))
		throw new Error(`Invalid account address :  ${accountAddress}`);

	    const adaptList = Object.keys(availabilityObject)
		      .sort((key1, key2) => key1 > key2)
		      .map(key => availabilityObject[key]);

	    /* TEST */
	    const res = await contract.methods.publishAvailabilities(...adaptList).send({
		from: accountAddress,
		gas: 4500000
	    });

	    return res;
	},

	async listOffers(requesterAddress, criterias) {
	    const res = await contract.methods.ListAvailabilities(// requesterAddress, criterias
								 ).call();

	    return res;
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
                return resolve(methods); // expose methods when contract is ready
            });
    });
})();


const ACCOUNT_ADDRESS = '0x50077E8E46d1a1fe84aE88b706c4134aDFae93D0';
const ACCOUNT_PRIVATE_KEY = 'e72e7951f4cb494aca9d6e3ce50b3dd740d6798415b1b6e9fa9a419c9110b7be';

const availabilityTest = {
	_ownerAddress: '0x50077E8E46d1a1fe84aE88b706c4134aDFae93D0',
    	_resourceId: 4242,
	_type: 1,
    	_minDeposit: 30000,
    	_commission: 30,
    	_freeCancelDateTs: 1519858800,
    	_startDateTs: 1520377200,
    	_endDateTs: 1520809200,
	_quantity: 1,
    	_metaDataLink: "https://metrouk2.files.wordpress.com/2017/07/187144066.jpg?w=748&h=498&crop=1"
};

const getAccountList = async () => {
    const data = await Promise.all(
	(await web3.eth.getAccounts())
	    .map(async (address) => ({
		address,
		balance: (await web3.eth.getBalance(address))
	    }))
    );

    return data.map(account => ({
	...account,
	money: `${web3.utils.fromWei(account.balance)} ETH`
    }));
};



(async function main() {
    console.log(await getAccountList());
    const RESContract = await RES;

    const test = await RESContract.publishOffer(ACCOUNT_ADDRESS, availabilityTest);
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");

    console.log({test});
    console.log({test2});
})();
