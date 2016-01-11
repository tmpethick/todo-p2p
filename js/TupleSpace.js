
export default class TupleSpace {
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

}
