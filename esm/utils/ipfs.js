const ipfsAPI = require('ipfs-api')
const fs = require('fs');

class Ipfs {
  constructor(ip, port, callbackImage, callbackData) {
    // this._this = _this
    this.ipfsApi = ipfsAPI((ip || 'localhost'), (port || '5001'))
    this.captureFile = this.captureFile.bind(this)
    this.saveJSONtoIpfs = this.saveJSONtoIpfs.bind(this)
    this.saveFileToIpfs = this.saveFileToIpfs.bind(this)
    this.arrayBufferToString = this.arrayBufferToString.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.callbackImage = callbackImage;
    this.callbackData = callbackData;
  }

  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => this.saveFileToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  saveFileToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer, { /*progress: (prog) => console.log(`received: ${prog}`) */})
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      console.log(ipfsId)
      this.callbackImage(ipfsId)
      // this._this.setState({added_file_hash: ipfsId})
    }).catch((err) => {
      console.error(err)
    })
  }

  saveJSONtoIpfs (json) {
    let ipfsId
    const save = JSON.stringify(json)
    console.log(save);
    const buffer = Buffer.from(save);
    console.log(buffer);
    this.ipfsApi.add(buffer, { /*progress: (prog) => console.log(`received: ${prog}`) */})
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      this.callbackData(ipfsId);
      // this._this.setState({added_file_hash: ipfsId})
      console.log("SAVING JSON : ", ipfsId)
    }).catch((err) => {
      console.error("ERROR : ", err)
    })
  }

  arrayBufferToString (arrayBuffer) {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer))
  }

  handleSubmit (event) {
    event.preventDefault()
  }


}
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
