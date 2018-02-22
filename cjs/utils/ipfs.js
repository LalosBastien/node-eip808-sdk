'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipfsAPI = require('ipfs-api');

var Ipfs = function () {
  function Ipfs(ip, port, _this) {
    (0, _classCallCheck3.default)(this, Ipfs);

    this._this = _this;
    this.ipfsApi = ipfsAPI(ip || 'localhost', port || '5001');
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.arrayBufferToString = this.arrayBufferToString.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  (0, _createClass3.default)(Ipfs, [{
    key: 'captureFile',
    value: function captureFile(event) {
      var _this2 = this;

      event.stopPropagation();
      event.preventDefault();
      var file = event.target.files[0];
      var reader = new window.FileReader();
      reader.onloadend = function () {
        return _this2.saveToIpfs(reader);
      };
      reader.readAsArrayBuffer(file);
    }
  }, {
    key: 'saveToIpfs',
    value: function saveToIpfs(reader) {
      var _this3 = this;

      var ipfsId = void 0;
      var buffer = Buffer.from(reader.result);
      this.ipfsApi.add(buffer, { progress: function progress(prog) {
          return console.log('received: ' + prog);
        } }).then(function (response) {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        _this3._this.setState({ added_file_hash: ipfsId });
      }).catch(function (err) {
        console.error(err);
      });
    }
  }, {
    key: 'arrayBufferToString',
    value: function arrayBufferToString(arrayBuffer) {
      return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer));
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
    }
  }]);
  return Ipfs;
}();
// render () {
//   return (
//     <div>
//       <form id='captureMedia' onSubmit={this.handleSubmit}>
//         <input type='file' onChange={this.captureFile} />
//       </form>
//       <div>
//         <a target='_blank'
//           href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
//           {this.state.added_file_hash}
//         </a>
//       </div>
//     </div>
//   )
// }

module.exports = Ipfs;