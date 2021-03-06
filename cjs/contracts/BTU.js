'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var web3 = require('./../utils/web3Conf');
var Contract = require('./../contractFactory');
var ethereumjs = require('ethereumjs-abi');

var BTU_CONTRACT_ADDRESS = fs.existsSync('../dynamicADDR.js') ? require('../dynamicADDR.js').BTU : process.env.BTU_CONTRACT_ADDRESS || '0x98d9f9e8debd4a632682ba207670d2a5acd3c489';

var BTU_ABI = require('../ABI/BTU.json').abi;

/* BTU Contract */
var BTU = function () {
    var contract = null;

    var methods = {
        totalSupply: function totalSupply() {
            var _this = this;

            return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return contract.methods.totalSupply().call();

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }))();
        },
        getBalanceOf: function getBalanceOf(address) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return contract.methods.balanceOf(address).call();

                            case 2:
                                return _context2.abrupt('return', _context2.sent);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2);
            }))();
        }
    };

    /*
     * Retrieve the contract with address and ABI, and then apply custom methods to communicate with the contract
     */

    return new Promise(function (resolve, reject) {
        new Contract().withAddress(BTU_CONTRACT_ADDRESS).withABI(BTU_ABI).then(function (_contract) {
            contract = _contract;
            return resolve(methods); // expose methods when contract is ready
        });
    });
}();

module.exports = BTU;