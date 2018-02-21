const web3           = require('./../utils/web3Conf');
const validator      = require('./../utils/validation');
const Contract       = require('./../contract');

/* RES Contract */

const RES = (function() {
    const CONTRACT_ADDRESS = '0xe2b8acbd0317b88d05ed72cef50c7c5edaa8a461';
    const ABI_FILE_PATH = `${process.cwd()}/../build/contracts/RES.json`;

    let contract = null;

    const methods = {
	async publishOffer(accountAddress, availabilityObject) {
	    const check = validator.availability(availabilityObject);
	    if (check.error) {
		console.error(check.error);
		throw check.error;
	    }
	    if (!web3.utils.isAddress(accountAddress))
		throw new Error(`Invalid account address :  ${accountAddress}`);



	    const adaptList = Object.keys(availabilityObject)
		      .sort((key1, key2) => key1 > key2)
		      .map(key => availabilityObject[key]);

	    /* TEST */
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

	    const keyArr = [ "_type",
			     "_minDeposit",
			     "_commission",
			     "_freeCancelDateTs",
			     "_startDateTs",
			     "_endDateTs",
			     "_quantity",
			     "_metaDataLink",
			     "_resourceId" ].sort((a, b) => a > b);

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


module.exports = RES;
