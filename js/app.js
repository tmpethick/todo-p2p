import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';

class TodoItem extends React.Component {
  toggleCompleted(event) {
    this.props.tupleSpace.put({
      content: this.props.content,
      isComplete: !this.props.isComplete,
      type: this.props.type,
      id: this.props.id,
      timestamp: new Date().getTime()
    });
  }

  render() {
    return (
      <li className={this.props.isComplete ? "completed" : ""}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            checked={this.props.isComplete} />
          <label>{this.props.content}</label>
        </div>
        <input className="edit" value="Create a TodoMVC template" />
      </li>
    );
  }

}

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {newTodoInput: ''};
    this.tupleSpace = props.tupleSpace;
    this.network = new Network(this.getUserID());
    this.network.connectToPeers();
		
		console.log("Henter lokal storage");
		if(typeof(Storage) !== "undefined") {
			if (localStorage.tupleSpace) {
				console.log(localStorage.tupleSpace);
				 let tuples = JSON.parse(localStorage.tupleSpace);
				 for (let key in tuples.data) {
					 console.log(tuples.data[key][0].content);
					 this.createTodoItem(tuples.data[key][0]);
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

  createTodoItem(todoItem) {
    if (!todoItem.content)
      return;
    this.tupleSpace.put(todoItem);

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
	    var todoItem = {
									      content: this.state.newTodoInput,
									      isComplete: false,
									      type: 'todoItem',
									      id: UUID.create().toString(),
									      timestamp: new Date().getTime()
									    };
	    this.createTodoItem(todoItem);
			this.network.sendTodo(todoItem);
    }
      
  }

  render() {
    var items = this.tupleSpace.get({'type': 'todoItem'});
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
                  key={todo.id} {...todo} />
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
	  this.createTodoItem(todoItem);
  }
  
  getUserID() {
		if(typeof(Storage) !== "undefined") {
			if (!localStorage.uuid) {
				localStorage.uuid = UUID.create().toString();
			}
			return localStorage.uuid;
		} else {
			console.log("Sorry, your browser does not support web storage...");
    }
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

var tupleSpace = new TupleSpace();
/*
tupleSpace.put({
  'id': UUID.create().toString(),
  'type': 'todoItem',
  'content': 'Gøgl',
  'isComplete': true,
	'timestamp': new Date().getTime()
});
tupleSpace.put({
  'id': UUID.create().toString(),
  'type': 'todoItem',
  'content': 'Gøgl',
  'isComplete': false,
	'timestamp': new Date().getTime()
});
*/

window.tupleSpace = tupleSpace;
ReactDOM.render(
  <App tupleSpace={tupleSpace} />, 
  document.getElementById('app')
);
