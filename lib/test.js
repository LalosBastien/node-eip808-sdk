const RES = require('./contracts/RES');

const ACCOUNT_ADDRESS = '0x5dee2d004e20789661988c8dc32b3161b1c1ee00';
const ACCOUNT_PASSWORD = 'fake_password';
const ACCOUNT_PRIVATE_KEY = '2d915de16e273ad7d75172f93ddb4f59d5fddb7502ac630c0cd49d82678da91c';

const availabilityTest = {
    _resourceId: 11,
    _type: 1,
    _minDeposit: 1111,
    _commission: 111,
    _freeCancelDateTs: 1119811111,
    _startDateTs: 1110311111,
    _endDateTs: 1110809111,
    _quantity: 1,
    _metaDataLink: "111111111111111",
    _signature: "0",
    _messageHash: "0"
};


(async function main() {
    const RESContract = await RES;

    const test = await RESContract.publishOffer(availabilityTest, ACCOUNT_ADDRESS, ACCOUNT_PRIVATE_KEY);
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");
    console.log({test2});
})();
