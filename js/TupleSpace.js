import {getItem, setItem, removeItem} from './Store';

export default class TupleSpace {
  static LOCAL_STORAGE_ID = 'tupleSpace';
  static TIMESTAMP_ID = 'lastOnlineTimestamp';

  constructor(network) {
    this.data = {};
    this.callbacks = [];
    this.network = network;

    this.network.createMethod('addTuple', this._put);
    this.network.createMethod('sendTupleSpace', this._sendTupleSpace);
    this.network.createMethod('mergeTupleSpace', this._mergeTupleSpace);
  }

  get(template) {
    return Object.keys(this.data).filter(key => {
      // Match against the first element in the uuid list
      let itemHistory = this.data[key];
      let item = itemHistory[itemHistory.length-1];

      for (let key in Object.keys(template)) {
        if (template[key] !== item[key]) 
          return false;
      }
      return true;
    }).map(key => {
      // pick the last item in the uuid list
      let item = this.data[key];
      return item[item.length-1]
    });
  }

  _mergeTupleSpace = (tupleSpaceData) => {
    for (let id in tupleSpaceData) {
      if (!tupleSpaceData.hasOwnProperty(id))
        continue
      this.data[id] = this._mergeItemHistories(
        this.data[id] || [], 
        tupleSpaceData[id]
      );
    }
    this.callCallbacks();
  };

  _sendTupleSpace = (peerId) => {
    this.network.invokePeerMethod(peerId, 'mergeTupleSpace', this.data);
  };

  _mergeItemHistories(history1, history2) {
    // TODO: consider unique id per item
    let history = [];

    while (history1.length && history2.length) {
      const t1 = history1[0].timestamp;
      const t2 = history2[0].timestamp;

      if (t1 < t2) {
        history.push(history1.shift());
      } else {
        history.push(history2.shift());

        if (t1 === t2)
          history1.shift();
      }
    }

    [history1, history2].forEach((h) => {
      while (h.length)
        history.push(h.shift());
    })

    return history;
  }

  getSinceTime(timestamp) {
    var data = {};

    for (var key of Object.keys(this.data)) {
      var itemHistory = this.data[key];
      var index = this.findIndexOlderThan(itemHistory, timestamp);
      data[key] = itemHistory.slice(index, itemHistory.length-1);
    }
    
    return data;
  }

  findIndexOlderThan(itemHistory,timestamp) {
    return itemHistory.findIndex(entry => timestamp < entry.timestamp);
  }

  _put = (tuple) => {
    if (!this.data[tuple.id])
      this.data[tuple.id] = [];
    this.data[tuple.id].push(tuple);

    if (this.network.isOnline()) {
      setItem(this.TIMESTAMP_ID, tuple.timestamp);
    }
    
    this.callCallbacks();
  };

  put(tuple) {
    this._put(tuple);
    this.network.invokeAllPeerMethods('addTuple', tuple);
  }

  observe(callback) {
    this.callbacks.push(callback);
  }

  callCallbacks() {
    this.callbacks.forEach(callback => callback());
  }

  load = () => {
    const data = getItem(TupleSpace.LOCAL_STORAGE_ID);
    if (data)
      this.data = data;
  };

  save = () => {
    setItem(TupleSpace.LOCAL_STORAGE_ID, this.data);
  };

  reset() {
    removeItem(TupleSpace.LOCAL_STORAGE_ID);
    this.data = {};
    this.callCallbacks();
  }

  forceSync() {
    let peerId = Object.keys(this.network.connectedPeers)[0];
    this.network.invokePeerMethod(peerId, 'sendTupleSpace', this.network.peer.id)
  }

}
