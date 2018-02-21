# node-eip808-sdk
Npm module that allow request on the Ethereum BlockChain with BTU protocol (EIP808)


## Ganache generated accounts

Just start `ganache-cli`

## Create and Deploy a smart contract

- Create the contract and put it in `contracts/`
- Create a migration file for the contract : [see how to do that](http://truffleframework.com/docs/getting_started/migrations#migration-files)
- Compile all the contracts by running `truffle compile`
- Deploy the contracts by running `truffle migrate`

### Some issues you might encounter

- You need to init truffle (it creates conf files) or your truffle commands won't work

- Contracts files must be named after the contract's name. [Link](https://github.com/numerai/contract/issues/15#issuecomment-326480631)

- `truffle.js` must be configured to use a specific network, in our case `localhost:8545`, otherwise you wil get the following error :

```
Error: No network specified. Cannot determine current network.
    at Object.detect (/usr/local/lib/node_modules/truffle/build/webpack:/~/truffle-core/lib/environment.js:31:1)
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/truffle-core/lib/commands/migrate.js:91:1
    at finished (/usr/local/lib/node_modules/truffle/build/webpack:/~/truffle-workflow-compile/index.js:53:1)
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/truffle-compile/index.js:301:1
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/truffle-compile/profiler.js:157:1
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/async/dist/async.js:3874:1
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/async/dist/async.js:473:1
    at replenish (/usr/local/lib/node_modules/truffle/build/webpack:/~/async/dist/async.js:993:1)
    at iterateeCallback (/usr/local/lib/node_modules/truffle/build/webpack:/~/async/dist/async.js:983:1)
    at /usr/local/lib/node_modules/truffle/build/webpack:/~/async/dist/async.js:958:1
```
