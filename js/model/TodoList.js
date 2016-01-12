import Tuple from './Tuple';
import TodoItem from './TodoItem';

export default class TodoList extends Tuple {
  constructor(data, tupleSpace) {
    super(data);
    this.data.type = 'todoList';
    this.tupleSpace = tupleSpace;
  }

  create(data) {
    return new TodoList(data);
  }

  getItems() {
    return this.tupleSpace
      .get({'type': 'todoItem'})
      .map(item => new TodoItem(item));
  }
}