import React from 'react';
import TodoListModel from '../model/TodoList';
import NewTodoInput from './NewTodoInput.react';
import TodoItem from './TodoItem.react';


export default class App extends React.Component {

  constructor(props) {
    super();
    this.tupleSpace = props.tupleSpace;
    this.todoList = new TodoListModel({}, this.tupleSpace);
    this.state = {networkState: ''};
    this.state.networkState = navigator.onLine ? 'online' : 'offline';
    this.forceUpdate = this.forceUpdate.bind(this)
  }

  componentDidMount() {
    this.tupleSpace.observe(this.forceUpdate);
    window.addEventListener('offline',() => {this.setState({networkState: 'offline'});console.log('offline')},false);
    window.addEventListener('online',() => {this.setState({networkState: 'online'});console.log('online')},false);
    this.props.onReady();
  }

  componentWillUnmount() {
    this.tupleSpace.unobserve(this.forceUpdate);
  }

  sortTodoList() {
    return this.todoList.getItems().sort(
      (a, b) =>  b.data.creationDate - a.data.creationDate);
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
            <h1>Todos</h1>
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
              <li>
                {(this.state.networkState === 'offline') ? <a href="#" onClick={location.reload.bind(location)}>Refresh</a> : ''}
              </li>
            </ul>
          </footer>
        </section>
       </div>
    );
  }

}
