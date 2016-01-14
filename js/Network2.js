import Peer from 'peerjs'
import UUID from 'uuid-js'

export default class Network {
  static host = "10.16.168.102";
  static port = 9000;

  constructor(userID) {
    this.checkIfOnline = setInterval(this.waitForConnection.bind(this), 1000);

    this.uuid = UUID.create().toString();
    console.log("My id:")
    console.log(this.uuid)
    this.peer = new Peer(this.uuid, {
      host: Network.host, 
      port: Network.port, 
      path: '/'
    })
    this.connectedPeers = {}
    window.c = this.connectedPeers
    this.methods = {}

    this.peer.on('connection', this.initConnection)

    window.onunload = window.onbeforeunload = function(e) {
      if (this.peer && !this.peer.destroyed) {
        peer.destroy()
      }
    }
  }
  
  /**
   * Connect to peers
   */
  join() {
    this.peer.listAllPeers((peers) => {
      peers.forEach((peer) => {
        if (peer != this.peer.id)
          this.connectToPeer(peer);
      })
    })

  }

  isOnline() {
    if(!this.peer.disconnected || navigator.onLine) {
      var counter = 0;
      for (var key in this.connectedPeers) {
        counter++;
      }
      console.log("Amount of connected peers: " + counter);
      if (counter > 0) {
        console.log("You are currently online");
        return true;
      }
    }
    console.log("You are currently offline");
    return false;
  }

  waitForConnection() {
    console.log("Come right on in!")
    if(this.isOnline()) {
      console.log("Hello there!")
      clearInterval(this.checkIfOnline);
    }
  }

  connectToPeer(peer) {
    let conn = this.peer.connect(peer, {
      serialization: 'json'
    })
    this.initConnection(conn)
  }

  initConnection = (conn) => {
      this.saveConnection(conn)

      conn.on('data', (data) => {
        console.log(data)
        this.callMethod(data.method, data.data)
      })

      conn.on('close', () => {
          delete this.connectedPeers[conn.peer]
      })
  };

  saveConnection(conn) {
    this.connectedPeers[conn.peer] = conn
  }

  createMethod(methodName, func) {
    this.methods[methodName] = func
  }

  requestMethodCall(methodName, data) {
    console.log("---- sending ----")
    for (let id in this.connectedPeers) {
      if (this.connectedPeers.hasOwnProperty(id)) {
        console.log(id)
        console.log(methodName)
        console.log(data)
        this.connectedPeers[id].send({method: methodName, data: data})
      }
    }
    console.log("-- done sending --")
  }

  callMethod(methodName, data) {
    const method = this.methods[methodName]
    if (method)
      method(data)
  }
}
