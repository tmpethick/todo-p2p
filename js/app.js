import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';
import yocto from 'yocto';
import TodoItemModel from './model/TodoItem';
import TodoListModel from './model/TodoList';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {newTodoInput: ''};
    this.tupleSpace = props.tupleSpace;
    this.todoList = new TodoListModel({}, this.tupleSpace);
  }

  handleInputChange(event) {
    this.setState({newTodoInput: event.target.value});
  }

  componentDidMount() {
    this.tupleSpace.observe(this.forceUpdate.bind(this));
  }

  createTodoItem() {
    if (!this.state.newTodoInput)
      return;
    this.tupleSpace.put(TodoItemModel.create({
      content: this.state.newTodoInput
    }).toTuple());

    this.setState({newTodoInput: ''});
  }

  handleKeyDown(event) {
    if (event.keyCode == 13)
      this.createTodoItem();
  }

  render() {
    var items = this.todoList.getItems();
    return (
       <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input className="new-todo" 
              value={this.state.newTodoInput}
              onChange={this.handleInputChange.bind(this)}
              placeholder="What needs to be done?"
              onKeyDown={this.handleKeyDown.bind(this)} />
          </header>

          <section className="main">
            <ul className="todo-list">

              {items.map(todo => (
                <TodoItem tupleSpace={this.tupleSpace} 
                  key={todo.data.id} todo={todo} />
              ))}

            </ul>
          </section>
          <footer className="footer"></footer>
        </section>
       </div>
    );
  }
}

class TodoItem extends React.Component {
  toggleCompleted(event) {
    this.props.tupleSpace.put(this.props.todo.copy({
      isComplete: !this.props.todo.data.isComplete
    }).toTuple());
  }

  render() {
    const {isComplete, content} = this.props.todo.data;
    return (
      <li className={isComplete ? "completed" : ""}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            checked={isComplete} />
          <label>{content}</label>
        </div>
        <input className="edit" value="Create a TodoMVC template" />
      </li>
    );
  }
}

var tupleSpace = new TupleSpace();
tupleSpace.put(TodoItemModel.create({
  'content': 'Gøgl',
  'isComplete': true
}).toTuple());
tupleSpace.put(TodoItemModel.create({
  'content': 'Gøgl'
}).toTuple());

window.tupleSpace = tupleSpace;
ReactDOM.render(
  <App tupleSpace={tupleSpace} />, 
  document.getElementById('app')
);
