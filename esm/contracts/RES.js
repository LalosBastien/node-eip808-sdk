const web3           = require('./../utils/web3Conf');
const validator      = require('./../utils/validation');
const Contract       = require('./../contractFactory');
const ethereumjs     = require('ethereumjs-abi');

const RES_CONTRACT_ADDRESS = process.env.RES_CONTRACT_ADDRESS
	  || '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f';
const RES_ABI_FILE_PATH = process.env.RES_ABI_FILE_PATH
	  || `${__dirname}/../../ressources/build/contracts/RES.json`;


/* RES Contract */
const RES = (function() {
    let contract = null;

    const methods = {
	async publishOffer(availabilityObject, accountAddress, accountPrivateKey) {
	    /* check for errors */
	    const check = validator.availability(availabilityObject);
	    if (check.error) {
		console.error(check.error);
		throw check.error;
	    }
	    if (!web3.utils.isAddress(accountAddress))
		throw new Error(`Invalid account address :  ${accountAddress}`);

	    /* generate signature with desired data */
	    const {_metaDataLink, ..._dataToSign} = availabilityObject;
	    const dataToSign = JSON.stringify(_dataToSign);
	    const signatureObject = await web3.eth.accounts.sign(dataToSign, accountPrivateKey);
	    const signature = signatureObject.signature;

	    availabilityObject._signature = signature;

	    /* turn availabilityObject into a list of values ordered by availabilityObject key name */
	    const adaptList = Object.keys(availabilityObject)
		      .sort((key1, key2) => key1.localeCompare(key2))
		      .map(key => availabilityObject[key]);

	    const res = await contract.methods.publishAvailability(...adaptList).send({
		from: accountAddress,
		gas: 4500000 // ?
	    });

	    return res;
	},

	async listOffers(requesterAddress, criterias) {
	    const idList = await contract.methods.ListAvailabilities().call();
	    const fullList = await Promise.all(idList.map(async(ID) => ({
		ID,
		...(await methods.readOffer(ID))
	    })));

	    const keyArr = [
		"_type",
		"_minDeposit",
		"_metaDataLink",
		"_commission",
		"_freeCancelDateTs",
		"_startDateTs",
		"_endDateTs",
		"_quantity",
		"_resourceId",
		"_messageHash",
		"_signature"
	    ].sort((a, b) => a.localeCompare(b));

	    return fullList.map(availability => {
		return Object.keys(availability).reduce((acc, key) => {
		    if (Number.isInteger(parseInt(key)))
			acc[keyArr[key]] = availability[key];
		    else
			acc[key] = availability[key];
		    return acc;
		}, {});
	    });
	},

	async readOffer(id) {
	    return await contract.methods.ReadAvailability(id).call();
	},

	async getTotalBTU() {
	    return await contract.methods.GetBTUTotalSupply().call();
	}
    };

    /*
     * Retrieve the contract with address and ABI, and then apply custom methods to communicate with the contract
     */

    return new Promise((resolve, reject) => {
        new Contract()
            .withAddress(RES_CONTRACT_ADDRESS)
        // .withABI(RES_ABI_FILE_PATH)
	    .withABI(require('./ABI/RES.json').abi)
            .then(_contract => {
                contract = _contract;
                return resolve(methods); // expose methods when contract is ready
            });
    });
})();

module.exports = RES;
