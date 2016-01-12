import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';
import TodoItemModel from './model/TodoItem';
import TodoListModel from './model/TodoList';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {newTodoInput: ''};
    this.tupleSpace = props.tupleSpace;
    this.todoList = new TodoListModel({}, this.tupleSpace);
		this.network = props.network;
  }

  handleInputChange(event) {
    this.setState({newTodoInput: event.target.value});
  }

  componentDidMount() {
    this.tupleSpace.observe(this.forceUpdate.bind(this));
    this.network.observe(this.getTodoItemFromNetwork.bind(this));
  }

  createTodoItem() {
    const content = this.state.newTodoInput;
    if (!content)
      return;
		
    const todoItem = TodoItemModel.create({content: content});

    this.tupleSpace.put(todoItem.toTuple());
    
    this.network.sendTodo(todoItem.toTuple());

    this.setState({newTodoInput: ''});    
  }

  sortTodoList() {
    return this.todoList.getItems().sort(
      (a, b) =>  b.data.creationDate - a.data.creationDate);
  }

  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.createTodoItem();
    }
  }

  clearLocalStorage = (event) => {
    this.tupleSpace.reset();
    event.preventDefault();
  };

  render() {
    var items = this.sortTodoList();
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
                  key={todo.data.id} todo={todo} network={this.network} />
              ))}

            </ul>
          </section>
          <footer className="footer">
            <ul className="filters">
              <li>
                <a href="#" onClick={this.clearLocalStorage}>Clear localStorage</a>
              </li>
            </ul>
          </footer>
        </section>
       </div>
    );
  }
  
  getTodoItemFromNetwork() {
	  var todoItem = this.network.getTodoItem();
	  console.log("Returned " + todoItem.content + ", id: " + todoItem.id);
	  
    this.tupleSpace.put(TodoItemModel.create(todoItem).toTuple());
  }

}

class TodoItem extends React.Component {

  constructor(props) {
	  super();
		this.state = {editTodoInput: '', editing: false};
  }
  
  handleInputChange(event) {
    this.setState({editTodoInput: event.target.value});
  }

  toggleCompleted(event) {
    var newItem = this.props.todo.copy({
      isComplete: !this.props.todo.data.isComplete,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
    this.props.network.sendTodo(newItem);
  }
  
  
	changeEditField(event) {
		this.setState({editing: !this.state.editing});
		
		if (!this.state.editing) {
			var input = document.querySelector(".editing .edit").focus();
		}

  }
  

 /*
 editCompleted(event) {
    var newItem = this.props.todo.copy({
      content: this.state.editTodoInput;
    }).toTuple();
    this.props.tupleSpace.put(newItem);
    this.props.network.sendTodo(newItem);
  }
*/
	render() {
    const {isComplete, content} = this.props.todo.data;
    return (
      <li className={(this.state.editing ? 'editing' : '') + (isComplete ? " completed" : "")}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            checked={isComplete} />
          <label onDoubleClick={this.changeEditField.bind(this)}>{content}</label>
          <button className="destroy"></button>
        </div>
        <input 
        	className="edit" 
        	value={this.state.editTodoInput} 
          onChange={this.handleInputChange.bind(this)} 
          onBlur={this.changeEditField.bind(this)} 
          ref="edit"
        />
      </li>
    );
  }
}

var network = new Network();
network.connectToPeers();

var tupleSpace = new TupleSpace();
tupleSpace.load();
window.onunload = tupleSpace.save;

// for testing
window.tupleSpace = tupleSpace;

ReactDOM.render(
  <App tupleSpace={tupleSpace} network={network} />, 
  document.getElementById('app')
);
