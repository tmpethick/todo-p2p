import React from 'react';
import TodoListModel from '../model/TodoList';
import NewTodoInput from './NewTodoInput.react';
import TodoItem from './TodoItem.react';
import NetworkStatus from './NetworkStatus.react';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.tupleSpace = props.tupleSpace;
    this.todoList = new TodoListModel({}, this.tupleSpace);
    this.forceUpdate = this.forceUpdate.bind(this)
  }

  sortItems(items) {
    return items.sort((a, b) =>  b.data.creationDate - a.data.creationDate);
  }

  clearLocalStorage = (event) => {
    this.tupleSpace.reset();
    event.preventDefault();
  };

  render() {
    var items = this.sortItems(this.todoList.getItems());
    return (
      <div>
        <NetworkStatus/>
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
            </ul>
          </footer>
        </section>
      </div>
    );
  }

}
