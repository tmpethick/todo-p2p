import Peer from 'peerjs'
import UUID from 'uuid-js'

export default class Network {
  static host = "10.16.168.102";
  static port = 9000;

  constructor(userID) {
    this.uuid = UUID.create().toString();
    this.peer = new Peer(this.uuid, {
      host: Network.host, 
      port: Network.port, 
      path: '/'
    })

    this.connectedPeers = {}

    this.callbacks = []

    // Hvad der skal ske, når en opretter forbindelse i mellem to peers
    this.peer.on('connection', (conn) => {
      conn.on('data', (data) => {

        if (conn.label == 'connected') {
          data.replace('"', '"')
          var todoItem = JSON.parse(data)
          this.callCallbacks(todoItem)
          console.log('Todoitem ' + todoItem.content + ' recieved')
        } else if (conn.label == 'connecting') {
          console.log('Peer trying to connect to you: ' + conn.peer)
          this.connectToPeer(conn.peer, "")
          conn.label = 'connected'
        } else if (conn.label == 'backconnecting') {
          console.log('Peer has responded you: ' + conn.peer)
          console.log('Connection established')
          conn.label = 'connected'
        }

      })

    })

    /*
    this.peer.on('disconnected', () => {
      // fire when no internet (after `close`)
      console.log('You have been disconnected from the server')
    })

    this.peer.on('close', () => {
      // fire when no internet
      console.log('Your connection has been closed')
    })

    // Når en forbinder til serveren
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id)
      this.listAllConnectedPeers()
    })
    */
  }

  /*
  listAllConnectedPeers() {
    console.log('All connected peers:')
    for (var key in this.connectedPeers) {
      console.log(key);
    }
  }
  */

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

  connectToPeer(peer) {
    var conn

    conn = this.peer.connect(peer, {
      label: 'backconnecting',
      serialization: 'none'
    })

    conn.on('open', function () {
      conn.send();
    })

    conn.on('error', (err) => {
      this.removeOfflinePeer(err, conn.peer)
    })

    this.connectedPeers[peer] = conn

  }

  removeOfflinePeer(err, offlinePeer) {
    console.log(err)
    delete this.connectedPeers[offlinePeer]
    console.log('Deleted: ' + offlinePeer)
    console.log('The rest:')
  }

  /*
  getUserID() {
    if (typeof (Storage) !== 'undefined') {
      if (!localStorage.uuid) {
        localStorage.uuid = UUID.create().toString()
      }
      return localStorage.uuid
    } else {
      console.log('Sorry, your browser does not support web storage...')
    }
  }*/

  sendTodo(todoItem) {
    var jsonString = JSON.stringify(todoItem)
    for (var key in this.connectedPeers) {
      console.log('Todoitem ' + todoItem.content + ' send')
      this.connectedPeers[key].send(jsonString)
    }
  }

  getTodoItem() {
    return this.todoItem
  }

  observe(callback) {
    this.callbacks.push(callback)
  }

  callCallbacks(todoItem) {
    console.log('Size of callbacks: ' + this.callbacks.length)
    this.callbacks.forEach(callback => callback(todoItem))
  }

}
