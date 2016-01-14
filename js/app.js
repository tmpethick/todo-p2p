import Network from './Network2';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';
import TodoItemModel from './model/TodoItem';
import TodoListModel from './model/TodoList';
import {onUnload} from './utils/onUnload.js';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.tupleSpace = props.tupleSpace;
    this.todoList = new TodoListModel({}, this.tupleSpace);
  }

  componentDidMount() {
    this.tupleSpace.observe(this.forceUpdate.bind(this));
    this.props.onReady();
  }

  sortTodoList() {
    return this.todoList.getItems().sort(
      (a, b) =>  b.data.creationDate - a.data.creationDate);
  }

  clearLocalStorage = (event) => {
    this.tupleSpace.reset();
    event.preventDefault();
  };

  forceSync = (event) => {
    this.tupleSpace.forceSync();
    event.preventDefault();    
  };

  render() {
    var items = this.sortTodoList();
    return (
       <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <NewTodoInput tupleSpace={this.tupleSpace} />
          </header>

          <section className="main">
            <ul className="todo-list">

              {items.map(todo => (
                <TodoItem tupleSpace={this.tupleSpace} 
                  key={todo.data.id} todo={todo} />
              ))}

            </ul>
          </section>
          <footer className="footer">
            <ul className="filters">
              <li>
                <a href="#" onClick={this.clearLocalStorage}>Clear localStorage</a>
              </li>
              <li>
                <a href="#" onClick={this.forceSync}>Force sync</a>
              </li>
            </ul>
          </footer>
        </section>
       </div>
    );
  }

}

class NewTodoInput extends React.Component {

  constructor(props) {
    super();
    this.tupleSpace = props.tupleSpace;
    this.state = {newTodoInput: ''};
  }

  handleInputChange(event) {
    this.setState({newTodoInput: event.target.value});
  }

  createTodoItem() {
    const content = this.state.newTodoInput;
    if (!content)
      return;
    
    const todoItem = TodoItemModel.create({content: content});

    this.tupleSpace.put(todoItem.toTuple());

    this.setState({newTodoInput: ''});    
  }

  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.createTodoItem();
    }
  }

  render() {
    return (
      <input className="new-todo" 
        value={this.state.newTodoInput}
        onChange={this.handleInputChange.bind(this)}
        placeholder="What needs to be done?"
        onKeyDown={this.handleKeyDown.bind(this)} />
    );
  }
}


class TodoItem extends React.Component {

  constructor(props) {
    super();
    this.state = {
      editing: false,
      editTodoInput: props.todo.data.content
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editTodoInput: nextProps.todo.data.content});
  }

  handleInputChange(event) {
    this.setState({editTodoInput: event.target.value});
  }

  toggleCompleted(event) {
    var newItem = this.props.todo.copy({
      isComplete: !this.props.todo.data.isComplete,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  blockCompleted(event) {
    var newItem = this.props.todo.copy({
      isBlocked: true,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  editCompleted(event) {
    const content = this.state.editTodoInput;
    if (!content)
      return;
      
    var newItem = this.props.todo.copy({
      content: content,
      isBlocked: false,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  removeCompleted(event) {
    var newItem = this.props.todo.copy({
      isRemoved: true,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  focusEditField(event) {
    if (this.props.todo.data.isBlocked)
      return;
    this.blockCompleted();
    this.setState({editing: true});
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.edit).focus();
    });
  };

  blurEditField(event) {
    this.setState({editing: false});
    this.editCompleted();
  };
  
  
  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.blurEditField();
    }
  }

  render() {
    const {isComplete, isRemoved, isBlocked, content} = this.props.todo.data;
    return (
      <li className={(this.state.editing ? 'editing' : '') + (isComplete ? " completed" : "")  + (isRemoved ? " removed" : "") + (isBlocked ? " blocked" : "")}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            checked={isComplete} 
            disabled={(isBlocked ? 'disabled' : '')} />
          <label onDoubleClick={this.focusEditField.bind(this)}>{content}</label>
          <button className="destroy" 
            onClick={this.removeCompleted.bind(this)}
            disabled={(isBlocked ? 'disabled' : '')} ></button>
        </div>
        <input 
          className="edit" 
          value={this.state.editTodoInput} 
          onChange={this.handleInputChange.bind(this)} 
          onBlur={this.blurEditField.bind(this)} 
          onKeyDown={this.handleKeyDown.bind(this)} 
          ref="edit" />
      </li>
    );
  }
}

var network = new Network();

var tupleSpace = new TupleSpace(network);
tupleSpace.load();
window.onunload = tupleSpace.save;

// Make sure network is only joined when interface is ready
const start = () => network.join();

// for testing
window.tupleSpace = tupleSpace;

ReactDOM.render(
  <App tupleSpace={tupleSpace} onReady={start} />, 
  document.getElementById('app')
);
