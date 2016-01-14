import Peer from 'peerjs'
import UUID from 'uuid-js'
import {onUnload} from './utils/onUnload.js';

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
    this.methods = {}

    this.peer.on('connection', this.initConnection)

    onUnload(e => {
      if (this.peer && !this.peer.destroyed) {
        peer.destroy()
      }
    });
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
    var amount = Object.keys(this.connectedPeers).length
    if(!this.peer.disconnected || navigator.onLine) {
      console.log("Amount of connected peers: " + amount);
      if (amount > 0) {
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
    console.log("Connecting to: ", conn.peer)
    this.saveConnection(conn)

    conn.on('data', (data) => {
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

  invokeAllPeerMethods(methodName, data) {
    console.log("---- sending ----")
    console.log("Tuple: " + data.id)
    console.log(data)

    for (let id in this.connectedPeers) {
        console.log("Reciever: " +  id)
        this.invokePeerMethod(id, methodName, data)
    }
    console.log("-- done sending --")
  }

  invokePeerMethod(peerId, methodName, data) {
    if (this.connectedPeers.hasOwnProperty(peerId)) {
      this.connectedPeers[peerId].send({method: methodName, data: data})
    }
  }

  callMethod(methodName, data) {
 
   	console.log("---- recieving ----");
  	console.log(methodName);

    const method = this.methods[methodName]
    if (method)
      method(data);
      
	 	console.log("---- done recieving ----");
	}
}
