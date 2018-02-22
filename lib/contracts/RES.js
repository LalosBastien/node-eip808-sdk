const web3           = require('./../utils/web3Conf');
const validator      = require('./../utils/validation');
const Contract       = require('./../contractFactory');
const ethereumjs     = require('ethereumjs-abi');

/*  WORK ZONE  */


const signPublish = async (privateKey, {_resourceId, _type, _minDeposit, _commission, _freeCancelDateTs, _startDateTs, _endDateTs, _quantity}) => {
    const hash = "0x" + ethereumjs.ABI.soliditySHA3(
	["uint", "uint", "uint", "uint", "uint", "uint", "uint", "uint"],
	[_resourceId, _type, _minDeposit, _commission, _freeCancelDateTs, _startDateTs, _endDateTs, _quantity]
    ).toString("hex");

    const signature = await web3.personal.sign(hash, web3.eth.defaultAccount);

    return signature;
};


/* Questions */

// Pourquoi le Provider emmet une signature avec les datas de l'availability au lieu de tout simplement renseigner son adresse ?
// Ou est stockée cette signature ? Dans le smart contract ? Dans l'availability ?
// Qu'est-ce qui empêche le Provider de modifier le contrat après l'avoir publié ? (et ré-emmetre une signature ?)
// Est-ce seulement la spec et les methodes fournies par le smart contract qui font que personne ne peut modifier certains champs ?




/* TODOs */

    // - mettre en place des restrictions (par exemple avec la fonction  require  )
    // - mettre en place la request reservation
    // - mettre en place la CANCELLATION avec les conditions automatiques ( = tout l'interet des smart contracts)
    // - mettre en place des criteria sur ListAvailabilities (p-e en front-end = off-chain bullshit)
    // - fonctionnalités easy : mettre en place les broadcast de changement de status


/* RES Contract */

const RES = (function() {
    const CONTRACT_ADDRESS = '0x5b84c7d712234b2333444ca0d205b33119522058';
    const ABI_FILE_PATH = `${process.cwd()}/../build/contracts/RES.json`;

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
		      .sort((key1, key2) => key1 > key2)
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

	    const keyArr = [ "_type",
			     "_minDeposit",
			     "_commission",
			     "_freeCancelDateTs",
			     "_startDateTs",
			     "_endDateTs",
			     "_quantity",
			     "_metaDataLink",
			     "_resourceId",
			     "_signature" ].sort((a, b) => a > b);

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
