var should = require('should');
var init = require('../lib/index');

describe('with an empty array argument', function() {
    it('calls the callback with an empty array', function(done) {
        var result = init([], function(result) {
            result.should.eql([]);
            done();
        });
    });
});

describe('with a single element array', function() {
    it('calls the callback with a single element array', function(done) {
        var result = init([1], function(result) {
            result.should.eql([1]);
            done();
        });
    });
});

describe('with an unsorted two element array', function() {
    it('calls the callback with a sorted two element array', function(done) {
        var result = init([2, 1], function(result) {
            result.should.eql([1, 2]);
            done();
        });
    });
});
