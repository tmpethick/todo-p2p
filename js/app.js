import {test} from "./utils";
import UUID from 'uuid-js';

var uuid4 = UUID.create();

var peer = new Peer(uuid4.toString(), {host: 'localhost', port: 9000, path: '/'});

peer.listAllPeers(function(peers) {
  console.log(peers);
});
