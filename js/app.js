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

    this.network = new Network();
    this.network.connectToPeers();
    
    console.log("Henter lokal storage");
    if(typeof(Storage) !== "undefined") {
      if (localStorage.tupleSpace) {
        console.log(localStorage.tupleSpace);
         let tuples = JSON.parse(localStorage.tupleSpace);
         for (let key in tuples.data) {
           console.log(tuples.data[key][0].content);
           this.tupleSpace.put(tuples.data[key][0]);
         }
      }
    } else {
      console.log("Sorry, your browser does not support web storage...");
    }
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
    
    if(typeof(Storage) !== "undefined") {
      localStorage.tupleSpace = JSON.stringify(this.tupleSpace);
      console.log(localStorage.tupleSpace);
    } else {
      console.log("Sorry, your browser does not support web storage...");
    }
  }

  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.createTodoItem();
    }
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
                  key={todo.data.id} todo={todo} network={this.network} />
              ))}

            </ul>
          </section>
          <footer className="footer"></footer>
        </section>
       </div>
    );
  }
  
  getTodoItemFromNetwork() {
	  var todoItem = this.network.getTodoItem();
	  console.log("Returned " + todoItem.content + ", id: " + todoItem.id);
	  
    this.tupleSpace.put(TodoItemModel.create(todoItem).toTuple());
  }
	
	getLatestTupleSpaceFromLocalStorage() {
		console.log("Henter seneste lokale tuple");
		var tupleSpace;
		if(typeof(Storage) !== "undefined") {
			if (localStorage.tupleSpace) {
				 tupleSpace = JSON.parse(localStorage.tupleSpace);
				 for (let key in tupleSpace.data) {
					 this.createTodoItem(creetupleSpace.data[key]);
				 }
			}
		} else {
			console.log("Sorry, your browser does not support web storage...");
		}
	}

}

class TodoItem extends React.Component {
  toggleCompleted(event) {
    var newItem = this.props.todo.copy({
      isComplete: !this.props.todo.data.isComplete
    }).toTuple();
    this.props.tupleSpace.put(newItem);
    this.props.network.sendTodo(newItem);
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

window.tupleSpace = tupleSpace;
ReactDOM.render(
  <App tupleSpace={tupleSpace} />, 
  document.getElementById('app')
);
