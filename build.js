const fs           = require('fs');
const cp           = require('child_process');
const exec         = cp.exec;
const contractList = ["RES", "BTU"];


/*
 * Removing all the previously generated content
 */
const clean = () => new Promise((resolve, reject) => {
    exec("rm -rf cjs/* && rm -rf esm/ABI/* && rm -rf esm/dynamicADDR.js && rm -rf ressources/build/", (err, stdout, stderr) => {
	console.log("Cleaning up generated content ... ");
	return err
	    ? reject(err)
	    : resolve("done");
    });
});

/*
 * exec `truffle compile` to get ABIs from Solidity files
 */
const compile = () => new Promise((resolve, reject) => {
    exec("cd ressources && ./../node_modules/.bin/truffle compile && cd ..", (err, stdout, stderr) => {
	console.log("Compiling ... ");
	return err
	    ? reject(err)
	    : resolve("done");
    });
});

/*
 * move ABIs inside of the module
 */
const exportABIs = () => new Promise((resolve, reject) => {
    exec("cp -r ressources/build/contracts/* esm/ABI/", (err, stdout, stderr) => {
	console.log("Exporting ABIs ... ");
	return err
	    ? reject(err)
	    : resolve("done");
    });
});

/*
 * use babel to transpile ES6+ to JS
 */
const transpile = () => new Promise((resolve, reject) => {
    exec("babel esm --out-dir cjs && cp -r esm/ABI cjs/", (err, stdout, stderr) => {
	console.log("Transpiling from esm/ to cjs/ ... ");
	return err
	    ? reject(err)
	    : resolve("done");
    });
});


/*
 * exec `truffle migrate` and get the addresses of the smart-contracts
 */
const migrate = () => new Promise((resolve, reject) => {
    exec("cd ressources/ && truffle migrate", (err, stdout, stderr) => {
	const addresses = parseDynamicADDR(stdout);
	const code = `module.exports = ${JSON.stringify(addresses)};\n`;

	fs.writeFile("esm/dynamicADDR.js", code, (err) => {
	    console.log("Generating esm/dynamicADDR.js");
	    return err
		? reject(err)
		: resolve("done");
	});
    });
});

// const replaceBTUAddress = (RESfilePath, newBTUAddress) => new Promise((resolve, reject) => {
//     exec(`sed -i 's/address BTUAddress \=.*/address BTUAddress = ${newBTUAddress};/' ${RESfilePath}`, (err, stdout, stderr) => {
// 	console.log('Replacing BTUAddress in RES.col ... ');
// 	    return err
// 		? reject(err)
// 		: resolve("done");
//     });
// });


