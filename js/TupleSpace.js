
export default class TupleSpace {
  static LOCAL_STORAGE_ID = 'tupleSpace';

  constructor() {
    this.data = {};
    this.callbacks = [];
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

  put(tuple) {
    if (!this.data[tuple.id])
      this.data[tuple.id] = [];
    this.data[tuple.id].push(tuple);

    this.callCallbacks();
  }

  observe(callback) {
    this.callbacks.push(callback);
  }

  callCallbacks() {
    this.callbacks.forEach(callback => callback());
  }

  load = () => {
    if(typeof(Storage) === "undefined")
      return;
    const store = localStorage.getItem(TupleSpace.LOCAL_STORAGE_ID);
    this.data = JSON.parse(store) || {};
  };

  save = () => {
    if(typeof(Storage) === "undefined")
      return;
    localStorage.setItem(
      TupleSpace.LOCAL_STORAGE_ID, 
      JSON.stringify(this.data)
    )
  };

  reset() {
    localStorage.removeItem(TupleSpace.LOCAL_STORAGE_ID);
    this.data = {};
    this.callCallbacks();
  }

}
