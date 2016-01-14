import Peer from 'peerjs'
import UUID from 'uuid-js'
import Promise from 'bluebird'

export default class Network {
  static host = "10.16.163.9";
  static port = 9000;

  constructor(userID) {
    this.checkIfOnline = setInterval(this.waitForConnection.bind(this), 1000);

    this.uuid = UUID.create().toString();
    console.log("My id: " + this.uuid)
    this.peer = new Peer(this.uuid, {
      host: Network.host, 
      port: Network.port, 
      path: '/'
    })
    this.connectedPeers = {}
    this.methods = {}

    this.peer.on('connection', this.initConnection)

		this.peer.on("open", () => {
			console.log("open");
		})

		this.peer.on("close", () => {
			console.log("closed");
		})
		
		this.peer.on("disconnected", () => {
			console.log("disconnected");
		})

    window.onunload = e => {
      if (this.peer && !this.peer.destroyed) {
        this.peer.destroy()
      }
    }
  }
  
  /**
   * Connect to peers
   */
  join() {
    this.peer.listAllPeers((peers) => {
      peers.forEach((peer) => {
        if (peer != this.peer.id && !this.connectedPeers.hasOwnProperty(peer)) {
          this.connectToPeer(peer);
        }
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

  connectToPeer(peer) {
    let conn = this.peer.connect(peer, {
      serialization: 'json'
    })
    this.initConnection(conn)
  }

  initConnection = (conn) => {
    
    conn.on('open', () => {
	    console.log("Connecting established to: ", conn.peer)
    })
    
    this.saveConnection(conn)

    /**
     * @param {String}  data.method         method name
     * @param {Object}  data.data           arguments to method
     * @param  {uuid}   data.responseMethod a method name to call on the peer
     *                                      with the response.
     */
    conn.on('data', (data) => {
      const res = this._callMethod(data.method, data.data, data.invokeOnce)

      // Call oneUse method on peer with response
      if (data.responseMethod) {
        return Promise.all([res])
          .then((result) => {
            return this.invokePeerMethod(conn.peer, data.responseMethod, result[0], true)
          })
      }
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

    const promises = Object.keys(this.connectedPeers).map((id) => {
      console.log("Reciever: " +  id)
      return this.invokePeerMethod(id, methodName, data)
    })
    console.log("-- done sending --")

    return Promise.all(promises)
  }

  /**
   * Call a `Network.methods` method on a peer.
   * The peer method can return a response which will be returned on Promise.resolve.
   * @param  {String} peerId          the uuid of the peer
   * @param  {String} methodName      the name of the method
   * @param  {Object} data            method arguments
   * @param  {bool}   responseRequest if it's invoked to send back a response
   * @return {Promise}
   */ 
  invokePeerMethod(peerId, methodName, data, responseRequest) {
    return new Promise((resolve, reject) => {
      if (!this.connectedPeers.hasOwnProperty(peerId)) {
        reject()
      }

      let resId = responseRequest ? undefined : UUID.create().toString()

      // TODO: delete if never called
      this.createMethod(resId, resolve)
      
      this.connectedPeers[peerId].send({
        method: methodName, 
        data: data,
        responseMethod: resId,
        invokeOnce: responseRequest
      })
    })
  }

  _callMethod = (methodName, data, invokeOnce) => {
 
   	console.log("---- recieving ----")
  	console.log(methodName);
    console.log("---- done recieving ----")

    const method = this.methods[methodName]
    if (method) {
      // responseMethods are oneUse only and should be deleted.
      if (invokeOnce)
        delete this.methods[methodName]

      return method(data);
    } else {
      console.err(`Network: method '${methodName}' does not exist`)
      return Promise.reject()
    }
      
	};
}
