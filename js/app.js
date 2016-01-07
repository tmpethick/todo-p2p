
var peer = new Peer('someid', {host: 'localhost', port: 9000, path: '/'});

peer.listAllPeers(function(peers) {
  console.log(peers);
})