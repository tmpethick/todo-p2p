import yocto from 'yocto';

export default class TupleSpace {
  constructor() {
    this.db = yocto.db({uuid: 'id'});
  }
}

['put', 'get', 'take', 'each', 'drop', 'destroy', 'sort', 'save', 'load', 
 'observe', 'unobserve', 'status'].forEach((key) => {
    TupleSpace.prototype[key] = function() {
      return this.db[key].apply(this.db, arguments);
    };
 });
