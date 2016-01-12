import Tuple from './Tuple';

export default class TodoItem extends Tuple {
  constructor(data) {
    data = Object.assign({
      'isComplete': false
    }, data);
    super(data);
    this.data.type = 'todoItem';
  }

  copy(modifications) {
    var todo = new TodoItem(Object.assign({}, this.data, modifications, {
      id: this.data.id,
      timestamp: new Date().getTime()
    }));
    return todo;
  }

  static create(data) {
    return new TodoItem(data);
  }
}