
export default class TupleSpace {
  static LOCAL_STORAGE_ID = 'tupleSpace';

  constructor() {
    this.data = {};
    this.callbacks = [];
  }

  get(template) {
    return Object.keys(this.data).filter(key => {
      // Match against the first element in the uuid list
      let item = this.data[key][0];

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

    this.callCallbacks();
  }

  observe(callback) {
    this.callbacks.push(callback);
  }

  callCallbacks() {
    this.callbacks.forEach(callback => callback());
  }

  load = () => {
    if (!window.localStorage)
      return;
    const store = window.localStorage.getItem(TupleSpace.LOCAL_STORAGE_ID);
    this.data = JSON.stringify(store);
  };

  save = () => {
    if (!window.localStorage)
      return;
    window.localStorage.setItem(
      TupleSpace.LOCAL_STORAGE_ID, 
      JSON.stringify(this.data)
    )
  };

}
