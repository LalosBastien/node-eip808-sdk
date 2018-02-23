const RES = require('./contracts/RES');

const ACCOUNT_ADDRESS = '0xf17f52151ebef6c7334fad080c5704d77216b732';
const ACCOUNT_PASSWORD = 'fake_password';
const ACCOUNT_PRIVATE_KEY = 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';

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
    console.log({test});
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS);
    console.log({test2});

    // const btuCount = await RESContract.getTotalBTU();
    // console.log({btuCount});

    const reqReservations = await RESContract.requestReservation(1, ACCOUNT_ADDRESS);
    console.log({reqReservations});

    // const reservations = await RESContract.listReservations();
    // console.log({reservations});

})();
