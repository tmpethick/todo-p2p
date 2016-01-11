import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';
import yocto from 'yocto';

class TodoItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      content: props.content,
      isComplete: props.isComplete
    }
  }

  toggleCompleted(event) {
    this.setState({isComplete: !this.state.isComplete});
  }

  render() {
    return (
      <li className={this.state.isComplete ? "completed" : ""}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            defaultChecked={this.state.isComplete} />
          <label>{this.state.content}</label>
        </div>
        <input className="edit" value="Create a TodoMVC template" />
      </li>
    );
  }

}

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {items: []};
    this.tupleSpace = props.tupleSpace;
  }

  componentDidMount() {
    this.tupleSpace.get({'type': 'todoItem'}, items => {
      this.setState({items: items});
    });
  }

  render() {
    return (
       <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input className="new-todo" 
              placeholder="What needs to be done?" />
          </header>

          <section className="main">
            <ul className="todo-list">

              {this.state.items.map(todo => <TodoItem key={todo.id} {...todo} />)}

            </ul>
          </section>
          <footer className="footer"></footer>
        </section>
       </div>
    );
  }
}

var tupleSpace = new TupleSpace();
tupleSpace.put({
  'id': UUID.create().toString(),
  'type': 'todoItem',
  'content': 'Gøgl',
  'isComplete': true
});
tupleSpace.put({
  'id': UUID.create().toString(),
  'type': 'todoItem',
  'content': 'Gøgl',
  'isComplete': true
});

ReactDOM.render(
  <App tupleSpace={tupleSpace} />, 
  document.getElementById('app')
);