function truffleDevelop() {
    return new Promise(function(resolve, reject) {
	let state = {};
	const develop = cp.spawn('truffle', ['develop'], {
	    cwd: process.cwd() + '/ressources',
	    detached: true
	});

	develop.stdout.on('data', _data => {
	    const data = _data.toString();
	    const BTUFound = data.includes("0x") && data.match(/\'0x[a-z0-9]+\'/g);
	    const accountsFound = data.includes('Accounts:') && data.includes('Private Keys:');
	    const BTUSearched = data.includes('BTU');
	    const existingSession = data.includes('existing Truffle Develop session');
	    if (BTUFound) {
		const BTURegex = /\'(0x[a-z0-9]+)\'/g;
		state = {...state, BTUFound: BTURegex.exec(data)[1]};
	    } if (accountsFound) {
		state = {...state, accounts: parseCreatedAccounts(data)};
	    } if (BTUSearched || existingSession || BTUFound) {
		develop.stdin.write('MAGMA-MAGMA \n');
	    } if (data.includes('MAGMA') || BTUFound || state.BTUFound) {
		resolve({
		    ...state,
		    getStd() { return {stdin: develop.stdin, stdout: develop.stdout}; }
		});
	    }
	});

	develop.stdin.write('BTU.address\n');
	develop.on('exit', _ => {
	    console.log('.exit truffle develop.');
	});
    });
}


function truffleDeploy() {
    return new Promise((resolve, reject) => {
	let state = {};
	const cp = require('child_process');
	const deploy = cp.spawn('truffle', ['deploy'], {
	    cwd: process.cwd() + '/ressources'
	});

	deploy.stdout.on('data', _data => {
	    const data = _data.toString();
	    const parsed = parseDynamicADDR(data);
	    if (parsed !== {}) state = {...state, ...parsed};
	});
	deploy.on('exit', _ => resolve(state));
    });
};

function truffleMigrate() {
    return new Promise((resolve, reject) => {
	let state = {};
	const cp = require('child_process');
	const deploy = cp.spawn('truffle', ['migrate', '--reset'], {
	    cwd: process.cwd() + '/ressources'
	});
	deploy.stdout.on('data', _data => {
	    const data = _data.toString();
	    const parsed = parseDynamicADDR(data);
	    if (parsed !== {}) state = {...state, ...parsed};
	});
	deploy.on('exit', _ => resolve(state));
    });
}

const checkBTU = (BTUAddress, developStd) => new Promise((resolve, reject) => {
    let BTUFound;
    developStd.stdin.write('BTU.address\n');
    developStd.stdout.on('data', _data => {
	const data = _data.toString();
	if (data.includes("0x") && data.match(/\'0x[a-z0-9]+\'/g))
	    BTUFound = /\'(0x[a-z0-9]+)\'/g.exec(data)[1];
	if (data.includes('BTU'))
	    developStd.stdin.write('MAGMA-MAGMA\n');
	if (data.includes('MAGMA')) {
	    resolve({
		BTUIsCorrect: BTUAddress === BTUFound,
		closeDevelop() {
		    return developStd.stdin.end();
		}
	    });
	}
    });
});

const truffleFlow = () => new Promise((resolve, reject) => {
    let accounts = [];
    let dynamicADDR;
    let BTUAddress;
    let developStd;

    return truffleDevelop()
	.then(developRes => {
	    console.log("Truffle develop ... ");
	    if (developRes.accounts)
		accounts = [...accounts, ...developRes.accounts];
	    developStd = developRes.getStd();
	    return truffleDeploy();
	}).then(deployRes => {
	    developStd.stdin.end();
	    console.log("Truffle deploy ...");
	    dynamicADDR = {...dynamicADDR, ...deployRes};
	    return truffleDevelop();
	}).then(developRes => {
	    if (developRes.BTUFound)
		BTUAddress = developRes.BTUFound;
	    else
		reject(new Error("BTU.address Not Found !"));
	    if (developRes.accounts)
		accounts = [...accounts, ...developRes.accounts];
	    developStd = developRes.getStd();
	    return truffleMigrate();
	}).then(migrateRes => {
	    dynamicADDR = {...dynamicADDR, ...migrateRes};
	    return checkBTU(BTUAddress, developStd);
	}).then(checkBTURes => {
	    checkBTURes.closeDevelop();
	    return (checkBTURes.BTUIsCorrect)
		? resolve({accounts, dynamicADDR, BTUAddress})
	    : reject(new Error("BTU.address not valid"));
	});
});


const parseCreatedAccounts = data => {
    const lines = data.split('\n').filter(line => line.match(/\([0-9]\)\ .+/g));
    const _accounts = lines.slice(0,10);
    const _pKeys = lines.slice(10,20);
    const accounts = _accounts.reduce((acc, account, i) => acc.concat({account: account.substr(4), privateKey: _pKeys[i].substr(4)}), []);
    return accounts;
};

const parseDynamicADDR = data => data
	  .split('\n')
	  .filter(line => contractList.some(contract => line.includes(`${contract}:`)))
	  .reduce((acc, str) => {
	      const item = str.trim().split(':');

	      acc[item[0]] = item[1].substr(1);
	      return acc;
	  }, {});


clean()
    .then(compile)
    .then(exportABIs)
    .then(migrate)
    .then(transpile)
    .then(truffleFlow)
    .then(_ => {

    });
