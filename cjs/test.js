'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RES = require('./contracts/RES');

var ACCOUNT_ADDRESS = '0xf17f52151ebef6c7334fad080c5704d77216b732';
var ACCOUNT_PASSWORD = 'fake_password';
var ACCOUNT_PRIVATE_KEY = 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';

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
        var RESContract, test, test2, reqReservations, reservations;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return RES;

                    case 2:
                        RESContract = _context.sent;
                        _context.next = 5;
                        return RESContract.publishOffer(availabilityTest, ACCOUNT_ADDRESS, ACCOUNT_PRIVATE_KEY);

                    case 5:
                        test = _context.sent;

                        console.log({ test: test });
                        _context.next = 9;
                        return RESContract.listOffers(ACCOUNT_ADDRESS);

                    case 9:
                        test2 = _context.sent;

                        console.log({ test2: test2 });

                        // const btuCount = await RESContract.getTotalBTU();
                        // console.log({btuCount});

                        _context.next = 13;
                        return RESContract.requestReservation(0, ACCOUNT_ADDRESS);

                    case 13:
                        reqReservations = _context.sent;

                        console.log({ reqReservations: reqReservations });

                        _context.next = 17;
                        return RESContract.listReservations();

                    case 17:
                        reservations = _context.sent;

                        console.log({ reservations: reservations });

                    case 19:
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