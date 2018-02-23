'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var web3 = require('./../utils/web3Conf');
var validator = require('./../utils/validation');
var Contract = require('./../contractFactory');
var ethereumjs = require('ethereumjs-abi');

var RES_CONTRACT_ADDRESS = fs.existsSync('../dynamicADDR.js') ? require('../dynamicADDR.js').RES : process.env.RES_CONTRACT_ADDRESS || '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f';

var RES_ABI = require('../ABI/RES.json').abi;

/* RES Contract */
var RES = function () {
	var contract = null;

	var methods = {
		publishOffer: function publishOffer(availabilityObject, accountAddress, accountPrivateKey) {
			var _this = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
				var _contract$methods;

				var check, _metaDataLink, _dataToSign, dataToSign, signatureObject, signature, adaptList, res;

				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								/* check for errors */
								check = validator.availability(availabilityObject);

								if (!check.error) {
									_context.next = 4;
									break;
								}

								console.error(check.error);
								throw check.error;

							case 4:
								if (web3.utils.isAddress(accountAddress)) {
									_context.next = 6;
									break;
								}

								throw new Error('Invalid account address :  ' + accountAddress);

							case 6:

								/* generate signature with desired data */
								_metaDataLink = availabilityObject._metaDataLink, _dataToSign = (0, _objectWithoutProperties3.default)(availabilityObject, ['_metaDataLink']);
								dataToSign = JSON.stringify(_dataToSign);
								_context.next = 10;
								return web3.eth.accounts.sign(dataToSign, accountPrivateKey);

							case 10:
								signatureObject = _context.sent;
								signature = signatureObject.signature;


								availabilityObject._signature = signature;
								availabilityObject._messageHash = signatureObject.messageHash;

								/* turn availabilityObject into a list of values ordered by availabilityObject key name */
								adaptList = Object.keys(availabilityObject).sort(function (key1, key2) {
									return key1.localeCompare(key2);
								}).map(function (key) {
									return availabilityObject[key];
								});
								_context.next = 17;
								return (_contract$methods = contract.methods).publishAvailability.apply(_contract$methods, (0, _toConsumableArray3.default)(adaptList)).send({
									from: accountAddress,
									gas: 4500000 // ?
								});

							case 17:
								res = _context.sent;
								return _context.abrupt('return', res);

							case 19:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}))();
		},
		listOffers: function listOffers(requesterAddress, criterias) {
			var _this2 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
				var idList, fullList, keyArr;
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return contract.methods.ListAvailabilities().call();

							case 2:
								idList = _context3.sent;
								_context3.next = 5;
								return Promise.all(idList.map(function () {
									var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ID) {
										return _regenerator2.default.wrap(function _callee2$(_context2) {
											while (1) {
												switch (_context2.prev = _context2.next) {
													case 0:
														_context2.t0 = _extends3.default;
														_context2.t1 = {
															ID: ID
														};
														_context2.next = 4;
														return methods.readOffer(ID);

													case 4:
														_context2.t2 = _context2.sent;
														return _context2.abrupt('return', (0, _context2.t0)(_context2.t1, _context2.t2));

													case 6:
													case 'end':
														return _context2.stop();
												}
											}
										}, _callee2, _this2);
									}));

									return function (_x) {
										return _ref.apply(this, arguments);
									};
								}()));

							case 5:
								fullList = _context3.sent;
								keyArr = ["_type", "_minDeposit", "_metaDataLink", "_commission", "_freeCancelDateTs", "_startDateTs", "_endDateTs", "_quantity", "_resourceId", "_messageHash", "_signature"].sort(function (a, b) {
									return a.localeCompare(b);
								});
								return _context3.abrupt('return', fullList.map(function (availability) {
									return Object.keys(availability).reduce(function (acc, key) {
										if (Number.isInteger(parseInt(key))) acc[keyArr[key]] = availability[key];else acc[key] = availability[key];
										return acc;
									}, {});
								}));

							case 8:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, _this2);
			}))();
		},
		requestReservation: function requestReservation(offerID, requesterAddress) {
			var _this3 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return contract.methods.requestReservation(offerID, requesterAddress).send({
									from: requesterAddress,
									gas: 450000 // ?
								});

							case 2:
								return _context4.abrupt('return', _context4.sent);

							case 3:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, _this3);
			}))();
		},
		listReservations: function listReservations() {
			var _this4 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
				var idList, fullList, keyArr, reOrder, populateAvailability;
				return _regenerator2.default.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								_context7.next = 2;
								return contract.methods.ListReservations().call();

							case 2:
								idList = _context7.sent;
								_context7.next = 5;
								return Promise.all(idList.map(function () {
									var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ID) {
										return _regenerator2.default.wrap(function _callee5$(_context5) {
											while (1) {
												switch (_context5.prev = _context5.next) {
													case 0:
														_context5.t0 = _extends3.default;
														_context5.t1 = {
															ID: ID
														};
														_context5.next = 4;
														return methods.readReservation(ID);

													case 4:
														_context5.t2 = _context5.sent;
														return _context5.abrupt('return', (0, _context5.t0)(_context5.t1, _context5.t2));

													case 6:
													case 'end':
														return _context5.stop();
												}
											}
										}, _callee5, _this4);
									}));

									return function (_x2) {
										return _ref2.apply(this, arguments);
									};
								}()));

							case 5:
								fullList = _context7.sent;
								keyArr = ["_clientAddress", "_offerId", "_bookingStatus", "_reservationHash"].sort(function (a, b) {
									return a.localeCompare(b);
								});
								reOrder = fullList.map(function (reservation) {
									return Object.keys(reservation).reduce(function (acc, key) {
										if (Number.isInteger(parseInt(key))) acc[keyArr[key]] = reservation[key];else acc[key] = reservation[key];
										return acc;
									}, {});
								});
								_context7.next = 10;
								return Promise.all(reOrder.map(function () {
									var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(obj) {
										return _regenerator2.default.wrap(function _callee6$(_context6) {
											while (1) {
												switch (_context6.prev = _context6.next) {
													case 0:
														_context6.t0 = _extends3.default;
														_context6.t1 = {};
														_context6.t2 = obj;
														_context6.next = 5;
														return methods.readOffer(obj._offerId);

													case 5:
														_context6.t3 = _context6.sent;
														_context6.t4 = {
															_offer: _context6.t3
														};
														return _context6.abrupt('return', (0, _context6.t0)(_context6.t1, _context6.t2, _context6.t4));

													case 8:
													case 'end':
														return _context6.stop();
												}
											}
										}, _callee6, _this4);
									}));

									return function (_x3) {
										return _ref3.apply(this, arguments);
									};
								}()));

							case 10:
								populateAvailability = _context7.sent;
								return _context7.abrupt('return', populateAvailability);

							case 12:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, _this4);
			}))();
		},
		readReservation: function readReservation(id) {
			var _this5 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
				return _regenerator2.default.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								_context8.next = 2;
								return contract.methods.ReadReservation(id).call();

							case 2:
								return _context8.abrupt('return', _context8.sent);

							case 3:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, _this5);
			}))();
		},
		readOffer: function readOffer(id) {
			var _this6 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
				return _regenerator2.default.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.next = 2;
								return contract.methods.ReadAvailability(id).call();

							case 2:
								return _context9.abrupt('return', _context9.sent);

							case 3:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, _this6);
			}))();
		},
		getTotalBTU: function getTotalBTU() {
			var _this7 = this;

			return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
				return _regenerator2.default.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								_context10.next = 2;
								return contract.methods.GetBTUTotalSupply().call();

							case 2:
								return _context10.abrupt('return', _context10.sent);

							case 3:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, _this7);
			}))();
		}
	};

	/*
  * Retrieve the contract with address and ABI, and then apply custom methods to communicate with the contract
  */

	return new Promise(function (resolve, reject) {
		new Contract().withAddress(RES_CONTRACT_ADDRESS).withABI(RES_ABI).then(function (_contract) {
			contract = _contract;
			return resolve(methods); // expose methods when contract is ready
		});
	});
}();

module.exports = RES;