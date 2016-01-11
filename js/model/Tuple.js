import UUID from 'uuid-js';

export default class Tuple {
  constructor(data) {
    this.data = Object.assign({
      timestamp: new Date().getTime(),
      id: UUID.create().toString()
    }, data);
  }

  toTuple() {
    return this.data;
  }
}