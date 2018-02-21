const RES = require('./contracts/RES');
const ACCOUNT_ADDRESS = '0x2640b89874a9c444c23115babe4f0ec68cd8303e';
const ACCOUNT_PRIVATE_KEY = 'b1ab7758a18da62149c08e8362bd6bb4de0190a9a27ad475fed9c65d206c5170';

const availabilityTest = {
    	_resourceId: 77,
	_type: 7,
    	_minDeposit: 7777,
    	_commission: 777,
    	_freeCancelDateTs: 1719877777,
    	_startDateTs: 1720377777,
    	_endDateTs: 1720809777,
	_quantity: 7,
    	_metaDataLink: "777777777777777"
};




(async function main() {
    const RESContract = await RES;

    const test = await RESContract.publishOffer(ACCOUNT_ADDRESS, availabilityTest);
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");
    console.log({test});
    console.log({test2});
})();
