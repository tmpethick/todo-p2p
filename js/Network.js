import Peer from 'peerjs';
import UUID from 'uuid-js';

function getUserID() {
	if(typeof(Storage) !== "undefined") {
		if (!localStorage.uuid) {
			localStorage.uuid = UUID.create().toString();
		}
		return localStorage.uuid;
	} else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
}

export default class Network {

  constructor(userID) {
  
    this.peer = new Peer(userID, {host: 'localhost', port: 9000, path: '/'});

		this.connectedPeers = {};
		

		// Hvad der skal ske, når en opretter forbindelse i mellem to peers
    this.peer.on("connection", (conn) => {
    	conn.on("data", (data) => {
    		if (conn.label == "connecting") {
		    	console.log("Peer trying to connect to you: " + conn.peer);
					this.connectToPeer(conn.peer);
					this.listAllConnectedPeers();
    		}
    		
    		if (conn.label == "backconnecting") {
		    	console.log("Peer has responded you: " + conn.peer);
					this.listAllConnectedPeers();
	    		console.log("Connection established");
    		}
    		
    		console.log(data);
    		
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

var userID = getUserID();

var network = new Network(userID);

network.connectToPeers();

//network.disconnect();