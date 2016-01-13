import Tuple from './Tuple';

export default class TodoItem extends Tuple {
  constructor(data) {
    data = Object.assign({
      'isComplete': false,
      'isRemoved': false,
      'isBlocked': false,
      creationDate: new Date().getTime()
    }, data);
    super(data);
    this.data.type = 'todoItem';
  }

  copy(modifications) {
    var todo = new TodoItem(Object.assign({}, this.data, modifications, {
      id: this.data.id,
      timestamp: new Date().getTime(),
      creationDate: this.data.creationDate,
    }));
    console.log("Creation date: " + this.data.creationDate)
    return todo;
  }
 
  static create(data) {
    return new TodoItem(data);
  }
}