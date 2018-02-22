const RES = require('./contracts/RES');

const ACCOUNT_ADDRESS = '0x5dee2d004e20789661988c8dc32b3161b1c1ee00';
const ACCOUNT_PASSWORD = 'fake_password';
const ACCOUNT_PRIVATE_KEY = '2d915de16e273ad7d75172f93ddb4f59d5fddb7502ac630c0cd49d82678da91c';

const availabilityTest = {
    _resourceId: 66,
    _type: 6,
    _minDeposit: 6666,
    _commission: 666,
    _freeCancelDateTs: 1619866666,
    _startDateTs: 1660366666,
    _endDateTs: 1660809666,
    _quantity: 6,
    _metaDataLink: "666666666666666",
    _signature: "000"
};


(async function main() {
    const RESContract = await RES;

    const test = await RESContract.publishOffer(availabilityTest, ACCOUNT_ADDRESS, ACCOUNT_PRIVATE_KEY);
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");
    console.log({test2});
})();
