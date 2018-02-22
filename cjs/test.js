'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RES = require('./contracts/RES');

var ACCOUNT_ADDRESS = '0xf17f52151ebef6c7334fad080c5704d77216b732';
var ACCOUNT_PASSWORD = 'fake_password';
var ACCOUNT_PRIVATE_KEY = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';

var availabilityTest = {
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

(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var RESContract, test2, btuCount;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return RES;

                    case 2:
                        RESContract = _context.sent;
                        _context.next = 5;
                        return RESContract.listOffers(ACCOUNT_ADDRESS, "string_criteria");

                    case 5:
                        test2 = _context.sent;

                        console.log({ test2: test2 });
                        _context.next = 9;
                        return RESContract.getTotalBTU();

                    case 9:
                        btuCount = _context.sent;

                        console.log({ btuCount: btuCount });

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function main() {
        return _ref.apply(this, arguments);
    }

    return main;
})()();