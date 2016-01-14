import Peer from 'peerjs'
import UUID from 'uuid-js'

export default class Network {
  static host = "10.16.168.102";
  static port = 9000;

  constructor(userID) {
    this.checkIfOnline = setInterval(this.waitForConnection.bind(this), 1000);
    this.tryToReconnect;

    this.uuid = "Sebastian"//UUID.create().toString();
    console.log("My id: " + this.uuid)
    this.peer = new Peer(this.uuid, {
      host: Network.host, 
      port: Network.port, 
      path: '/'
    })
    this.connectedPeers = {}
    this.methods = {}

    this.peer.on('connection', this.initConnection)

    this.peer.on('disconnect', () => {
   	 this.tryToReconnect = setInterval(this.waitForReconnection.bind(this), 1000);
    })

    window.onunload = e => {
      if (this.peer && !this.peer.destroyed) {
        this.peer.destroy()
      }
    };
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
    return Object.keys(this.connectedPeers).length > 0;
  }

  waitForConnection() {
    console.log("Waiting for connection...")
    if(this.isOnline()) {
      console.log("Welcome online")
      clearInterval(this.checkIfOnline);
    }
  }

	waitForReconnection() {
		console.log("Trying to reconnect");
		this.join();
		if (this.isOnline()) {
      console.log("Connected")
			clearInterval(tryToReconnect);
		}
	}

  connectToPeer(peer) {
    let conn = this.peer.connect(peer, {
      serialization: 'json'
    })
    this.initConnection(conn)
  }

  initConnection = (conn) => {
    console.log("Connecting established to: ", conn.peer)
    this.saveConnection(conn)

    conn.on('data', (data) => {
      this.callMethod(data.method, data.data)
    })

    conn.on('close', () => {
    	console.log("Connection lost to: ", conn.peer);
			delete this.connectedPeers[conn.peer]
			if (Object.keys(this.connectedPeers).length === 0) {
				this.checkIfOnline = setInterval(this.waitForConnection.bind(this), 1000);
			}
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
