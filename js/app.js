import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid-js';
import yocto from 'yocto';

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
    this.tupleSpace.put({
      content: this.state.newTodoInput,
      isComplete: false,
      type: 'todoItem',
      id: UUID.create().toString(),
      timestamp: new Date().getTime()
    });

    this.setState({newTodoInput: ''});
  }

  handleKeyDown(event) {
    if (event.keyCode == 13)
      this.createTodoItem();
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
  'isComplete': false
});

window.tupleSpace = tupleSpace;
ReactDOM.render(
  <App tupleSpace={tupleSpace} />, 
  document.getElementById('app')
);
