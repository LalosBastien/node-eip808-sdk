const childProcess = require('child_process');
const exec = childProcess.exec;
const contractList = ["RES", "BTU"];

exec("cd ressources/ && truffle migrate", (err, stdout, stderr) => {
    stdout
	.split('\n')
	.filter(line => contractList.some(contract => line.includes(`${contract}:`)))
	.reduce((acc, str) => {
	    const item = str.trim().split(':');

	    acc[item[0]] = item[1];
	    return acc;
	}, {});
});
