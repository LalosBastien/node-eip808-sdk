const web3 = require('./web3Conf');

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

module.exports = getAccountList;
