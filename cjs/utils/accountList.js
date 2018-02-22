'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var web3 = require('./web3Conf');

var getAccountList = function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
						var data;
						return _regenerator2.default.wrap(function _callee2$(_context2) {
									while (1) {
												switch (_context2.prev = _context2.next) {
															case 0:
																		_context2.t0 = Promise;
																		_context2.next = 3;
																		return web3.eth.getAccounts();

															case 3:
																		_context2.t1 = function () {
																					var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(address) {
																								return _regenerator2.default.wrap(function _callee$(_context) {
																											while (1) {
																														switch (_context.prev = _context.next) {
																																	case 0:
																																				_context.t0 = address;
																																				_context.next = 3;
																																				return web3.eth.getBalance(address);

																																	case 3:
																																				_context.t1 = _context.sent;
																																				return _context.abrupt('return', {
																																							address: _context.t0,
																																							balance: _context.t1
																																				});

																																	case 5:
																																	case 'end':
																																				return _context.stop();
																														}
																											}
																								}, _callee, undefined);
																					}));

																					return function (_x) {
																								return _ref2.apply(this, arguments);
																					};
																		}();

																		_context2.t2 = _context2.sent.map(_context2.t1);
																		_context2.next = 7;
																		return _context2.t0.all.call(_context2.t0, _context2.t2);

															case 7:
																		data = _context2.sent;
																		return _context2.abrupt('return', data.map(function (account) {
																					return (0, _extends3.default)({}, account, {
																								money: web3.utils.fromWei(account.balance) + ' ETH'
																					});
																		}));

															case 9:
															case 'end':
																		return _context2.stop();
												}
									}
						}, _callee2, undefined);
			}));

			return function getAccountList() {
						return _ref.apply(this, arguments);
			};
}();

module.exports = getAccountList;