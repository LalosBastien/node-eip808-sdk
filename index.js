const Web3           = require('web3');
const fs             = require('fs');
const solc           = require('solc');
const abi            = require('ethereumjs-abi');
const util           = require('ethereumjs-util');
const tx             = require('ethereumjs-tx');
const lightwallet    = require('eth-lightwallet');
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

const Account = (function() {
    function Account() {


	return this;
    };

    return Account;
})();


const SimpleStorage = (function() {
    const CONTRACT_ADDRESS = '0x45e0f8fbdd277a4cafa2979d94579d87f0163165';
    const ABI_FILE_PATH = `${process.cwd()}/build/contracts/SimpleStorage.json`;

    let contract = null;

    const methods = {
        async getData() {
            return await contract.methods.get().call();
        },

        async setData(sender, data) {
            return await contract.methods.set(data).send({
                from: sender
            });
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


(async function main() {


    const storage = await SimpleStorage;

    const storageValue = await storage.getData();
    console.log({storageValue});

    const transactionResult = await storage.setData('0xe0da00ea810b7d35f0564e7dfc92fe1ced75789c', parseInt(storageValue) + 1);
    console.log({transactionResult});

    const newStorageValue = await storage.getData();
    console.log({newStorageValue});
})();
