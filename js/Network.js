import Peer from 'peerjs';
import UUID from 'uuid-js';

export default class Network {

  constructor(userID) {
  
    this.peer = new Peer(this.getUserID(), {host: '10.16.173.36', port: 9000, path: '/'});

		this.connectedPeers = {};

		this.todoItem;
		this.callbacks = [];

		// Hvad der skal ske, når en opretter forbindelse i mellem to peers
    this.peer.on("connection", (conn) => {
    	conn.on("data", (data) => {
    	
	    	if (conn.label == "connected") {
	    		data.replace('"', '\"');
					this.todoItem = JSON.parse(data);
	    		this.callCallbacks();	
	    		console.log("Todoitem " + this.todoItem.content + " recieved");
    		} else if (conn.label == "connecting") {
		    	console.log("Peer trying to connect to you: " + conn.peer);
					this.connectToPeer(conn.peer);
					this.listAllConnectedPeers();
					conn.label = "connected";
    		} else if (conn.label == "backconnecting") {
		    	console.log("Peer has responded you: " + conn.peer);
					this.listAllConnectedPeers();
	    		console.log("Connection established");
					conn.label = "connected";
    		}
    		
    		
    		
    	});
    	
    });

		this.peer.on('close', () => {
			console.log("bye close");
			for (var key in this.connectedPeers) {
				this.connectedPeers[key].send("Closed");
			}
		});
		
		// Når en forbinder til serveren
		this.peer.on('open', (id) => {
		  console.log('My peer ID is: ' + id);
			this.listAllConnectedPeers();
		});
	
  }

	listAllConnectedPeers() {
		console.log("All connected peers:");
		for (var key in this.connectedPeers) {
			console.log(key);
		}
	}

  connectToPeers() {
    // TODO: do actually connect..
    this.peer.listAllPeers((peers) => {
		console.log(peers);
		
			peers.forEach((peer) => {
				
				var conn;

				if (!(peer in this.connectedPeers) && peer != this.peer.id) {
					conn = this.peer.connect(peer, {
						label: 'connecting',
				    serialization: 'none',
				    metadata: {message: 'Hey you, lets make a todolist!'}
					});
					
					conn.on('open', function() {
						conn.send(conn.metadata.message);
					});
					
					conn.on('error', function(err) { alert(err); });
					
					this.connectedPeers[peer] = conn;
				}
				
			});
		
    });

  }

	connectToPeer(peer) {
	
		var conn;

		conn = this.peer.connect(peer, {
			label: 'backconnecting',
	    serialization: 'none',
	    metadata: {message: 'Hey there, sounds like a plan!'}
		});
		
		conn.on('open', function() {
			conn.send(conn.metadata.message);
		});
		
		conn.on('error', function(err) { alert(err); });
		
		this.connectedPeers[peer] = conn;
		
  }
  
   getUserID() {
		if(typeof(Storage) !== "undefined") {
			if (!localStorage.uuid) {
				localStorage.uuid = UUID.create().toString();
			}
			return localStorage.uuid;
		} else {
			console.log("Sorry, your browser does not support web storage...");
    }
	}

	sendTodo(todoItem) {
		var jsonString = JSON.stringify(todoItem);
		for (var key in this.connectedPeers) {
			console.log("Todoitem " + todoItem.content + " send");
			this.connectedPeers[key].send(jsonString);
		}	
	}
	
	getTodoItem() {
		return this.todoItem;
	}
  
  observe(callback) {
    this.callbacks.push(callback);
  }
  
  callCallbacks() {
 	  console.log("Size of callbacks: " + this.callbacks.length);
    this.callbacks.forEach(callback => callback());
  }
/*
  disconnect() {
		for (var key in this.connectedPeers) {
			this.peer.disconnect(this.connectedPeers[key].peer);
			this.peer.on('disconnected', () => {
			console.log("bye disconnect");
			for (var key in this.connectedPeers) {
				this.connectedPeers[key].send("Disconnected");
			}		
		});
		}		

  }
*/
  
}

