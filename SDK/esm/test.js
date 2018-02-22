const RES = require('./contracts/RES');

const ACCOUNT_ADDRESS = '0xf17f52151ebef6c7334fad080c5704d77216b732';
const ACCOUNT_PASSWORD = 'fake_password';
const ACCOUNT_PRIVATE_KEY = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';

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

    // const test = await RESContract.publishOffer(availabilityTest, ACCOUNT_ADDRESS, ACCOUNT_PRIVATE_KEY);
    // console.log({test});
    const test2 = await RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");
    console.log({test2});
    const btuCount = await RESContract.getTotalBTU();
    console.log({btuCount});
})();
