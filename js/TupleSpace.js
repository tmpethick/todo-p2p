import {getItem, setItem, removeItem} from './Store';

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

  put(tuple) {
    if (!this.data[tuple.id])
      this.data[tuple.id] = [];
    this.data[tuple.id].push(tuple);

    tuple.timestamp
    this.callCallbacks();
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

}
