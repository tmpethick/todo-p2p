import Peer from 'peerjs';
import UUID from 'uuid-js';

export default class Network {
  constructor() {
    var uuid4 = UUID.create();
    this.peer = new Peer(uuid4.toString(), {host: 'localhost', port: 9000, path: '/'});
  }

  connectToPeers() {
    // TODO: do actually connect..
    this.peer.listAllPeers(function(peers) {
      console.log(peers);
    });
  }

}
